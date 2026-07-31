from typing import Dict, Any

def explain_detection(rule_id: str, attack_type: str, details: Dict[str, Any]) -> str:
    """Generate human-readable breakdown explaining why the detection triggered."""
    if "RULE-NET" in rule_id or attack_type == "DDoS":
        bw = details.get("network_bytes_sec", 0) / 1e6
        return (f"Detection rule {rule_id} triggered due to network bandwidth anomaly "
                f"({bw:.1f} MB/s) exceeding normal threshold (500 MB/s). "
                f"Pattern matches TCP/UDP volumetric DDoS attack flooding target service.")
    elif "RULE-SEC" in rule_id or attack_type == "Privilege Escalation":
        cmd = details.get("command_line", "N/A")
        return (f"Detection rule {rule_id} triggered due to execution of credential dumping / "
                f"privilege escalation command '{cmd}'. Mimikatz or debug privilege escalation detected.")
    elif "RULE-RANSOM" in rule_id or attack_type == "Ransomware":
        return (f"Detection rule {rule_id} triggered due to shadow copy erasure (vssadmin delete shadows) "
                f"followed by rapid high-entropy file extension encryption. Matches ransomware behavior profile.")
    else:
        return f"Detection rule {rule_id} matched telemetry pattern for {attack_type}."
