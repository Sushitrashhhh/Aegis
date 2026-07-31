import logging
from typing import Dict, Any, List
from sensor.schema import SensorEvent
from backend.services.stage1 import process_stage1_rules

logger = logging.getLogger("cyra_sentinel.services.ingestion")

async def ingest_sensor_events(events: List[SensorEvent]) -> List[Dict[str, Any]]:
    """Ingest batch of sensor events, execute Stage 1 rule engine, and feed into AI pipeline."""
    incidents_generated = []
    for event in events:
        inc = await process_stage1_rules(event)
        if inc:
            incidents_generated.append(inc)
    return incidents_generated
