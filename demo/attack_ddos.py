import httpx
import json
from sensor.attacks.ddos import generate_ddos_events

def run_ddos_attack_simulation(backend_url: str = "http://localhost:8000/api/v1/telemetry/ingest"):
    events = [e.dict() for e in generate_ddos_events("DEV-PROD-SRV-01")]
    print(f"[DEMO] Streaming DDoS Attack telemetry ({len(events)} events) to {backend_url}...")
    try:
        resp = httpx.post(backend_url, json=events, timeout=10.0)
        print(f"[DEMO] Server Response: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"[DEMO] Simulation failed: {e}")

if __name__ == "__main__":
    run_ddos_attack_simulation()
