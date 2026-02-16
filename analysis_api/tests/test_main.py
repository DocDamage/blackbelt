"""
Main API Endpoint Tests

Tests for FastAPI endpoints including health checks,
analysis endpoints, and export functionality.
"""

import pytest
import json
from io import BytesIO


class TestHealthEndpoint:
    """Tests for the health check endpoint."""
    
    def test_health_check_returns_200(self, client):
        """Test health endpoint returns 200 OK."""
        response = client.get("/health")
        assert response.status_code == 200
    
    def test_health_check_response_structure(self, client):
        """Test health endpoint returns correct structure."""
        response = client.get("/health")
        data = response.json()
        
        assert "status" in data
        assert data["status"] == "healthy"
        assert "version" in data
        assert "timestamp" in data
        assert "storage_count" in data
    
    def test_health_check_includes_storage_count(self, client):
        """Test health endpoint includes storage statistics."""
        response = client.get("/health")
        data = response.json()
        
        assert isinstance(data["storage_count"], int)
        assert data["storage_count"] >= 0


class TestRootEndpoint:
    """Tests for the root endpoint."""
    
    def test_root_returns_welcome(self, client):
        """Test root endpoint returns welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        assert "welcome" in response.text.lower()


class TestUploadEndpoint:
    """Tests for the file upload endpoint."""
    
    def test_upload_csv_success(self, client, test_user, auth_headers, data_factory):
        """Test successful CSV upload."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        data = data_factory.create_csv_data(rows=10, columns=3)
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "filename" in result
        assert "rows" in result
        assert "columns" in result
        assert result["rows"] == 10
        assert len(result["columns"]) == 3
    
    def test_upload_excel_success(self, client, test_user, auth_headers, mock_excel_file):
        """Test successful Excel upload."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.xlsx", BytesIO(mock_excel_file), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "filename" in result
        assert "rows" in result
        assert "columns" in result
    
    def test_upload_unauthorized(self, client, mock_csv_file):
        """Test upload without authentication fails."""
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(mock_csv_file), "text/csv")}
        )
        assert response.status_code == 401
    
    def test_upload_invalid_extension(self, client, test_user, auth_headers):
        """Test upload with invalid file extension."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.txt", BytesIO(b"invalid"), "text/plain")},
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "extension" in response.json()["detail"].lower()


