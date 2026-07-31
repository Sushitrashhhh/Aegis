from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class IncidentCreate(BaseModel):
    title: str
    device_id: str
    attack_type: str
    severity: str
    description: str
    details: Optional[Dict[str, Any]] = None

class IncidentResponse(BaseModel):
    id: str
    device_id: str
    title: str
    attack_type: str
    severity: str
    status: str
    confidence: float
    description: Optional[str]
    ai_reasoning: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
