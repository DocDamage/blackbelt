"""
Storage Tests

Tests for SQLite storage operations including CRUD operations,
result storage, and database initialization.
"""

import pytest
import json
import uuid
from datetime import datetime
from unittest.mock import patch

from storage import (
    init_db,
    store_result,
    get_result,
    list_results,
    delete_result,
    delete_old_results,
    get_storage_stats,
    analyze_data,
    ANALYSIS_TYPES
)


class TestDatabaseInitialization:
    """Tests for database initialization."""
    
    def test_init_db_creates_tables(self, temp_db_path):
        """Test that init_db creates necessary tables."""
        init_db()
        
        # Check that we can perform operations
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "descriptive",
            "results": {"test": "data"},
            "metadata": {"test": "metadata"}
        }
        
        # Should not raise an exception
        store_result(test_data)


class TestStoreResult:
    """Tests for storing analysis results."""
    
    def test_store_result_success(self, temp_db_path):
        """Test successful result storage."""
        init_db()
        
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "descriptive",
            "results": {"mean": 10.5, "std": 2.1},
            "metadata": {"filename": "test.csv", "rows": 100}
        }
        
        store_result(test_data)
        
        # Verify storage
        retrieved = get_result(result_id)
        assert retrieved is not None
        assert retrieved["analysis_id"] == result_id
        assert retrieved["analysis_type"] == "descriptive"
    
    def test_store_result_updates_existing(self, temp_db_path):
        """Test that storing with same ID updates existing record."""
        init_db()
        
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "descriptive",
            "results": {"mean": 10.5},
            "metadata": {}
        }
        
        store_result(test_data)
        
        # Store again with different data
        test_data["results"] = {"mean": 20.0}
        store_result(test_data)
        
        # Verify update
        retrieved = get_result(result_id)
        assert retrieved["results"]["mean"] == 20.0
    
    def test_store_result_all_analysis_types(self, temp_db_path):
        """Test storing results for all analysis types."""
        init_db()
        
        for analysis_type in ANALYSIS_TYPES:
            result_id = str(uuid.uuid4())
            test_data = {
                "analysis_id": result_id,
                "timestamp": datetime.utcnow().isoformat(),
                "analysis_type": analysis_type,
                "results": {"test": "data"},
                "metadata": {}
            }
            
            store_result(test_data)
            
            retrieved = get_result(result_id)
            assert retrieved is not None
            assert retrieved["analysis_type"] == analysis_type


class TestGetResult:
    """Tests for retrieving analysis results."""
    
    def test_get_result_existing(self, temp_db_path):
        """Test retrieving existing result."""
        init_db()
        
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "descriptive",
            "results": {"mean": 10.5},
            "metadata": {"filename": "test.csv"}
        }
        
        store_result(test_data)
        retrieved = get_result(result_id)
        
        assert retrieved is not None
        assert retrieved["analysis_id"] == result_id
        assert retrieved["analysis_type"] == "descriptive"
        assert retrieved["results"]["mean"] == 10.5
        assert retrieved["metadata"]["filename"] == "test.csv"
    
    def test_get_result_nonexistent(self, temp_db_path):
        """Test retrieving non-existent result."""
        init_db()
        
        retrieved = get_result("non-existent-id")
        assert retrieved is None
    
    def test_get_result_invalid_id(self, temp_db_path):
        """Test retrieving with invalid ID format."""
        init_db()
        
        retrieved = get_result("")
        assert retrieved is None


class TestListResults:
    """Tests for listing analysis results."""
    
    def test_list_results_empty(self, temp_db_path):
        """Test listing when no results exist."""
        init_db()
        
        results = list_results()
        assert results == []
    
    def test_list_results_returns_data(self, temp_db_path):
        """Test listing returns stored results."""
        init_db()
        
        # Store multiple results
        for i in range(5):
            result_id = str(uuid.uuid4())
            test_data = {
                "analysis_id": result_id,
                "timestamp": datetime.utcnow().isoformat(),
                "analysis_type": "descriptive",
                "results": {"index": i},
                "metadata": {}
            }
            store_result(test_data)
        
        results = list_results()
        assert len(results) == 5
    
    def test_list_results_pagination(self, temp_db_path):
        """Test listing with pagination."""
        init_db()
        
        # Store 10 results
        for i in range(10):
            result_id = str(uuid.uuid4())
            test_data = {
                "analysis_id": result_id,
                "timestamp": datetime.utcnow().isoformat(),
                "analysis_type": "descriptive",
                "results": {"index": i},
                "metadata": {}
            }
            store_result(test_data)
        
        # Get first page (limit=5)
        page1 = list_results(limit=5, offset=0)
        assert len(page1) == 5
        
        # Get second page
        page2 = list_results(limit=5, offset=5)
        assert len(page2) == 5
    
    def test_list_results_structure(self, temp_db_path):
        """Test that listed results have correct structure."""
        init_db()
        
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "capability",
            "results": {"cpk": 1.5},
            "metadata": {"filename": "test.csv"}
        }
        store_result(test_data)
        
        results = list_results()
        assert len(results) == 1
        
        result = results[0]
        assert "analysis_id" in result
        assert "timestamp" in result
        assert "analysis_type" in result
        assert result["analysis_type"] == "capability"


