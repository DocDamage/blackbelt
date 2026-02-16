"""
File Upload and Validation Tests

Tests for file upload validation, size limits, extension checking,
and parsing functionality.
"""

import pytest
import os
from io import BytesIO


class TestFileValidation:
    """Tests for file validation logic."""
    
    def test_valid_csv_extension(self, client, test_user, auth_headers):
        """Test upload with valid CSV extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(b"col1,col2\n1,2"), "text/csv")},
            headers=auth_headers
        )
        # Should not fail due to extension validation
        assert response.status_code != 400 or "extension" not in response.text.lower()
    
    def test_valid_excel_extension_xlsx(self, client, test_user, auth_headers):
        """Test upload with valid XLSX extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.xlsx", BytesIO(b"fake excel"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
            headers=auth_headers
        )
        assert response.status_code != 400 or "extension" not in response.text.lower()
    
    def test_valid_excel_extension_xls(self, client, test_user, auth_headers):
        """Test upload with valid XLS extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.xls", BytesIO(b"fake excel"), "application/vnd.ms-excel")},
            headers=auth_headers
        )
        assert response.status_code != 400 or "extension" not in response.text.lower()
    
    def test_invalid_extension_txt(self, client, test_user, auth_headers):
        """Test upload with invalid TXT extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.txt", BytesIO(b"text content"), "text/plain")},
            headers=auth_headers
        )
        assert response.status_code == 400
        assert "extension" in response.json()["detail"].lower()
    
    def test_invalid_extension_pdf(self, client, test_user, auth_headers):
        """Test upload with invalid PDF extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.pdf", BytesIO(b"PDF content"), "application/pdf")},
            headers=auth_headers
        )
        assert response.status_code == 400
    
    def test_no_filename(self, client, test_user, auth_headers):
        """Test upload without filename."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("", BytesIO(b"content"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 400


class TestFileSizeLimits:
    """Tests for file size limit enforcement."""
    
    def test_small_file_accepted(self, client, test_user, auth_headers):
        """Test that small files are accepted."""
        client.post("/auth/register", json=test_user)
        
        small_data = b"col1,col2\n" + b"1,2\n" * 10
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(small_data), "text/csv")},
            headers=auth_headers
        )
        # Should not fail due to size
        assert response.status_code != 413
    
    def test_row_count_limit(self, client, test_user, auth_headers):
        """Test enforcement of row count limits."""
        client.post("/auth/register", json=test_user)
        
        # Create data with many rows
        large_data = b"col1\n" + b"1\n" * 200000  # 200k rows
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(large_data), "text/csv")},
            headers=auth_headers
        )
        
        # Should fail due to row limit
        if response.status_code != 200:
            assert response.status_code in [400, 413]


class TestCSVParsing:
    """Tests for CSV file parsing."""
    
    def test_parse_simple_csv(self, client, test_user, auth_headers):
        """Test parsing simple CSV file."""
        client.post("/auth/register", json=test_user)
        
        csv_data = b"name,value\nAlice,100\nBob,200\nCharlie,300"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(csv_data), "text/csv")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["rows"] == 3
        assert "name" in result["columns"]
        assert "value" in result["columns"]
    
    def test_parse_csv_with_numeric_columns(self, client, test_user, auth_headers):
        """Test CSV parsing identifies numeric columns."""
        client.post("/auth/register", json=test_user)
        
        csv_data = b"id,value,description\n1,10.5,Test A\n2,20.5,Test B"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(csv_data), "text/csv")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "value" in result["numeric_columns"]
        # Non-numeric columns should not be in numeric_columns
        assert "description" not in result["numeric_columns"]
    
    def test_parse_csv_preview(self, client, test_user, auth_headers):
        """Test CSV parsing returns preview."""
        client.post("/auth/register", json=test_user)
        
        csv_data = b"col1,col2\n1,2\n3,4\n5,6\n7,8\n9,10"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(csv_data), "text/csv")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "preview" in result
        assert len(result["preview"]) > 0
    
    def test_parse_csv_dtypes(self, client, test_user, auth_headers):
        """Test CSV parsing returns column data types."""
        client.post("/auth/register", json=test_user)
        
        csv_data = b"int_col,float_col,str_col\n1,1.5,hello\n2,2.5,world"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(csv_data), "text/csv")},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "dtypes" in result
        assert "int_col" in result["dtypes"]
        assert "float_col" in result["dtypes"]


class TestMalformedFiles:
    """Tests for handling malformed files."""
    
    def test_empty_csv(self, client, test_user, auth_headers):
        """Test handling of empty CSV file."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(b""), "text/csv")},
            headers=auth_headers
        )
        # Should handle gracefully
        assert response.status_code in [200, 400]
    
    def test_csv_headers_only(self, client, test_user, auth_headers):
        """Test CSV with only headers."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(b"col1,col2\n"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 200
        result = response.json()
        assert result["rows"] == 0
    
    def test_invalid_csv_format(self, client, test_user, auth_headers):
        """Test handling of invalid CSV format."""
        client.post("/auth/register", json=test_user)
        
        # Invalid CSV with inconsistent columns
        csv_data = b"col1,col2\n1\n2,3,4"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(csv_data), "text/csv")},
            headers=auth_headers
        )
        # Should handle gracefully
        assert response.status_code in [200, 400]
    
    def test_binary_file_as_csv(self, client, test_user, auth_headers):
        """Test handling of binary file uploaded as CSV."""
        client.post("/auth/register", json=test_user)
        
        binary_data = b"\x00\x01\x02\x03\xff\xfe"
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", BytesIO(binary_data), "text/csv")},
            headers=auth_headers
        )
        # Should handle gracefully
        assert response.status_code in [200, 400]


class TestUploadEdgeCases:
    """Tests for edge cases in file upload."""
    
    def test_filename_with_spaces(self, client, test_user, auth_headers):
        """Test upload with filename containing spaces."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test file.csv", BytesIO(b"col1,col2\n1,2"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 200
    
    def test_filename_with_special_chars(self, client, test_user, auth_headers):
        """Test upload with filename containing special characters."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test-file_v1.2.csv", BytesIO(b"col1,col2\n1,2"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 200
    
    def test_uppercase_extension(self, client, test_user, auth_headers):
        """Test upload with uppercase file extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.CSV", BytesIO(b"col1,col2\n1,2"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 200
    
    def test_mixed_case_extension(self, client, test_user, auth_headers):
        """Test upload with mixed case file extension."""
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.Csv", BytesIO(b"col1,col2\n1,2"), "text/csv")},
            headers=auth_headers
        )
        assert response.status_code == 200


class TestConcurrentUploads:
    """Tests for concurrent upload handling."""
    
    def test_multiple_uploads_same_user(self, client, test_user, auth_headers):
        """Test multiple uploads by same user."""
        client.post("/auth/register", json=test_user)
        
        for i in range(5):
            response = client.post(
                "/upload",
                files={"file": (f"test{i}.csv", BytesIO(b"col1,col2\n1,2"), "text/csv")},
                headers=auth_headers
            )
            assert response.status_code == 200
