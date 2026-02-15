"""
SQLite-based persistent storage for analysis results
Replaces in-memory storage to survive server restarts
"""

import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from typing import Any, Dict, List, Optional


# Database path - can be configured via environment variable
DATABASE_PATH = os.getenv("ANALYSIS_DB_PATH", "analysis_results.db")


@contextmanager
def get_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Initialize the database schema"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                analysis_id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                analysis_type TEXT NOT NULL,
                results TEXT NOT NULL,
                metadata TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create index for faster lookups by type
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_analysis_type 
            ON analyses(analysis_type)
        """)
        
        # Create index for faster lookups by timestamp
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_timestamp 
            ON analyses(timestamp)
        """)
        
        conn.commit()
        print(f"Database initialized at {DATABASE_PATH}")


def store_result(analysis_id: str, analysis_type: str, results: Any, metadata: Dict = None) -> str:
    """
    Store analysis results in the database.
    
    Args:
        analysis_id: Unique identifier for the analysis
        analysis_type: Type of analysis (descriptive, capability, etc.)
        results: Analysis results (will be JSON serialized)
        metadata: Optional metadata dictionary
        
    Returns:
        The analysis_id
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO analyses 
            (analysis_id, timestamp, analysis_type, results, metadata)
            VALUES (?, ?, ?, ?, ?)
        """, (
            analysis_id,
            datetime.now().isoformat(),
            analysis_type,
            json.dumps(results),
            json.dumps(metadata) if metadata else None
        ))
        conn.commit()
    
    return analysis_id


def get_result(analysis_id: str) -> Optional[Dict]:
    """
    Retrieve a specific analysis result.
    
    Args:
        analysis_id: The unique identifier
        
    Returns:
        Dictionary with analysis data or None if not found
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT analysis_id, timestamp, analysis_type, results, metadata
            FROM analyses WHERE analysis_id = ?
        """, (analysis_id,))
        
        row = cursor.fetchone()
        if row:
            return {
                "analysis_id": row["analysis_id"],
                "timestamp": row["timestamp"],
                "analysis_type": row["analysis_type"],
                "results": json.loads(row["results"]),
                "metadata": json.loads(row["metadata"]) if row["metadata"] else {}
            }
        return None


def list_results(limit: int = 100, offset: int = 0) -> Dict:
    """
    List all stored analysis results with pagination.
    
    Args:
        limit: Maximum number of results to return
        offset: Number of results to skip
        
    Returns:
        Dictionary with count and list of analyses
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM analyses")
        total_count = cursor.fetchone()["count"]
        
        # Get paginated results
        cursor.execute("""
            SELECT analysis_id, analysis_type, timestamp
            FROM analyses
            ORDER BY timestamp DESC
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        analyses = [
            {
                "analysis_id": row["analysis_id"],
                "type": row["analysis_type"],
                "timestamp": row["timestamp"]
            }
            for row in cursor.fetchall()
        ]
        
        return {
            "count": total_count,
            "limit": limit,
            "offset": offset,
            "analyses": analyses
        }


def delete_result(analysis_id: str) -> bool:
    """
    Delete a specific analysis result.
    
    Args:
        analysis_id: The unique identifier
        
    Returns:
        True if deleted, False if not found
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analyses WHERE analysis_id = ?", (analysis_id,))
        conn.commit()
        return cursor.rowcount > 0


def delete_old_results(days: int = 30) -> int:
    """
    Delete analysis results older than specified days.
    
    Args:
        days: Number of days to keep results
        
    Returns:
        Number of deleted records
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM analyses 
            WHERE datetime(timestamp) < datetime('now', ?)
        """, (f"-{days} days",))
        conn.commit()
        return cursor.rowcount


def get_storage_stats() -> Dict:
    """
    Get statistics about the storage.
    
    Returns:
        Dictionary with storage statistics
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Total count
        cursor.execute("SELECT COUNT(*) as count FROM analyses")
        total_count = cursor.fetchone()["count"]
        
        # Count by type
        cursor.execute("""
            SELECT analysis_type, COUNT(*) as count 
            FROM analyses 
            GROUP BY analysis_type
        """)
        by_type = {row["analysis_type"]: row["count"] for row in cursor.fetchall()}
        
        # Database file size
        db_size = 0
        if os.path.exists(DATABASE_PATH):
            db_size = os.path.getsize(DATABASE_PATH)
        
        return {
            "total_analyses": total_count,
            "by_type": by_type,
            "database_size_bytes": db_size,
            "database_path": DATABASE_PATH
        }


# Initialize database on module import
init_db()