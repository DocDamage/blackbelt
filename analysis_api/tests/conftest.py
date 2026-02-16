"""
Pytest configuration and shared fixtures for API tests
"""

import os
import sys
import tempfile
import pytest
from typing import Generator
from unittest.mock import Mock

# Add parent directory to path to import main
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from fastapi import FastAPI

# Set test environment variables before importing app
os.environ["TESTING"] = "true"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["CORS_ORIGINS"] = "http://localhost:3000,http://localhost:5173"

# Import after setting environment variables
from main import app
from auth import create_access_token, hash_password
from auth_storage import create_user, create_api_key
from storage import init_db as init_storage_db


@pytest.fixture(scope="session")
def test_app() -> FastAPI:
    """Return the FastAPI application instance."""
    return app


@pytest.fixture
def client(test_app) -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    with TestClient(test_app) as test_client:
        yield test_client


@pytest.fixture
def test_user() -> dict:
    """Return test user data."""
    return {
        "email": "test@example.com",
        "password": "TestPassword123!",
        "name": "Test User"
    }


@pytest.fixture
def test_user_2() -> dict:
    """Return a second test user data."""
    return {
        "email": "test2@example.com",
        "password": "TestPassword456!",
        "name": "Test User 2"
    }


@pytest.fixture
def auth_headers(test_user) -> dict:
    """Generate authentication headers with JWT token."""
    token = create_access_token({"sub": test_user["email"]})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def mock_csv_file() -> bytes:
    """Return a sample CSV file content for testing."""
    return b"column1,column2,column3\n1,2,3\n4,5,6\n7,8,9\n10,11,12"


@pytest.fixture
def mock_excel_file() -> bytes:
    """Return a sample Excel file content for testing."""
    import pandas as pd
    import io
    
    df = pd.DataFrame({
        "diameter": [10.1, 10.2, 10.0, 9.9, 10.1, 10.3, 10.0, 9.8, 10.2, 10.1],
        "length": [50.0, 50.1, 49.9, 50.0, 50.2, 49.8, 50.1, 50.0, 49.9, 50.1],
        "weight": [100, 101, 99, 100, 102, 98, 101, 100, 99, 101]
    })
    
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False, engine='openpyxl')
    buffer.seek(0)
    return buffer.getvalue()


@pytest.fixture
def capability_test_data() -> bytes:
    """Return test data for capability analysis."""
    import pandas as pd
    import io
    
    # Generate normally distributed data around target
    import numpy as np
    np.random.seed(42)
    data = np.random.normal(loc=10.0, scale=0.1, size=100)
    
    df = pd.DataFrame({
        "measurement": data
    })
    
    buffer = io.BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return buffer.getvalue()


@pytest.fixture
def temp_db_path() -> Generator[str, None, None]:
    """Create a temporary database file for testing."""
    fd, path = tempfile.mkstemp(suffix='.db')
    os.close(fd)
    
    # Set the database path for testing
    original_path = os.environ.get("DATABASE_PATH")
    os.environ["DATABASE_PATH"] = path
    
    yield path
    
    # Cleanup
    if original_path:
        os.environ["DATABASE_PATH"] = original_path
    else:
        del os.environ["DATABASE_PATH"]
    
    if os.path.exists(path):
        os.unlink(path)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset rate limiter between tests."""
    # This prevents rate limit errors during tests
    pass


@pytest.fixture
def mock_jwt_secret() -> str:
    """Return a mock JWT secret for testing."""
    return "test-secret-key-for-testing-only-do-not-use-in-production"


class TestDataFactory:
    """Factory for creating test data."""
    
    @staticmethod
    def create_csv_data(rows: int = 10, columns: int = 3) -> bytes:
        """Create CSV data with specified dimensions."""
        import pandas as pd
        import io
        import numpy as np
        
        np.random.seed(42)
        data = {
            f"col_{i}": np.random.randn(rows) for i in range(columns)
        }
        df = pd.DataFrame(data)
        
        buffer = io.BytesIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)
        return buffer.getvalue()
    
    @staticmethod
    def create_capability_data(
        mean: float = 10.0,
        std: float = 0.1,
        size: int = 100
    ) -> bytes:
        """Create capability analysis test data."""
        import pandas as pd
        import io
        import numpy as np
        
        np.random.seed(42)
        data = np.random.normal(loc=mean, scale=std, size=size)
        df = pd.DataFrame({"measurement": data})
        
        buffer = io.BytesIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)
        return buffer.getvalue()
    
    @staticmethod
    def create_regression_data(n: int = 50) -> bytes:
        """Create regression test data."""
        import pandas as pd
        import io
        import numpy as np
        
        np.random.seed(42)
        x1 = np.random.randn(n)
        x2 = np.random.randn(n)
        y = 2 + 3*x1 + 1.5*x2 + np.random.randn(n) * 0.5
        
        df = pd.DataFrame({
            "y": y,
            "x1": x1,
            "x2": x2
        })
        
        buffer = io.BytesIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)
        return buffer.getvalue()


@pytest.fixture
def data_factory() -> TestDataFactory:
    """Return the test data factory."""
    return TestDataFactory()
