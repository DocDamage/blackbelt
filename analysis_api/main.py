"""
Six Sigma Analysis API
FastAPI backend for automated statistical analysis
"""

import os
import logging
from datetime import datetime
from io import BytesIO
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from scipy import stats
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import statsmodels.api as sm
import uuid
import secrets

# Import persistent storage
from storage import store_result as db_store_result
from storage import get_result as db_get_result
from storage import list_results as db_list_results
from storage import delete_old_results, get_storage_stats

# Import authentication
from auth import (
    User, UserCreate, UserLogin, Token, hash_password, verify_password,
    create_access_token, get_current_user, require_admin, JWT_EXPIRATION_HOURS
)
from auth_storage import get_user_by_email, create_user, create_api_key, list_api_keys_for_user

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Six Sigma Analysis API",
    description="""
    Automated statistical analysis API for Six Sigma training platform.
    
    ## Features
    
    * **Authentication**: JWT-based authentication with API key support
    * **File Upload**: Upload CSV/Excel files for analysis
    * **Statistical Analysis**:
        * Descriptive statistics
        * Process capability (Cp, Cpk)
        * Linear regression
        * T-tests (one-sample, two-sample, paired)
        * Control charts (X-bar, R, I-MR)
    * **Data Export**: Export results as JSON or CSV
    
    ## Authentication
    
    Most endpoints require authentication via JWT token:
    1. Register at `/auth/register` or login at `/auth/login`
    2. Include the token in the Authorization header: `Bearer <token>`
    3. Alternatively, use API keys in the header: `X-API-Key: <key>`
    
    ## Rate Limiting
    
    All endpoints have rate limits to prevent abuse. Limits vary by endpoint.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    tags=[
        {"name": "Authentication", "description": "User registration, login, and API key management"},
        {"name": "Health", "description": "Health check and API information"},
        {"name": "Data", "description": "File upload and data preview"},
        {"name": "Analysis", "description": "Statistical analysis endpoints"},
        {"name": "Export", "description": "Export analysis results"},
    ]
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration - restrict to allowed origins
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173").split(",")
# Also allow production domain if specified
PRODUCTION_URL = os.getenv("PRODUCTION_URL")
if PRODUCTION_URL:
    ALLOWED_ORIGINS.append(PRODUCTION_URL)

logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# File upload configuration
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}

# In-memory cache for analysis results (persistent storage is primary)
# This provides fast access to recent results while database ensures durability
analysis_store: Dict[str, Dict] = {}

# ==================== MODELS ====================

class DescriptiveResult(BaseModel):
    column: str
    count: int
    mean: float
    std: float
    min: float
    max: float
    median: float
    q1: float
    q3: float
    variance: float

class CapabilityResult(BaseModel):
    column: str
    usl: float
    lsl: float
    target: Optional[float]
    mean: float
    std: float
    cp: float
    cpk: float
    cpu: float
    cpl: float
    ppm_above_usl: float
    ppm_below_lsl: float
    sigma_level: float
    capable: bool

class RegressionResult(BaseModel):
    r_squared: float
    adj_r_squared: float
    f_statistic: float
    f_pvalue: float
    coefficients: Dict[str, Dict[str, float]]
    residual_std_error: float
    observations: int

class TTestResult(BaseModel):
    test_type: str
    t_statistic: float
    p_value: float
    df: float
    mean_difference: Optional[float]
    confidence_interval: List[float]
    significant: bool
    alpha: float

class ControlChartResult(BaseModel):
    chart_type: str
    center_line: float
    ucl: float
    lcl: float
    subgroup_size: int
    out_of_control_points: List[int]
    data_points: List[float]

class AnalysisResponse(BaseModel):
    analysis_id: str
    timestamp: str
    analysis_type: str
    results: Any
    metadata: Dict[str, Any]

# ==================== UTILITIES ====================

def validate_file(file: UploadFile) -> None:
    """
    Validate uploaded file for security and correctness.
    Raises HTTPException if validation fails.
    """
    # Check file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = os.path.splitext(file.filename.lower())[1]
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{file_ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

def validate_file_size(content: bytes) -> None:
    """Validate file size to prevent DoS attacks"""
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB"
        )

def parse_file(file: UploadFile) -> pd.DataFrame:
    """Parse uploaded CSV or Excel file with security validation"""
    # Read file content
    content = file.file.read()
    file.file.seek(0)
    
    # Validate file size
    validate_file_size(content)
    
    # Validate file extension
    validate_file(file)
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use CSV or Excel.")
    except Exception as e:
        logger.error(f"File parsing error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
    
    # Validate data is not empty
    if df.empty:
        raise HTTPException(status_code=400, detail="File contains no data")
    
    # Check for reasonable row count (additional DoS protection)
    MAX_ROWS = int(os.getenv("MAX_ROWS", "100000"))
    if len(df) > MAX_ROWS:
        raise HTTPException(
            status_code=400, 
            detail=f"File has too many rows. Maximum is {MAX_ROWS:,}"
        )
    
    return df

def store_result(analysis_type: str, results: Any, metadata: Dict = None) -> str:
    """Store analysis results in both memory and persistent storage, return ID"""
    analysis_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().isoformat()
    
    # Store in memory for fast access
    analysis_store[analysis_id] = {
        "analysis_id": analysis_id,
        "timestamp": timestamp,
        "analysis_type": analysis_type,
        "results": results,
        "metadata": metadata or {}
    }
    
    # Store in persistent database
    try:
        db_store_result(analysis_id, analysis_type, results, metadata)
        logger.info(f"Stored analysis {analysis_id} in database")
    except Exception as e:
        logger.error(f"Failed to store analysis in database: {e}")
        # Continue even if database storage fails - memory storage works
    
    return analysis_id

def calculate_sigma_level(cpk: float) -> float:
    """Convert Cpk to approximate sigma level"""
    return cpk * 3 + 1.5  # Approximate with 1.5 sigma shift

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    storage_count: int

# ==================== AUTH ENDPOINTS ====================

@app.post(
    "/auth/register",
    response_model=Token,
    tags=["Authentication"],
    summary="Register new user",
    description="Create a new user account with email, password, and name. Returns JWT token upon success.",
    responses={
        400: {"description": "Email already registered"},
        429: {"description": "Rate limit exceeded"},
    }
)
@limiter.limit("5/minute")
async def register(request: Request, user_data: UserCreate):
    """Register a new user account"""
    existing = get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    password_hash = hash_password(user_data.password)
    user = create_user(user_data.email, password_hash, user_data.name)
    token = create_access_token(user["id"], user["email"], user["role"])
    return Token(
        access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRATION_HOURS * 3600,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
    )

@app.post(
    "/auth/login",
    response_model=Token,
    tags=["Authentication"],
    summary="User login",
    description="Authenticate with email and password. Returns JWT token for subsequent requests.",
    responses={
        401: {"description": "Invalid credentials"},
        403: {"description": "Account is disabled"},
        429: {"description": "Rate limit exceeded"},
    }
)
@limiter.limit("10/minute")
async def login(request: Request, credentials: UserLogin):
    """Authenticate user and return JWT token"""
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")
    token = create_access_token(user["id"], user["email"], user["role"])
    return Token(
        access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRATION_HOURS * 3600,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
    )

@app.get(
    "/auth/me",
    tags=["Authentication"],
    summary="Get current user",
    description="Get information about the currently authenticated user.",
    responses={
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("30/minute")
async def get_current_user_info(request: Request, current_user: User = Depends(get_current_user)):
    """Get current authenticated user info"""
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name, "role": current_user.role}

@app.post(
    "/auth/api-keys",
    tags=["Authentication"],
    summary="Create API key",
    description="Generate a new API key for programmatic access. API keys do not expire.",
    responses={
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("5/minute")
async def create_new_api_key(request: Request, name: str = Form(...), current_user: User = Depends(get_current_user)):
    """Generate a new API key for the authenticated user"""
    api_key = f"ss_{secrets.token_urlsafe(32)}"
    key_data = create_api_key(current_user.id, name, api_key)
    return {"id": key_data["id"], "key": api_key, "name": name, "created_at": key_data["created_at"]}

@app.get(
    "/auth/api-keys",
    tags=["Authentication"],
    summary="List API keys",
    description="List all API keys for the authenticated user. Keys are masked for security.",
    responses={
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("30/minute")
async def list_user_api_keys(request: Request, current_user: User = Depends(get_current_user)):
    """List all API keys for the current user"""
    keys = list_api_keys_for_user(current_user.id)
    return [{"id": k["id"], "name": k["name"], "created_at": k["created_at"], "last_used_at": k.get("last_used_at"), "is_active": k["is_active"]} for k in keys]

# ==================== HEALTH ENDPOINT ====================

@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check",
    description="Check API health status. Returns status, version, timestamp, and storage statistics.",
)
@limiter.limit("60/minute")
async def health_check(request: Request):
    """Dedicated health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now().isoformat(),
        storage_count=len(analysis_store)
    )

