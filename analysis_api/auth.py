"""
Authentication Module for Six Sigma Analysis API
JWT-based authentication with API key support
"""

import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
API_KEY_HEADER = "X-API-Key"

security = HTTPBearer(auto_error=False)


class User(BaseModel):
    id: str
    email: str
    name: str
    role: str = "user"
    created_at: str
    is_active: bool = True


class UserCreate(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hash_value = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}${hash_value}"


def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, hash_value = hashed.split("$")
        return hashlib.sha256(f"{salt}{password}".encode()).hexdigest() == hash_value
    except ValueError:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    expires = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"sub": user_id, "email": email, "role": role, "exp": expires, "iat": datetime.utcnow()}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired", headers={"WWW-Authenticate": "Bearer"})
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})


async def get_current_user(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> User:
    from auth_storage import get_user_by_id, get_api_key, update_api_key_last_used
    if credentials:
        payload = decode_token(credentials.credentials)
        if payload:
            user = get_user_by_id(payload.get("sub"))
            if user and user.get("is_active"):
                return User(**user)
    api_key = request.headers.get(API_KEY_HEADER)
    if api_key:
        key_data = get_api_key(api_key)
        if key_data and key_data.get("is_active"):
            user = get_user_by_id(key_data.get("user_id"))
            if user and user.get("is_active"):
                update_api_key_last_used(api_key)
                return User(**user)
    raise HTTPException(status_code=401, detail="Authentication required", headers={"WWW-Authenticate": "Bearer"})


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user