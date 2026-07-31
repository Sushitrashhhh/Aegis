from sensor.schema import SensorEvent
from sensor.rules import RuleEngine
from sensor.attacks.ddos import generate_ddos_events
from sensor.attacks.privilege_escalation import generate_privesc_events
from sensor.attacks.ransomware import generate_ransomware_events

def test_ddos_rule_trigger():
    events = generate_ddos_events()
    matches = RuleEngine.evaluate(events[0])
    assert len(matches) > 0
    assert matches[0].suggested_type == "DDoS"
    assert matches[0].severity == "HIGH"

def test_privesc_rule_trigger():
    events = generate_privesc_events()
    matches = RuleEngine.evaluate(events[1]) # Mimikatz event
    assert len(matches) > 0
    assert matches[0].suggested_type == "Privilege Escalation"
    assert matches[0].severity == "CRITICAL"

def test_ransomware_rule_trigger():
    events = generate_ransomware_events()
    matches = RuleEngine.evaluate(events[0]) # vssadmin event
    assert len(matches) > 0
    assert matches[0].suggested_type == "Ransomware"
    assert matches[0].severity == "CRITICAL"
