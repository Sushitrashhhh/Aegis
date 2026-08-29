import httpx
from sensor.attacks.privilege_escalation import generate_privesc_events

def run_privesc_attack_simulation(backend_url: str = "http://localhost:8000/api/v1/telemetry/ingest"):
    events = [e.model_dump() if hasattr(e, "model_dump") else e.dict() for e in generate_privesc_events("DEV-FIN-WKS-04")]
    print(f"[DEMO] Streaming Privilege Escalation attack telemetry ({len(events)} events)...")
    try:
        resp = httpx.post(backend_url, json=events, timeout=10.0)
        print(f"[DEMO] Server Response: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"[DEMO] Simulation failed: {e}")

if __name__ == "__main__":
    run_privesc_attack_simulation()
