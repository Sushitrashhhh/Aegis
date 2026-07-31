from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid

class SensorEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    device_id: str
    device_name: Optional[str] = "host-workstation-01"
    event_type: str  # e.g., 'process_execution', 'network_traffic', 'file_modification'
    process_name: Optional[str] = None
    process_id: Optional[int] = None
    parent_process: Optional[str] = None
    user: Optional[str] = "root"
    src_ip: Optional[str] = None
    dst_ip: Optional[str] = None
    port: Optional[int] = None
    network_bytes_sec: Optional[float] = 0.0
    file_path: Optional[str] = None
    command_line: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)

class DetectionRuleResult(BaseModel):
    rule_id: str
    rule_name: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float
    matched_event_id: str
    description: str
    suggested_type: str
