import argparse
import sys
import os

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from demo.attack_ddos import run_ddos_attack_simulation
from demo.attack_privesc import run_privesc_attack_simulation
from sensor.attacks.ransomware import generate_ransomware_events
import httpx

def main():
    parser = argparse.ArgumentParser(description="Cyra Sentinel Hackathon Demo Script")
    parser.add_argument("--attack", choices=["ddos", "privesc", "ransomware", "all"], default="all", help="Attack simulation type")
    parser.add_argument("--url", default="http://localhost:8000/api/v1/telemetry/ingest", help="Backend ingestion endpoint URL")
    args = parser.parse_args()

    print("==========================================================")
    print(" [CYRA SENTINEL] AUTONOMOUS AI SOC AGENT DEMO RUNNER")
    print("==========================================================")

    if args.attack in ["ddos", "all"]:
        print("\n--> [1/3] Triggering Volumetric DDoS Simulation...")
        run_ddos_attack_simulation(args.url)

    if args.attack in ["privesc", "all"]:
        print("\n--> [2/3] Triggering Privilege Escalation (Mimikatz) Simulation...")
        run_privesc_attack_simulation(args.url)

    if args.attack in ["ransomware", "all"]:
        print("\n--> [3/3] Triggering Ransomware (vssadmin erasure) Simulation...")
        events = [e.model_dump() if hasattr(e, "model_dump") else e.dict() for e in generate_ransomware_events("DEV-DB-SRV-02")]
        try:
            resp = httpx.post(args.url, json=events, timeout=10.0)
            print(f"[DEMO] Server Response: {resp.status_code} - {resp.json()}")
        except Exception as e:
            print(f"[DEMO] Simulation failed: {e}")

    print("\n[SUCCESS] Demo simulation complete! Open the UI dashboard at http://localhost:5173 to view AI reasoning.")

if __name__ == "__main__":
    main()
