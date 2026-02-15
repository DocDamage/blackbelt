"""
Authentication Storage Module for Six Sigma Analysis API
"""

import json
import os
from datetime import datetime
from typing import Optional, Dict, List
import uuid

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(DATA_DIR, "data", "users.json")
API_KEYS_FILE = os.path.join(DATA_DIR, "data", "api_keys.json")

def _ensure_data_dir():
    data_dir = os.path.join(DATA_DIR, "data")
    os.makedirs(data_dir, exist_ok=True)

def _load_json(filepath: str, default: dict = None) -> dict:
    if default is None:
        default = {}
    try:
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError):
        pass
    return default

def _save_json(filepath: str, data: dict):
    _ensure_data_dir()
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)

def get_user_by_id(user_id: str) -> Optional[Dict]:
    users = _load_json(USERS_FILE)
    return users.get(user_id)

def get_user_by_email(email: str) -> Optional[Dict]:
    users = _load_json(USERS_FILE)
    for user in users.values():
        if user.get("email", "").lower() == email.lower():
            return user
    return None

def create_user(email: str, password_hash: str, name: str, role: str = "user") -> Dict:
    users = _load_json(USERS_FILE)
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    user = {"id": user_id, "email": email.lower(), "password_hash": password_hash, "name": name, "role": role, "created_at": now, "updated_at": now, "is_active": True}
    users[user_id] = user
    _save_json(USERS_FILE, users)
    return user

def get_api_key(key: str) -> Optional[Dict]:
    api_keys = _load_json(API_KEYS_FILE)
    return api_keys.get(key)

def create_api_key(user_id: str, name: str, key: str) -> Dict:
    api_keys = _load_json(API_KEYS_FILE)
    key_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    key_data = {"id": key_id, "key": key, "user_id": user_id, "name": name, "created_at": now, "last_used_at": None, "is_active": True}
    api_keys[key] = key_data
    _save_json(API_KEYS_FILE, api_keys)
    return key_data

def update_api_key_last_used(key: str):
    api_keys = _load_json(API_KEYS_FILE)
    if key in api_keys:
        api_keys[key]["last_used_at"] = datetime.utcnow().isoformat()
        _save_json(API_KEYS_FILE, api_keys)

def list_api_keys_for_user(user_id: str) -> List[Dict]:
    api_keys = _load_json(API_KEYS_FILE)
    return [k for k in api_keys.values() if k.get("user_id") == user_id]