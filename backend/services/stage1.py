import uuid
from typing import Optional, Dict, Any
from sensor.schema import SensorEvent
from sensor.rules import RuleEngine
from backend.services.enrichment import enrich_event
from backend.services.ai_pipeline import trigger_ai_pipeline

async def process_stage1_rules(event: SensorEvent) -> Optional[Dict[str, Any]]:
    matches = RuleEngine.evaluate(event)
    if not matches:
        return None

    top_match = matches[0]
    enriched = enrich_event(event)

    alert_data = {
        "incident_id": f"INC-{str(uuid.uuid4())[:8].upper()}",
        "device_id": event.device_id,
        "title": f"{top_match.rule_name} on {event.device_name}",
        "attack_type": top_match.suggested_type,
        "severity": top_match.severity,
        "rule_id": top_match.rule_id,
        "confidence": top_match.confidence,
        "description": top_match.description,
        "details": event.details,
        "enriched_telemetry": enriched
    }

    incident = await trigger_ai_pipeline(alert_data)
    return incident
