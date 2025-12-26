"""
Six Sigma Analysis API
FastAPI backend for automated statistical analysis
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
from scipy import stats
import statsmodels.api as sm
import statsmodels.formula.api as smf
from io import BytesIO
import json
import uuid
from datetime import datetime

app = FastAPI(
    title="Six Sigma Analysis API",
    description="Automated statistical analysis for Six Sigma (DOE, Regression, SPC, Capability)",
    version="1.0.0"
)

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for analysis results
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

def parse_file(file: UploadFile) -> pd.DataFrame:
    """Parse uploaded CSV or Excel file"""
    content = file.file.read()
    file.file.seek(0)
    
    if file.filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(content))
    elif file.filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(BytesIO(content))
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Use CSV or Excel.")
    
    return df

def store_result(analysis_type: str, results: Any, metadata: Dict = None) -> str:
    """Store analysis results and return ID"""
    analysis_id = str(uuid.uuid4())[:8]
    analysis_store[analysis_id] = {
        "analysis_id": analysis_id,
        "timestamp": datetime.now().isoformat(),
        "analysis_type": analysis_type,
        "results": results,
        "metadata": metadata or {}
    }
    return analysis_id

def calculate_sigma_level(cpk: float) -> float:
    """Convert Cpk to approximate sigma level"""
    return cpk * 3 + 1.5  # Approximate with 1.5 sigma shift

# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "name": "Six Sigma Analysis API",
        "version": "1.0.0",
        "endpoints": [
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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and preview a data file"""
    df = parse_file(file)
    
    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "preview": df.head(5).to_dict(orient="records"),
        "numeric_columns": list(df.select_dtypes(include=[np.number]).columns)
    }

@app.post("/analyze/descriptive")
async def analyze_descriptive(
    file: UploadFile = File(...),
    columns: Optional[str] = Form(None)  # Comma-separated column names
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

@app.post("/analyze/capability")
async def analyze_capability(
    file: UploadFile = File(...),
    column: str = Form(...),
    usl: float = Form(...),
    lsl: float = Form(...),
    target: Optional[float] = Form(None)
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

@app.post("/analyze/regression")
async def analyze_regression(
    file: UploadFile = File(...),
    response: str = Form(...),
    predictors: str = Form(...)  # Comma-separated predictor names
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

@app.post("/analyze/ttest")
async def analyze_ttest(
    file: UploadFile = File(...),
    column1: str = Form(...),
    column2: Optional[str] = Form(None),
    test_type: str = Form("two-sample"),  # one-sample, two-sample, paired
    hypothesized_mean: Optional[float] = Form(None),
    alpha: float = Form(0.05)
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

@app.post("/analyze/control-chart")
async def analyze_control_chart(
    file: UploadFile = File(...),
    column: str = Form(...),
    subgroup_size: int = Form(5),
    chart_type: str = Form("xbar-r")  # xbar-r, imr, p, c
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

@app.get("/export/json/{analysis_id}")
async def export_json(analysis_id: str):
    """Export analysis results as JSON"""
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return JSONResponse(content=analysis_store[analysis_id])

@app.get("/export/csv/{analysis_id}")
async def export_csv(analysis_id: str):
    """Export analysis results as CSV"""
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result = analysis_store[analysis_id]
    
    # Convert to DataFrame
    if isinstance(result["results"], list):
        df = pd.DataFrame(result["results"])
    elif isinstance(result["results"], dict):
        df = pd.DataFrame([result["results"]])
    
    # Save to temp file
    output_path = f"/tmp/{analysis_id}.csv"
    df.to_csv(output_path, index=False)
    
    return FileResponse(output_path, filename=f"analysis_{analysis_id}.csv", media_type="text/csv")

@app.get("/results/{analysis_id}")
async def get_result(analysis_id: str):
    """Retrieve stored analysis results"""
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_store[analysis_id]

@app.get("/results")
async def list_results():
    """List all stored analysis results"""
    return {
        "count": len(analysis_store),
        "analyses": [
            {
                "analysis_id": k,
                "type": v["analysis_type"],
                "timestamp": v["timestamp"]
            }
            for k, v in analysis_store.items()
        ]
    }

# ==================== MAIN ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
