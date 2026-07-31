from typing import List
from sensor.schema import SensorEvent

def generate_ddos_events(device_id: str = "DEV-PROD-SRV-01") -> List[SensorEvent]:
    return [
        SensorEvent(
            device_id=device_id,
            device_name="prod-web-server-01",
            event_type="network_traffic",
            src_ip="192.168.1.105",
            dst_ip="10.0.0.1",
            port=80,
            network_bytes_sec=850_000_000.0,
            user="www-data",
            command_line="nginx: worker process",
            details={"requests_per_sec": 125000, "protocol": "TCP SYN Flood"}
        ),
        SensorEvent(
            device_id=device_id,
            device_name="prod-web-server-01",
            event_type="network_traffic",
            src_ip="192.168.1.108",
            dst_ip="10.0.0.1",
            port=443,
            network_bytes_sec=920_000_000.0,
            user="www-data",
            command_line="nginx: worker process",
            details={"requests_per_sec": 140000, "protocol": "UDP Flood"}
        )
    ]
