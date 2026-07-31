from typing import Dict, Any
from sensor.schema import SensorEvent

def enrich_event(event: SensorEvent) -> Dict[str, Any]:
    """Enrich raw sensor telemetry with context heuristics."""
    return {
        "event_id": event.event_id,
        "device_id": event.device_id,
        "device_name": event.device_name,
        "process_tree": [
            {"pid": 100, "name": "systemd", "user": "root"},
            {"pid": event.process_id or 1000, "name": event.process_name or "unknown", "cmd": event.command_line}
        ],
        "network_context": {
            "src_ip": event.src_ip or "127.0.0.1",
            "dst_ip": event.dst_ip or "10.0.0.1",
            "bandwidth": event.network_bytes_sec
        },
        "geo_ip": "External / Internal Subnet",
        "threat_score": 85 if event.user == "root" else 65
    }
