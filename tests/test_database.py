import pytest
from backend.database.db import init_db, save_incident, get_incidents, get_incident_by_id

def test_database_crud():
    init_db()
    test_inc = {
        "id": "INC-TEST-999",
        "device_id": "DEV-TEST-01",
        "title": "UnitTest Incident",
        "attack_type": "DDoS",
        "severity": "HIGH",
        "status": "OPEN",
        "confidence": 0.92,
        "description": "Test description",
        "ai_reasoning": {"verdict": "Confirmed DDoS"}
    }
    save_incident(test_inc)
    
    retrieved = get_incident_by_id("INC-TEST-999")
    assert retrieved is not None
    assert retrieved["title"] == "UnitTest Incident"
    assert retrieved["ai_reasoning"]["verdict"] == "Confirmed DDoS"

    incidents = get_incidents()
    assert len(incidents) > 0
