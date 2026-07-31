from typing import Dict, Any

def recommend_action(attack_type: str, device_criticality: str = "MEDIUM") -> Dict[str, Any]:
    """Recommend containment and remediation actions based on threat taxonomy and device criticality."""
    attack_type_upper = attack_type.upper()
    if "DDOS" in attack_type_upper:
        return {
            "recommended_action": "Enable Firewall Rate Limiting & Blacklist Traffic",
            "action_type": "FIREWALL_BLOCK",
            "urgency": "HIGH",
            "automated_containment_available": True,
            "steps": [
                "Apply dynamic drop rule for high-frequency source IPs",
                "Enable CDN / Cloudflare DDoS protection mode",
                "Notify Infrastructure On-Call Analyst"
            ]
        }
    elif "PRIV" in attack_type_upper:
        return {
            "recommended_action": "Isolate Host & Revoke User Session",
            "action_type": "HOST_ISOLATION",
            "urgency": "CRITICAL",
            "automated_containment_available": True,
            "steps": [
                "Disconnect device from internal subnet (software isolation)",
                "Terminate process tree associated with mimikatz / cmd",
                "Invalidate Active Directory tokens for user account"
            ]
        }
    elif "RANSOM" in attack_type_upper:
        return {
            "recommended_action": "Immediate Host Network Isolation & Process Containment",
            "action_type": "EMERGENCY_ISOLATION",
            "urgency": "CRITICAL",
            "automated_containment_available": True,
            "steps": [
                "Sever network interface immediately to prevent lateral spread",
                "Kill encrypting process PID",
                "Initiate automated backup recovery dry-run"
            ]
        }
    else:
        return {
            "recommended_action": "Investigate Telemetry & Monitor Process Activity",
            "action_type": "MONITOR",
            "urgency": "MEDIUM",
            "automated_containment_available": False,
            "steps": ["Collect memory dump", "Review system log entries"]
        }
