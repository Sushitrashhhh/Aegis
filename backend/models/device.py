from pydantic import BaseModel
from typing import Optional

class DeviceModel(BaseModel):
    device_id: str
    name: str
    ip_address: str
    owner: str
    os: str
    criticality: str
    status: str
