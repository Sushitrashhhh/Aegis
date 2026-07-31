from typing import Dict, Any
from ai.reasoning import ai_engine
from backend.database.db import save_incident, update_device_status

async def trigger_ai_pipeline(alert_data: Dict[str, Any]) -> Dict[str, Any]:
    # Run AI reasoning
    ai_reasoning = ai_engine.analyze_incident(alert_data)

    status = "CONTAINED" if ai_reasoning.get("isolation_executed") else "INVESTIGATING"

    incident_record = {
        "id": alert_data.get("incident_id"),
        "device_id": alert_data.get("device_id"),
        "title": alert_data.get("title"),
        "attack_type": alert_data.get("attack_type"),
        "severity": alert_data.get("severity"),
        "status": status,
        "confidence": alert_data.get("confidence", 0.95),
        "description": alert_data.get("description"),
        "ai_reasoning": ai_reasoning
    }

    # Save incident in DB
    save_incident(incident_record)

    # Update device status if isolated
    if ai_reasoning.get("isolation_executed"):
        update_device_status(alert_data.get("device_id"), "ISOLATED")

    return incident_record
