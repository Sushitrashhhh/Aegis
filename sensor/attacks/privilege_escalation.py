from typing import List
from sensor.schema import SensorEvent

def generate_privesc_events(device_id: str = "DEV-FIN-WKS-04") -> List[SensorEvent]:
    return [
        SensorEvent(
            device_id=device_id,
            device_name="finance-laptop-04",
            event_type="process_execution",
            process_name="cmd.exe",
            process_id=4092,
            parent_process="explorer.exe",
            user="jdoe",
            command_line="whoami /priv",
            details={"integrity_level": "Medium"}
        ),
        SensorEvent(
            device_id=device_id,
            device_name="finance-laptop-04",
            event_type="process_execution",
            process_name="mimikatz.exe",
            process_id=5120,
            parent_process="cmd.exe",
            user="jdoe",
            command_line="mimikatz.exe privilege::debug sekurlsa::logonpasswords exit",
            details={"integrity_level": "High", "lsass_accessed": True}
        )
    ]
