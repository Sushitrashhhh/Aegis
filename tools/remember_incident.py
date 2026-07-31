from typing import Dict, Any
from ai.memory import global_agent_memory

def remember_incident(incident_id: str, summary: str, threat_type: str, action_taken: str) -> Dict[str, Any]:
    """Store resolved incident into vector agent memory for continuous learning."""
    global_agent_memory.remember_incident(
        incident_id=incident_id,
        summary=summary,
        threat_type=threat_type,
        action_taken=action_taken
    )
    return {
        "status": "MEMORY_STORED",
        "incident_id": incident_id,
        "message": f"Incident {incident_id} successfully persisted to Bedrock Titan vector memory store."
    }