class TestDeleteResults:
    """Tests for deleting analysis results."""
    
    def test_delete_result_existing(self, temp_db_path):
        """Test deleting existing result."""
        init_db()
        
        result_id = str(uuid.uuid4())
        test_data = {
            "analysis_id": result_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "descriptive",
            "results": {},
            "metadata": {}
        }
        store_result(test_data)
        
        # Verify exists
        assert get_result(result_id) is not None
        
        # Delete
        delete_result(result_id)
        
        # Verify deleted
        assert get_result(result_id) is None
    
    def test_delete_result_nonexistent(self, temp_db_path):
        """Test deleting non-existent result (should not raise)."""
        init_db()
        
        # Should not raise exception
        delete_result("non-existent-id")
    
    def test_delete_old_results(self, temp_db_path):
        """Test deleting old results by age."""
        init_db()
        
        # Store result with old timestamp
        old_result_id = str(uuid.uuid4())
        old_timestamp = "2020-01-01T00:00:00"  # Very old
        test_data = {
            "analysis_id": old_result_id,
            "timestamp": old_timestamp,
            "analysis_type": "descriptive",
            "results": {},
            "metadata": {}
        }
        store_result(test_data)
        
        # Store recent result
        recent_result_id = str(uuid.uuid4())
        recent_timestamp = datetime.utcnow().isoformat()
        test_data2 = {
            "analysis_id": recent_result_id,
            "timestamp": recent_timestamp,
            "analysis_type": "descriptive",
            "results": {},
            "metadata": {}
        }
        store_result(test_data2)
        
        # Delete results older than 30 days
        deleted_count = delete_old_results(days=30)
        
        # Old result should be deleted
        assert get_result(old_result_id) is None
        # Recent result should remain
        assert get_result(recent_result_id) is not None


class TestStorageStats:
    """Tests for storage statistics."""
    
    def test_get_storage_stats_empty(self, temp_db_path):
        """Test stats when storage is empty."""
        init_db()
        
        stats = get_storage_stats()
        assert stats["total_analyses"] == 0
        assert stats["analyses_by_type"] == {}
    
    def test_get_storage_stats_with_data(self, temp_db_path):
        """Test stats with stored data."""
        init_db()
        
        # Store results of different types
        for _ in range(3):
            store_result({
                "analysis_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat(),
                "analysis_type": "descriptive",
                "results": {},
                "metadata": {}
            })
        
        for _ in range(2):
            store_result({
                "analysis_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat(),
                "analysis_type": "capability",
                "results": {},
                "metadata": {}
            })
        
        stats = get_storage_stats()
        assert stats["total_analyses"] == 5
        assert stats["analyses_by_type"]["descriptive"] == 3
        assert stats["analyses_by_type"]["capability"] == 2


class TestAnalyzeData:
    """Tests for the analyze_data helper function."""
    
    def test_analyze_data_descriptive(self, data_factory):
        """Test descriptive statistics analysis."""
        data = data_factory.create_csv_data(rows=100, columns=1)
        
        result = analyze_data(data, "test.csv", "descriptive", columns=["col_0"])
        
        assert result["analysis_type"] == "descriptive"
        assert "results" in result
        assert "metadata" in result
        assert result["metadata"]["filename"] == "test.csv"
    
    def test_analyze_data_capability(self, data_factory):
        """Test capability analysis."""
        data = data_factory.create_capability_data(mean=10.0, std=0.1, size=100)
        
        result = analyze_data(
            data,
            "test.csv",
            "capability",
            column="measurement",
            usl=10.5,
            lsl=9.5
        )
        
        assert result["analysis_type"] == "capability"
        assert "results" in result
        results = result["results"]
        assert "cp" in results
        assert "cpk" in results
        assert "sigma_level" in results
    
    def test_analyze_data_invalid_type(self, data_factory):
        """Test analysis with invalid type."""
        data = data_factory.create_csv_data(rows=10, columns=1)
        
        with pytest.raises(ValueError):
            analyze_data(data, "test.csv", "invalid_type")
