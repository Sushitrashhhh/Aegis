from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Any
from sensor.schema import SensorEvent
from backend.services.ingestion import ingest_sensor_events
from backend.database.db import get_incidents, get_incident_by_id, update_incident_status, get_devices, update_device_status
from backend.agents.cyra_agent import cyra_agent_instance
from tools.isolate_device import isolate_device
from backend.api.websocket import ws_manager

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "HEALTHY", "service": "Cyra Sentinel SOC Engine"}

@router.get("/incidents")
async def list_incidents():
    return get_incidents()

@router.get("/incidents/{incident_id}")
async def get_incident(incident_id: str):
    inc = get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.post("/incidents/{incident_id}/status")
async def set_incident_status(incident_id: str, payload: Dict[str, str]):
    status = payload.get("status", "RESOLVED")
    update_incident_status(incident_id, status)
    return {"status": "UPDATED", "incident_id": incident_id, "new_status": status}

@router.get("/devices")
async def list_devices():
    return get_devices()

@router.post("/devices/{device_id}/isolate")
async def isolate_device_route(device_id: str, payload: Dict[str, str]):
    reason = payload.get("reason", "Manual analyst isolation request")
    res = isolate_device(device_id, reason)
    update_device_status(device_id, "ISOLATED")
    await ws_manager.broadcast({"type": "DEVICE_ISOLATED", "device_id": device_id, "result": res})
    return res

@router.post("/telemetry/ingest")
async def ingest_telemetry(events: List[SensorEvent], background_tasks: BackgroundTasks):
    incidents = await ingest_sensor_events(events)
    for inc in incidents:
        await ws_manager.broadcast({"type": "NEW_INCIDENT", "incident": inc})
    return {"status": "PROCESSED", "events_ingested": len(events), "incidents_created": len(incidents)}

@router.post("/agent/chat")
async def agent_chat(payload: Dict[str, Any]):
    message = payload.get("message", "")
    incident_id = payload.get("incident_id")
    context = get_incident_by_id(incident_id) if incident_id else None
    response_text = cyra_agent_instance.chat_response(message, context)
    return {"response": response_text, "agent": "Cyra Sentinel Claude Agent"}