# ==================== ENDPOINTS ====================

@app.get(
    "/",
    tags=["Health"],
    summary="API info",
    description="Get API information and list of available endpoints.",
)
@limiter.limit("60/minute")
async def root(request: Request):
    return {
        "name": "Six Sigma Analysis API",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/auth/register",
            "/auth/login",
            "/auth/me",
            "/auth/api-keys",
            "/upload",
            "/analyze/descriptive",
            "/analyze/capability",
            "/analyze/regression",
            "/analyze/ttest",
            "/analyze/control-chart",
            "/export/json/{analysis_id}",
            "/export/csv/{analysis_id}"
        ]
    }

@app.post(
    "/upload",
    tags=["Data"],
    summary="Upload file",
    description="Upload a CSV or Excel file for analysis. Returns file preview and column information.",
    responses={
        400: {"description": "Invalid file format or empty file"},
        401: {"description": "Not authenticated"},
        413: {"description": "File too large"},
    }
)
@limiter.limit("20/minute")
async def upload_file(request: Request, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Upload and preview a data file"""
    df = parse_file(file)
    
    logger.info(f"File uploaded: {file.filename}, {len(df)} rows, {len(df.columns)} columns")
    
    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "preview": df.head(5).to_dict(orient="records"),
        "numeric_columns": list(df.select_dtypes(include=[np.number]).columns)
    }

@app.post(
    "/analyze/descriptive",
    response_model=AnalysisResponse,
    tags=["Analysis"],
    summary="Descriptive statistics",
    description="Calculate descriptive statistics (mean, std, min, max, quartiles) for numeric columns.",
    responses={
        400: {"description": "Invalid file or column not found"},
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("10/minute")
async def analyze_descriptive(
    request: Request,
    file: UploadFile = File(...),
    columns: Optional[str] = Form(None, description="Comma-separated list of columns to analyze. If not provided, all numeric columns are analyzed."),
    current_user: User = Depends(get_current_user)
):
    """Calculate descriptive statistics for numeric columns"""
    df = parse_file(file)
    
    if columns:
        cols = [c.strip() for c in columns.split(',')]
    else:
        cols = list(df.select_dtypes(include=[np.number]).columns)
    
    results = []
    for col in cols:
        if col in df.columns:
            data = df[col].dropna()
            results.append(DescriptiveResult(
                column=col,
                count=int(len(data)),
                mean=round(float(data.mean()), 4),
                std=round(float(data.std()), 4),
                min=round(float(data.min()), 4),
                max=round(float(data.max()), 4),
                median=round(float(data.median()), 4),
                q1=round(float(data.quantile(0.25)), 4),
                q3=round(float(data.quantile(0.75)), 4),
                variance=round(float(data.var()), 4)
            ))
    
    analysis_id = store_result("descriptive", [r.dict() for r in results], {
        "filename": file.filename,
        "columns_analyzed": cols
    })
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        timestamp=datetime.now().isoformat(),
        analysis_type="descriptive",
        results=[r.dict() for r in results],
        metadata={"filename": file.filename}
    )

@app.post(
    "/analyze/capability",
    response_model=AnalysisResponse,
    tags=["Analysis"],
    summary="Process capability analysis",
    description="Calculate process capability indices (Cp, Cpk, Cpu, Cpl) and sigma level.",
    responses={
        400: {"description": "Invalid file, column not found, or zero standard deviation"},
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("10/minute")
async def analyze_capability(
    request: Request,
    file: UploadFile = File(...),
    column: str = Form(..., description="Column name to analyze"),
    usl: float = Form(..., description="Upper Specification Limit"),
    lsl: float = Form(..., description="Lower Specification Limit"),
    target: Optional[float] = Form(None, description="Target value (optional)"),
    current_user: User = Depends(get_current_user)
):
    """Calculate process capability indices (Cp, Cpk)"""
    df = parse_file(file)
    
    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")
    
    data = df[column].dropna().values
    mean = float(np.mean(data))
    std = float(np.std(data, ddof=1))
    
    if std == 0:
        raise HTTPException(status_code=400, detail="Standard deviation is zero")
    
    cp = (usl - lsl) / (6 * std)
    cpu = (usl - mean) / (3 * std)
    cpl = (mean - lsl) / (3 * std)
    cpk = min(cpu, cpl)
    
    # Calculate PPM
    z_upper = (usl - mean) / std
    z_lower = (mean - lsl) / std
    ppm_above = (1 - stats.norm.cdf(z_upper)) * 1_000_000
    ppm_below = stats.norm.cdf(-z_lower) * 1_000_000
    
    result = CapabilityResult(
        column=column,
        usl=usl,
        lsl=lsl,
        target=target,
        mean=round(mean, 4),
        std=round(std, 4),
        cp=round(cp, 3),
        cpk=round(cpk, 3),
        cpu=round(cpu, 3),
        cpl=round(cpl, 3),
        ppm_above_usl=round(ppm_above, 1),
        ppm_below_lsl=round(ppm_below, 1),
        sigma_level=round(calculate_sigma_level(cpk), 2),
        capable=cpk >= 1.33
    )
    
    analysis_id = store_result("capability", result.dict(), {
        "filename": file.filename,
        "specs": {"usl": usl, "lsl": lsl, "target": target}
    })
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        timestamp=datetime.now().isoformat(),
        analysis_type="capability",
        results=result.dict(),
        metadata={"filename": file.filename, "specs": {"usl": usl, "lsl": lsl}}
    )

@app.post(
    "/analyze/regression",
    response_model=AnalysisResponse,
    tags=["Analysis"],
    summary="Linear regression",
    description="Perform multiple linear regression analysis with R-squared, F-statistic, and coefficient significance tests.",
    responses={
        400: {"description": "Invalid file or column not found"},
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("10/minute")
async def analyze_regression(
    request: Request,
    file: UploadFile = File(...),
    response: str = Form(..., description="Response variable (dependent variable) column name"),
    predictors: str = Form(..., description="Comma-separated list of predictor (independent variable) column names"),
    current_user: User = Depends(get_current_user)
):
    """Perform multiple linear regression"""
    df = parse_file(file)
    
    pred_cols = [p.strip() for p in predictors.split(',')]
    
    # Validate columns
    for col in [response] + pred_cols:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    
    # Build formula
    formula = f"{response} ~ " + " + ".join(pred_cols)
    
    # Fit model
    model = smf.ols(formula, data=df.dropna()).fit()
    
    # Extract coefficients
    coefficients = {}
    for term in model.params.index:
        coefficients[term] = {
            "coefficient": round(float(model.params[term]), 4),
            "std_error": round(float(model.bse[term]), 4),
            "t_value": round(float(model.tvalues[term]), 4),
            "p_value": round(float(model.pvalues[term]), 4),
            "significant": float(model.pvalues[term]) < 0.05
        }
    
    result = RegressionResult(
        r_squared=round(float(model.rsquared), 4),
        adj_r_squared=round(float(model.rsquared_adj), 4),
        f_statistic=round(float(model.fvalue), 4),
        f_pvalue=round(float(model.f_pvalue), 6),
        coefficients=coefficients,
        residual_std_error=round(float(np.sqrt(model.mse_resid)), 4),
        observations=int(model.nobs)
    )
    
    analysis_id = store_result("regression", result.dict(), {
        "filename": file.filename,
        "formula": formula
    })
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        timestamp=datetime.now().isoformat(),
        analysis_type="regression",
        results=result.dict(),
        metadata={"filename": file.filename, "formula": formula}
    )

@app.post(
    "/analyze/ttest",
    response_model=AnalysisResponse,
    tags=["Analysis"],
    summary="T-test analysis",
    description="Perform one-sample, two-sample, or paired t-tests with confidence intervals.",
    responses={
        400: {"description": "Invalid file, column not found, or missing required parameters"},
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("10/minute")
async def analyze_ttest(
    request: Request,
    file: UploadFile = File(...),
    column1: str = Form(..., description="First column to analyze"),
    column2: Optional[str] = Form(None, description="Second column (required for two-sample and paired tests)"),
    test_type: str = Form("two-sample", description="Type of t-test: one-sample, two-sample, or paired"),
    hypothesized_mean: Optional[float] = Form(None, description="Hypothesized mean for one-sample test"),
    alpha: float = Form(0.05, description="Significance level (default: 0.05)"),
    current_user: User = Depends(get_current_user)
):
    """Perform t-test analysis"""
    df = parse_file(file)
    
    data1 = df[column1].dropna().values
    
    if test_type == "one-sample":
        if hypothesized_mean is None:
            raise HTTPException(status_code=400, detail="hypothesized_mean required for one-sample test")
        t_stat, p_value = stats.ttest_1samp(data1, hypothesized_mean)
        df_val = len(data1) - 1
        mean_diff = float(np.mean(data1)) - hypothesized_mean
        
    elif test_type == "two-sample":
        if column2 is None:
            raise HTTPException(status_code=400, detail="column2 required for two-sample test")
        data2 = df[column2].dropna().values
        t_stat, p_value = stats.ttest_ind(data1, data2)
        df_val = len(data1) + len(data2) - 2
        mean_diff = float(np.mean(data1) - np.mean(data2))
        
    elif test_type == "paired":
        if column2 is None:
            raise HTTPException(status_code=400, detail="column2 required for paired test")
        data2 = df[column2].dropna().values
        t_stat, p_value = stats.ttest_rel(data1, data2)
        df_val = len(data1) - 1
        mean_diff = float(np.mean(data1 - data2))
    else:
        raise HTTPException(status_code=400, detail="Invalid test_type")
    
    # Confidence interval
    se = float(np.std(data1, ddof=1) / np.sqrt(len(data1)))
    ci_margin = stats.t.ppf(1 - alpha/2, df_val) * se
    ci = [float(np.mean(data1)) - ci_margin, float(np.mean(data1)) + ci_margin]
    
    result = TTestResult(
        test_type=test_type,
        t_statistic=round(float(t_stat), 4),
        p_value=round(float(p_value), 6),
        df=round(float(df_val), 2),
        mean_difference=round(mean_diff, 4) if mean_diff else None,
        confidence_interval=[round(ci[0], 4), round(ci[1], 4)],
        significant=float(p_value) < alpha,
        alpha=alpha
    )
    
    analysis_id = store_result("ttest", result.dict(), {
        "filename": file.filename,
        "test_type": test_type
    })
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        timestamp=datetime.now().isoformat(),
        analysis_type="ttest",
        results=result.dict(),
        metadata={"filename": file.filename}
    )

@app.post(
    "/analyze/control-chart",
    response_model=AnalysisResponse,
    tags=["Analysis"],
    summary="Control chart analysis",
    description="Calculate control chart limits for X-bar R or I-MR charts. Identifies out-of-control points.",
    responses={
        400: {"description": "Invalid file, column not found, or unsupported chart type"},
        401: {"description": "Not authenticated"},
    }
)
@limiter.limit("10/minute")
async def analyze_control_chart(
    request: Request,
    file: UploadFile = File(...),
    column: str = Form(..., description="Column to analyze"),
    subgroup_size: int = Form(5, description="Subgroup size for X-bar R chart (default: 5)"),
    chart_type: str = Form("xbar-r", description="Chart type: xbar-r or imr"),
    current_user: User = Depends(get_current_user)
):
    """Calculate control chart limits"""
    df = parse_file(file)
    data = df[column].dropna().values
    
    if chart_type == "xbar-r":
        n = subgroup_size
        n_subgroups = len(data) // n
        subgroups = data[:n_subgroups * n].reshape(n_subgroups, n)
        
        xbar = subgroups.mean(axis=1)
        R = subgroups.ptp(axis=1)
        
        xbar_bar = float(xbar.mean())
        r_bar = float(R.mean())
        
        # Control chart constants
        A2 = {2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483, 7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308}.get(n, 0.308)
        D4 = {2: 3.267, 3: 2.574, 4: 2.282, 5: 2.114, 6: 2.004, 7: 1.924, 8: 1.864, 9: 1.816, 10: 1.777}.get(n, 1.777)
        
        ucl = xbar_bar + A2 * r_bar
        lcl = xbar_bar - A2 * r_bar
        
        # Find out of control points
        ooc = [i for i, x in enumerate(xbar) if x > ucl or x < lcl]
        
        result = ControlChartResult(
            chart_type=chart_type,
            center_line=round(xbar_bar, 4),
            ucl=round(ucl, 4),
            lcl=round(lcl, 4),
            subgroup_size=n,
            out_of_control_points=ooc,
            data_points=[round(float(x), 4) for x in xbar]
        )
        
    elif chart_type == "imr":
        # Individuals and Moving Range
        mr = np.abs(np.diff(data))
        x_bar = float(np.mean(data))
        mr_bar = float(np.mean(mr))
        
        ucl = x_bar + 2.66 * mr_bar
        lcl = x_bar - 2.66 * mr_bar
        
        ooc = [i for i, x in enumerate(data) if x > ucl or x < lcl]
        
        result = ControlChartResult(
            chart_type=chart_type,
            center_line=round(x_bar, 4),
            ucl=round(ucl, 4),
            lcl=round(lcl, 4),
            subgroup_size=1,
            out_of_control_points=ooc,
            data_points=[round(float(x), 4) for x in data]
        )
    else:
        raise HTTPException(status_code=400, detail="Unsupported chart type")
    
    analysis_id = store_result("control-chart", result.dict(), {
        "filename": file.filename,
        "chart_type": chart_type
    })
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        timestamp=datetime.now().isoformat(),
        analysis_type="control-chart",
        results=result.dict(),
        metadata={"filename": file.filename}
    )

# ==================== EXPORT ENDPOINTS ====================

@app.get(
    "/export/json/{analysis_id}",
    tags=["Export"],
    summary="Export as JSON",
    description="Export analysis results in JSON format.",
    responses={
        404: {"description": "Analysis not found"},
    }
)
@limiter.limit("30/minute")
async def export_json(request: Request, analysis_id: str):
    """Export analysis results as JSON"""
    # Try memory first, then database
    if analysis_id in analysis_store:
        return JSONResponse(content=analysis_store[analysis_id])
    
    # Try database
    result = db_get_result(analysis_id)
    if result:
        return JSONResponse(content=result)
    
    raise HTTPException(status_code=404, detail="Analysis not found")

@app.get(
    "/export/csv/{analysis_id}",
    tags=["Export"],
    summary="Export as CSV",
    description="Export analysis results in CSV format.",
    responses={
        404: {"description": "Analysis not found"},
    }
)
@limiter.limit("30/minute")
async def export_csv(request: Request, analysis_id: str):
    """Export analysis results as CSV"""
    # Try memory first, then database
    result_data = analysis_store.get(analysis_id) or db_get_result(analysis_id)
    
    if not result_data:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result = result_data
    
    # Convert to DataFrame
    if isinstance(result["results"], list):
        df = pd.DataFrame(result["results"])
    elif isinstance(result["results"], dict):
        df = pd.DataFrame([result["results"]])
    
    # Save to temp file
    output_path = f"/tmp/{analysis_id}.csv"
    df.to_csv(output_path, index=False)
    
    return FileResponse(output_path, filename=f"analysis_{analysis_id}.csv", media_type="text/csv")

@app.get(
    "/results/{analysis_id}",
    tags=["Analysis"],
    summary="Get analysis result",
    description="Retrieve a specific analysis result by ID from memory or database.",
    responses={
        404: {"description": "Analysis not found"},
    }
)
@limiter.limit("30/minute")
async def get_result(request: Request, analysis_id: str):
    """Retrieve stored analysis results from memory or database"""
    # Try memory first
    if analysis_id in analysis_store:
        return analysis_store[analysis_id]
    
    # Try database
    result = db_get_result(analysis_id)
    if result:
        # Cache in memory for future requests
        analysis_store[analysis_id] = result
        return result
    
    raise HTTPException(status_code=404, detail="Analysis not found")

@app.get(
    "/results",
    tags=["Analysis"],
    summary="List analysis results",
    description="List all stored analysis results with pagination support.",
)
@limiter.limit("30/minute")
async def list_results(request: Request, limit: int = 100, offset: int = 0):
    """List all stored analysis results with pagination"""
    # Use database for paginated results
    return db_list_results(limit=limit, offset=offset)

@app.get(
    "/storage/stats",
    tags=["Health"],
    summary="Storage statistics",
    description="Get database storage statistics including count and size.",
)
@limiter.limit("30/minute")
async def storage_stats(request: Request):
    """Get storage statistics"""
    return get_storage_stats()

# ==================== ECHA ENDPOINTS ====================

@app.get(
    "/api/echa/svhc",
    tags=["ECHA Compliance"],
    summary="Get SVHC list",
    description="Get ECHA SVHC (Substances of Very High Concern) candidate list data. Returns cached data if available.",
)
@limiter.limit("10/minute")
async def get_echa_svhc(request: Request):
    """
    Get ECHA SVHC (Substances of Very High Concern) candidate list data.
    This serves as a proxy to avoid CORS issues when fetching from ECHA directly.
    Returns cached data if available, otherwise falls back to static data.
    """
    import json
    from datetime import datetime, timedelta
    
    # Cache file path
    cache_file = "/tmp/echa_svhc_cache.json"
    cache_duration_hours = 24
    
    # Try to read from cache
    try:
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                cached = json.load(f)
                cache_time = datetime.fromisoformat(cached.get("timestamp", "2000-01-01"))
                if datetime.now() - cache_time < timedelta(hours=cache_duration_hours):
                    logger.info("Returning cached ECHA SVHC data")
                    return {
                        "substances": cached.get("substances", []),
                        "source": "cache",
                        "last_updated": cached.get("timestamp"),
                        "total": len(cached.get("substances", []))
                    }
    except Exception as e:
        logger.warning(f"Failed to read ECHA cache: {e}")
    
    # Static fallback data (representative sample of SVHC substances)
    # In production, this would fetch from ECHA's published data
    static_svhc_data = [
        {"id": "svhc-80-05-7", "name": "Bisphenol A (BPA)", "cas": "80-05-7", "ec": "201-245-8", "reason": "Toxic for reproduction, Endocrine disrupting", "dateAdded": "12-Jan-2017", "list": "SVHC"},
        {"id": "svhc-117-81-7", "name": "Bis(2-ethylhexyl) phthalate (DEHP)", "cas": "117-81-7", "ec": "204-211-0", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "28-Oct-2008", "list": "SVHC"},
        {"id": "svhc-84-74-2", "name": "Dibutyl phthalate (DBP)", "cas": "84-74-2", "ec": "201-557-4", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "28-Oct-2008", "list": "SVHC"},
        {"id": "svhc-7439-92-1", "name": "Lead", "cas": "7439-92-1", "ec": "231-100-4", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "27-Jun-2018", "list": "SVHC"},
        {"id": "svhc-7440-43-9", "name": "Cadmium", "cas": "7440-43-9", "ec": "231-152-8", "reason": "Carcinogenic (Article 57a)", "dateAdded": "20-Jun-2013", "list": "SVHC"},
        {"id": "svhc-36861-47-9", "name": "4-MBC (4-Methylbenzylidene camphor)", "cas": "36861-47-9", "ec": "253-242-6", "reason": "Endocrine disrupting (Article 57f)", "dateAdded": "17-Jan-2022", "list": "SVHC"},
        {"id": "svhc-3296-90-0", "name": "2,2-Bis(bromomethyl)propane-1,3-diol", "cas": "3296-90-0", "ec": "221-967-7", "reason": "Carcinogenic (Article 57a)", "dateAdded": "08-Jul-2021", "list": "SVHC"},
        {"id": "svhc-80-54-6", "name": "2-(4-tert-butylbenzyl)propionaldehyde", "cas": "80-54-6", "ec": "201-289-8", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "08-Jul-2021", "list": "SVHC"},
        {"id": "svhc-26040-51-7", "name": "Bis(2-ethylhexyl) tetrabromophthalate", "cas": "26040-51-7", "ec": "247-426-5", "reason": "vPvB (Article 57e)", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-3648-18-8", "name": "Dioctyltin dilaurate", "cas": "3648-18-8", "ec": "222-883-3", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "19-Jan-2021", "list": "SVHC"},
        {"id": "svhc-85535-85-9", "name": "Medium-chain chlorinated paraffins (MCCP)", "cas": "85535-85-9", "ec": "287-477-0", "reason": "PBT & vPvB (Article 57d,e)", "dateAdded": "08-Jul-2021", "list": "SVHC"},
        {"id": "svhc-375-73-5", "name": "Perfluorobutane sulfonic acid (PFBS)", "cas": "375-73-5", "ec": "206-793-1", "reason": "Equivalent concern (Article 57f)", "dateAdded": "16-Jan-2020", "list": "SVHC"},
        {"id": "svhc-375-85-9", "name": "Perfluoroheptanoic acid", "cas": "375-85-9", "ec": "206-798-9", "reason": "Toxic for reproduction, PBT, vPvB", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-1067-53-4", "name": "Tris(2-methoxyethoxy)vinylsilane", "cas": "1067-53-4", "ec": "213-934-0", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "17-Jan-2022", "list": "SVHC"},
        {"id": "svhc-107-51-7", "name": "Octamethyltrisiloxane", "cas": "107-51-7", "ec": "203-497-4", "reason": "vPvB (Article 57e)", "dateAdded": "21-Jan-2025", "list": "SVHC"},
        {"id": "svhc-1072-63-5", "name": "1-vinylimidazole", "cas": "1072-63-5", "ec": "214-012-0", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "25-Jun-2020", "list": "SVHC"},
        {"id": "svhc-108-78-1", "name": "Melamine", "cas": "108-78-1", "ec": "203-615-4", "reason": "Equivalent concern (Article 57f)", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-111-30-8", "name": "Glutaraldehyde (glutaral)", "cas": "111-30-8", "ec": "203-856-5", "reason": "Respiratory sensitising (Article 57f)", "dateAdded": "08-Jul-2021", "list": "SVHC"},
        {"id": "svhc-115-86-6", "name": "Triphenyl phosphate", "cas": "115-86-6", "ec": "204-112-2", "reason": "Endocrine disrupting (Article 57f)", "dateAdded": "07-Nov-2024", "list": "SVHC"},
        {"id": "svhc-119-47-1", "name": "6,6'-di-tert-butyl-2,2'-methylenedi-p-cresol", "cas": "119-47-1", "ec": "204-327-1", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "17-Jan-2022", "list": "SVHC"},
        {"id": "svhc-123-91-1", "name": "1,4-dioxane", "cas": "123-91-1", "ec": "204-661-8", "reason": "Carcinogenic, Equivalent concern", "dateAdded": "08-Jul-2021", "list": "SVHC"},
        {"id": "svhc-13701-59-2", "name": "Barium diboron tetraoxide", "cas": "13701-59-2", "ec": "237-222-4", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-141-62-8", "name": "Decamethyltetrasiloxane", "cas": "141-62-8", "ec": "205-491-7", "reason": "vPvB (Article 57e)", "dateAdded": "25-Jun-2025", "list": "SVHC"},
        {"id": "svhc-143-24-8", "name": "Bis(2-(2-methoxyethoxy)ethyl)ether", "cas": "143-24-8", "ec": "205-594-7", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "19-Jan-2021", "list": "SVHC"},
        {"id": "svhc-3147-75-9", "name": "UV-329 (benzotriazole)", "cas": "3147-75-9", "ec": "221-573-5", "reason": "vPvB (Article 57e)", "dateAdded": "23-Jan-2024", "list": "SVHC"},
        {"id": "svhc-338-83-0", "name": "Perfluamine", "cas": "338-83-0", "ec": "206-420-2", "reason": "vPvB (Article 57e)", "dateAdded": "21-Jan-2025", "list": "SVHC"},
        {"id": "svhc-3896-11-5", "name": "Bumetrizole (UV-326)", "cas": "3896-11-5", "ec": "223-445-4", "reason": "vPvB (Article 57e)", "dateAdded": "23-Jan-2024", "list": "SVHC"},
        {"id": "svhc-4247-02-3", "name": "Isobutyl 4-hydroxybenzoate", "cas": "4247-02-3", "ec": "224-208-8", "reason": "Endocrine disrupting (Article 57f)", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-693-98-1", "name": "2-methylimidazole", "cas": "693-98-1", "ec": "211-765-7", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "25-Jun-2020", "list": "SVHC"},
        {"id": "svhc-71850-09-4", "name": "Diisohexyl phthalate", "cas": "71850-09-4", "ec": "276-090-2", "reason": "Toxic for reproduction (Article 57c)", "dateAdded": "16-Jan-2020", "list": "SVHC"},
        {"id": "svhc-732-26-3", "name": "2,4,6-tri-tert-butylphenol", "cas": "732-26-3", "ec": "211-989-5", "reason": "Toxic for reproduction, PBT", "dateAdded": "23-Jan-2024", "list": "SVHC"},
        {"id": "svhc-80-09-1", "name": "Bisphenol S (4,4'-sulphonyldiphenol)", "cas": "80-09-1", "ec": "201-250-5", "reason": "Toxic for reproduction, Endocrine disrupting", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-79-94-7", "name": "TBBPA (tetrabromobisphenol A)", "cas": "79-94-7", "ec": "201-236-9", "reason": "Carcinogenic (Article 57a)", "dateAdded": "17-Jan-2023", "list": "SVHC"},
        {"id": "svhc-924-42-5", "name": "N-(hydroxymethyl)acrylamide", "cas": "924-42-5", "ec": "213-103-2", "reason": "Carcinogenic & Mutagenic (57a,b)", "dateAdded": "10-Jun-2022", "list": "SVHC"},
        {"id": "svhc-94-26-8", "name": "Butyl 4-hydroxybenzoate (butylparaben)", "cas": "94-26-8", "ec": "202-318-7", "reason": "Endocrine disrupting (Article 57f)", "dateAdded": "25-Jun-2020", "list": "SVHC"},
    ]
    
    # Try to update cache
    try:
        cache_data = {
            "substances": static_svhc_data,
            "timestamp": datetime.now().isoformat()
        }
        with open(cache_file, 'w') as f:
            json.dump(cache_data, f)
    except Exception as e:
        logger.warning(f"Failed to write ECHA cache: {e}")
    
    logger.info(f"Returning ECHA SVHC data with {len(static_svhc_data)} substances")
    
    return {
        "substances": static_svhc_data,
        "source": "fallback",
        "last_updated": datetime.now().isoformat(),
        "total": len(static_svhc_data)
    }


@app.get("/api/echa/search")
@limiter.limit("30/minute")
async def search_echa_substances(request: Request, q: str = ""):
    """
    Search ECHA substances by name, CAS, EC number, or reason.
    """
    # Get all substances
    result = await get_echa_svhc(request)
    substances = result["substances"]
    
    if not q:
        return {"results": substances[:20], "total": len(substances)}
    
    q_lower = q.lower()
    filtered = [
        s for s in substances
        if q_lower in s.get("name", "").lower()
        or q_lower in s.get("cas", "")
        or q_lower in s.get("ec", "")
        or q_lower in s.get("reason", "").lower()
    ]
    
    return {"results": filtered[:50], "total": len(filtered), "query": q}


@app.get("/api/echa/cas/{cas_number}")
@limiter.limit("30/minute")
async def get_echa_by_cas(request: Request, cas_number: str):
    """
    Get a specific ECHA substance by CAS number.
    """
    result = await get_echa_svhc(request)
    substances = result["substances"]
    
    for substance in substances:
        if substance.get("cas") == cas_number:
            return {"substance": substance, "found": True}
    
    return {"substance": None, "found": False}


@app.get("/api/echa/stats")
@limiter.limit("60/minute")
async def get_echa_stats(request: Request):
    """
    Get statistics about ECHA substances.
    """
    result = await get_echa_svhc(request)
    substances = result["substances"]
    
    stats = {
        "total": len(substances),
        "by_reason": {},
        "by_list": {"SVHC": 0, "Annex XIV": 0, "Annex XVII": 0}
    }
    
    for s in substances:
        # Count by list type
        list_type = s.get("list", "SVHC")
        stats["by_list"][list_type] = stats["by_list"].get(list_type, 0) + 1
        
        # Count by reason category
        reason = s.get("reason", "").lower()
        if "carcinogenic" in reason:
            stats["by_reason"]["carcinogenic"] = stats["by_reason"].get("carcinogenic", 0) + 1
        if "reproduction" in reason:
            stats["by_reason"]["reprotoxic"] = stats["by_reason"].get("reprotoxic", 0) + 1
        if "pbt" in reason:
            stats["by_reason"]["pbt"] = stats["by_reason"].get("pbt", 0) + 1
        if "vpvb" in reason:
            stats["by_reason"]["vpvb"] = stats["by_reason"].get("vpvb", 0) + 1
        if "endocrine" in reason:
            stats["by_reason"]["endocrine"] = stats["by_reason"].get("endocrine", 0) + 1
    
    return stats


# ==================== MAIN ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)