class TestDescriptiveAnalysis:
    """Tests for descriptive statistics endpoint."""
    
    def test_descriptive_analysis_success(self, client, test_user, auth_headers, data_factory):
        """Test successful descriptive analysis."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        data = data_factory.create_csv_data(rows=100, columns=1)
        
        # Upload file first
        upload_response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            headers=auth_headers
        )
        assert upload_response.status_code == 200
        columns = upload_response.json()["columns"]
        
        # Perform analysis
        response = client.post(
            "/analyze/descriptive",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={"columns": columns[0]},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "analysis_id" in result
        assert "analysis_type" in result
        assert result["analysis_type"] == "descriptive"
        assert "results" in result
    
    def test_descriptive_analysis_unauthorized(self, client, mock_csv_file):
        """Test descriptive analysis without authentication."""
        response = client.post(
            "/analyze/descriptive",
            files={"file": ("test.csv", BytesIO(mock_csv_file), "text/csv")}
        )
        assert response.status_code == 401


class TestCapabilityAnalysis:
    """Tests for process capability endpoint."""
    
    def test_capability_analysis_success(self, client, test_user, auth_headers, data_factory):
        """Test successful capability analysis."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        data = data_factory.create_capability_data(mean=10.0, std=0.1, size=100)
        
        response = client.post(
            "/analyze/capability",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={
                "column": "measurement",
                "usl": "10.5",
                "lsl": "9.5"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["analysis_type"] == "capability"
        assert "results" in result
        
        results = result["results"]
        assert "cp" in results
        assert "cpk" in results
        assert "cpu" in results
        assert "cpl" in results
        assert "sigma_level" in results
    
    def test_capability_analysis_invalid_column(self, client, test_user, auth_headers, mock_csv_file):
        """Test capability analysis with non-existent column."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/analyze/capability",
            files={"file": ("test.csv", BytesIO(mock_csv_file), "text/csv")},
            data={
                "column": "nonexistent",
                "usl": "10.5",
                "lsl": "9.5"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 400


class TestRegressionAnalysis:
    """Tests for regression endpoint."""
    
    def test_regression_analysis_success(self, client, test_user, auth_headers, data_factory):
        """Test successful regression analysis."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        data = data_factory.create_regression_data(n=50)
        
        response = client.post(
            "/analyze/regression",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={
                "response": "y",
                "predictors": "x1,x2"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["analysis_type"] == "regression"
        assert "results" in result
        
        results = result["results"]
        assert "r_squared" in results
        assert "adj_r_squared" in results
        assert "coefficients" in results


class TestTTestAnalysis:
    """Tests for t-test endpoint."""
    
    def test_ttest_one_sample_success(self, client, test_user, auth_headers, data_factory):
        """Test successful one-sample t-test."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        data = data_factory.create_capability_data(mean=10.0, std=0.5, size=30)
        
        response = client.post(
            "/analyze/ttest",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={
                "column1": "measurement",
                "test_type": "one-sample",
                "hypothesized_mean": "10.0"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["analysis_type"] == "ttest"
        assert "results" in result
        
        results = result["results"]
        assert results["test_type"] == "one-sample"
        assert "t_statistic" in results
        assert "p_value" in results


class TestControlChartAnalysis:
    """Tests for control chart endpoint."""
    
    def test_control_chart_xbar_r_success(self, client, test_user, auth_headers, data_factory):
        """Test successful X-bar R chart analysis."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        # Create data with multiple subgroups
        data = data_factory.create_csv_data(rows=50, columns=1)
        
        response = client.post(
            "/analyze/control-chart",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={
                "column": "col_0",
                "chart_type": "xbar-r",
                "subgroup_size": "5"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["analysis_type"] == "control-chart"
        assert "results" in result
        
        results = result["results"]
        assert results["chart_type"] == "xbar-r"
        assert "center_line" in results
        assert "ucl" in results
        assert "lcl" in results
        assert "out_of_control_points" in results


class TestExportEndpoints:
    """Tests for export endpoints."""
    
    def test_export_json_success(self, client, test_user, auth_headers, data_factory, temp_db_path):
        """Test successful JSON export."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        # First, perform an analysis
        data = data_factory.create_csv_data(rows=10, columns=1)
        
        analysis_response = client.post(
            "/analyze/descriptive",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={"columns": "col_0"},
            headers=auth_headers
        )
        
        assert analysis_response.status_code == 200
        analysis_id = analysis_response.json()["analysis_id"]
        
        # Export as JSON
        export_response = client.get(f"/export/json/{analysis_id}", headers=auth_headers)
        
        assert export_response.status_code == 200
        result = export_response.json()
        assert "analysis_id" in result
        assert result["analysis_id"] == analysis_id
    
    def test_export_csv_success(self, client, test_user, auth_headers, data_factory):
        """Test successful CSV export."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        # First, perform an analysis
        data = data_factory.create_csv_data(rows=10, columns=1)
        
        analysis_response = client.post(
            "/analyze/descriptive",
            files={"file": ("test.csv", BytesIO(data), "text/csv")},
            data={"columns": "col_0"},
            headers=auth_headers
        )
        
        assert analysis_response.status_code == 200
        analysis_id = analysis_response.json()["analysis_id"]
        
        # Export as CSV
        export_response = client.get(f"/export/csv/{analysis_id}", headers=auth_headers)
        
        assert export_response.status_code == 200
        assert export_response.headers["content-type"] == "text/csv; charset=utf-8"


class TestResultsEndpoint:
    """Tests for results listing endpoint."""
    
    def test_list_results_success(self, client, test_user, auth_headers, data_factory):
        """Test successful results listing."""
        # Register user
        client.post("/auth/register", json=test_user)
        
        # Perform multiple analyses
        data = data_factory.create_csv_data(rows=10, columns=1)
        
        for _ in range(3):
            client.post(
                "/analyze/descriptive",
                files={"file": ("test.csv", BytesIO(data), "text/csv")},
                data={"columns": "col_0"},
                headers=auth_headers
            )
        
        # List results
        response = client.get("/results", headers=auth_headers)
        
        assert response.status_code == 200
        result = response.json()
        assert "analyses" in result
        assert len(result["analyses"]) >= 3


class TestSecurityHeaders:
    """Tests for security headers in responses."""
    
    def test_security_headers_present(self, client):
        """Test that security headers are included in responses."""
        response = client.get("/health")
        
        assert "X-Frame-Options" in response.headers
        assert response.headers["X-Frame-Options"] == "DENY"
        
        assert "X-Content-Type-Options" in response.headers
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        
        assert "X-XSS-Protection" in response.headers
        assert response.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    
    def test_correlation_id_header(self, client):
        """Test that correlation ID header is included."""
        response = client.get("/health")
        
        assert "X-Correlation-Id" in response.headers
        assert len(response.headers["X-Correlation-Id"]) > 0
    
    def test_response_time_header(self, client):
        """Test that response time header is included."""
        response = client.get("/health")
        
        assert "X-Response-Time" in response.headers
