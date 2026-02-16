"""
Authentication Tests

Tests for JWT token generation, validation, password hashing,
API key management, and protected endpoint access.
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt, JWTError

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    User,
    UserCreate,
    UserLogin,
    JWT_EXPIRATION_HOURS
)


class TestPasswordHashing:
    """Tests for password hashing and verification."""
    
    def test_hash_password_returns_string(self):
        """Test that hash_password returns a string."""
        password = "TestPassword123!"
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0
    
    def test_hash_password_generates_different_hashes(self):
        """Test that same password generates different hashes."""
        password = "TestPassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2
    
    def test_verify_password_correct_password(self):
        """Test verifying correct password."""
        password = "TestPassword123!"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True
    
    def test_verify_password_incorrect_password(self):
        """Test verifying incorrect password."""
        password = "TestPassword123!"
        wrong_password = "WrongPassword123!"
        hashed = hash_password(password)
        assert verify_password(wrong_password, hashed) is False
    
    def test_verify_password_empty_password(self):
        """Test verifying empty password."""
        password = ""
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True
        assert verify_password("not_empty", hashed) is False


class TestJWTTokenGeneration:
    """Tests for JWT token creation and validation."""
    
    def test_create_access_token_returns_string(self):
        """Test that create_access_token returns a string."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_access_token_contains_subject(self):
        """Test that token contains the subject claim."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)
        
        # Decode without verification for testing
        decoded = jwt.decode(token, options={"verify_signature": False})
        assert decoded["sub"] == "test@example.com"
    
    def test_create_access_token_has_expiration(self):
        """Test that token has expiration claim."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)
        
        decoded = jwt.decode(token, options={"verify_signature": False})
        assert "exp" in decoded
        
        # Check expiration is in the future
        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        assert exp_datetime > datetime.utcnow()
    
    def test_create_access_token_custom_expiration(self):
        """Test creating token with custom expiration."""
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(minutes=30)
        token = create_access_token(data, expires_delta=expires_delta)
        
        decoded = jwt.decode(token, options={"verify_signature": False})
        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        
        # Should be approximately 30 minutes from now
        expected_exp = datetime.utcnow() + expires_delta
        time_diff = abs((exp_datetime - expected_exp).total_seconds())
        assert time_diff < 5  # Within 5 seconds


class TestAuthModels:
    """Tests for Pydantic auth models."""
    
    def test_user_create_model(self):
        """Test UserCreate model validation."""
        user = UserCreate(
            email="test@example.com",
            password="TestPassword123!",
            name="Test User"
        )
        assert user.email == "test@example.com"
        assert user.password == "TestPassword123!"
        assert user.name == "Test User"
    
    def test_user_create_invalid_email(self):
        """Test UserCreate with invalid email."""
        with pytest.raises(ValueError):
            UserCreate(
                email="invalid-email",
                password="TestPassword123!",
                name="Test User"
            )
    
    def test_user_login_model(self):
        """Test UserLogin model."""
        login = UserLogin(
            email="test@example.com",
            password="TestPassword123!"
        )
        assert login.email == "test@example.com"
        assert login.password == "TestPassword123!"
    
    def test_user_model(self):
        """Test User model."""
        user = User(
            email="test@example.com",
            name="Test User",
            is_admin=False
        )
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.is_admin is False


class TestAuthEndpoints:
    """Tests for authentication endpoints."""
    
    def test_register_endpoint_success(self, client, test_user):
        """Test successful user registration."""
        response = client.post("/auth/register", json=test_user)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["email"] == test_user["email"]
        assert data["name"] == test_user["name"]
        assert "password" not in data
    
    def test_register_endpoint_duplicate_email(self, client, test_user):
        """Test registration with duplicate email."""
        # Register first user
        response = client.post("/auth/register", json=test_user)
        assert response.status_code == 201
        
        # Try to register again with same email
        response = client.post("/auth/register", json=test_user)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_login_endpoint_success(self, client, test_user):
        """Test successful login."""
        # Register user first
        client.post("/auth/register", json=test_user)
        
        # Login
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_endpoint_invalid_credentials(self, client, test_user):
        """Test login with invalid credentials."""
        # Register user first
        client.post("/auth/register", json=test_user)
        
        # Try to login with wrong password
        login_data = {
            "email": test_user["email"],
            "password": "WrongPassword123!"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_endpoint_nonexistent_user(self, client):
        """Test login with non-existent user."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123!"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
    
    def test_me_endpoint_authenticated(self, client, test_user, auth_headers):
        """Test /auth/me endpoint with authentication."""
        # Register user first
        client.post("/auth/register", json=test_user)
        
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user["email"]
        assert data["name"] == test_user["name"]
    
    def test_me_endpoint_unauthenticated(self, client):
        """Test /auth/me endpoint without authentication."""
        response = client.get("/auth/me")
        assert response.status_code == 401


class TestProtectedEndpoints:
    """Tests for protected endpoint access."""
    
    def test_protected_endpoint_without_auth(self, client):
        """Test accessing protected endpoint without authentication."""
        response = client.post("/upload", files={"file": ("test.csv", b"test,data\n1,2")})
        assert response.status_code == 401
    
    def test_protected_endpoint_with_invalid_token(self, client):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid-token"}
        response = client.post("/upload", files={"file": ("test.csv", b"test,data\n1,2")}, headers=headers)
        assert response.status_code == 401
    
    def test_protected_endpoint_with_valid_token(self, client, test_user, auth_headers, mock_csv_file):
        """Test accessing protected endpoint with valid token."""
        # Register user first
        client.post("/auth/register", json=test_user)
        
        response = client.post(
            "/upload",
            files={"file": ("test.csv", mock_csv_file)},
            headers=auth_headers
        )
        # Should not be 401 (might be other errors related to file processing)
        assert response.status_code != 401
