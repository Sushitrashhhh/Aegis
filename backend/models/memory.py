from pydantic import BaseModel
from typing import Optional

class AgentMemoryItem(BaseModel):
    id: str
    incident_id: Optional[str] = None
    threat_type: str
    summary: str
    action_taken: str
