from typing import List, Optional
from sensor.schema import SensorEvent, DetectionRuleResult

class RuleEngine:
    """Stage 1 Detection Engine applying heuristic and signature rules to incoming sensor events."""

    @staticmethod
    def evaluate(event: SensorEvent) -> List[DetectionRuleResult]:
        matches: List[DetectionRuleResult] = []

        # Rule 1: High Traffic / DDoS Detection
        syn_flood = bool((event.details or {}).get("syn_flood_detected") or (event.details or {}).get("syn_flood") or (event.details or {}).get("protocol") == "TCP SYN Flood")
        packet_rate = (event.details or {}).get("packet_rate", 0)
        if (event.network_bytes_sec and event.network_bytes_sec > 50_000_000) or syn_flood or (isinstance(packet_rate, (int, float)) and packet_rate > 10000):
            matches.append(DetectionRuleResult(
                rule_id="RULE-NET-001",
                rule_name="DDoS Network Traffic Surge",
                severity="HIGH",
                confidence=0.92,
                matched_event_id=event.event_id,
                description=f"High-velocity packet storm / DDoS traffic surge observed ({((event.network_bytes_sec or 0) / 1e6):.1f} MB/s, {packet_rate} pkts/sec) targeting {event.device_name or event.device_id}",
                suggested_type="DDoS"
            ))

        # Rule 2: Privilege Escalation Attempt
        cmd = (event.command_line or "").lower()
        proc = (event.process_name or "").lower()
        if "mimikatz" in cmd or "lsass" in cmd or "sudo su" in cmd or "chmod +s" in cmd or "whoami /priv" in cmd:
            matches.append(DetectionRuleResult(
                rule_id="RULE-SEC-002",
                rule_name="Privilege Escalation Activity",
                severity="CRITICAL",
                confidence=0.95,
                matched_event_id=event.event_id,
                description=f"Suspicious privilege escalation command executed: '{event.command_line}' by user '{event.user}'",
                suggested_type="Privilege Escalation"
            ))

        # Rule 3: Ransomware Activity (Mass File Rename/Encryption/Shadow Copy Delete)
        f_path = (event.file_path or "").lower()
        if "vssadmin delete shadows" in cmd or ".locked" in f_path or ".crypto" in f_path or "wbadmin delete" in cmd:
            matches.append(DetectionRuleResult(
                rule_id="RULE-RANSOM-003",
                rule_name="Ransomware / Shadow Copy Erasure",
                severity="CRITICAL",
                confidence=0.98,
                matched_event_id=event.event_id,
                description=f"Ransomware signature detected: volume shadow copies deleted or rapid extension encryption in path '{event.file_path}'",
                suggested_type="Ransomware"
            ))

        return matches
