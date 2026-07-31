from typing import List
from sensor.schema import SensorEvent
from sensor.attacks.ddos import generate_ddos_events
from sensor.attacks.privilege_escalation import generate_privesc_events
from sensor.attacks.ransomware import generate_ransomware_events

def get_attack_stream(attack_type: str, device_id: str = None) -> List[SensorEvent]:
    attack_type = attack_type.lower()
    if attack_type == "ddos":
        return generate_ddos_events(device_id or "DEV-PROD-SRV-01")
    elif attack_type in ["privilege_escalation", "privesc"]:
        return generate_privesc_events(device_id or "DEV-FIN-WKS-04")
    elif attack_type == "ransomware":
        return generate_ransomware_events(device_id or "DEV-DB-SRV-02")
    else:
        raise ValueError(f"Unknown attack type: {attack_type}")
