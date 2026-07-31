from backend.database.db import init_db, get_db_connection, save_incident

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Seed Devices
    devices = [
        ("DEV-PROD-SRV-01", "prod-web-server-01", "10.0.0.1", "Infrastructure Team", "Ubuntu 22.04 LTS", "HIGH", "HEALTHY"),
        ("DEV-FIN-WKS-04", "finance-laptop-04", "192.168.1.104", "John Doe (Finance Analyst)", "Windows 11 Pro", "MEDIUM", "HEALTHY"),
        ("DEV-DB-SRV-02", "db-cluster-node-02", "10.0.2.15", "Database Operations", "Windows Server 2022", "CRITICAL", "HEALTHY")
    ]

    for dev in devices:
        cursor.execute("""
            INSERT OR REPLACE INTO devices (device_id, name, ip_address, owner, os, criticality, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, dev)

    conn.commit()
    conn.close()

    # Seed initial sample incident
    save_incident({
        "id": "INC-8831",
        "device_id": "DEV-FIN-WKS-04",
        "title": "Privilege Escalation via Mimikatz Credential Dumping",
        "attack_type": "Privilege Escalation",
        "severity": "CRITICAL",
        "status": "CONTAINED",
        "confidence": 0.98,
        "description": "Mimikatz detected executing from cmd.exe attempting LSASS process memory dump.",
        "ai_reasoning": {
            "agent_verdict": "Threat Verified: Privilege Escalation. Host isolated.",
            "explanation": "Rule RULE-SEC-002 matched command line 'mimikatz.exe privilege::debug'.",
            "recommended_action": {"recommended_action": "Isolate Host & Revoke User Session"},
            "isolation_executed": True
        }
    })

    print("Database seeded successfully with initial devices and incidents.")

if __name__ == "__main__":
    seed_database()
