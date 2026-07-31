from typing import Dict, Any

def query_device_history(device_id: str) -> Dict[str, Any]:
    """Retrieve historical risk profile and active processes for a device."""
    devices_db = {
        "DEV-PROD-SRV-01": {
            "device_id": "DEV-PROD-SRV-01",
            "name": "prod-web-server-01",
            "ip_address": "10.0.0.1",
            "owner": "Infrastructure Team",
            "os": "Ubuntu 22.04 LTS",
            "criticality": "HIGH",
            "past_incidents_30d": 1,
            "active_processes": ["nginx (pid: 1204)", "systemd (pid: 1)", "sshd (pid: 882)"]
        },
        "DEV-FIN-WKS-04": {
            "device_id": "DEV-FIN-WKS-04",
            "name": "finance-laptop-04",
            "ip_address": "192.168.1.104",
            "owner": "John Doe (Finance Analyst)",
            "os": "Windows 11 Pro",
            "criticality": "MEDIUM",
            "past_incidents_30d": 0,
            "active_processes": ["explorer.exe (pid: 3012)", "cmd.exe (pid: 4092)", "mimikatz.exe (pid: 5120)"]
        },
        "DEV-DB-SRV-02": {
            "device_id": "DEV-DB-SRV-02",
            "name": "db-cluster-node-02",
            "ip_address": "10.0.2.15",
            "owner": "Database Operations",
            "os": "Windows Server 2022",
            "criticality": "CRITICAL",
            "past_incidents_30d": 2,
            "active_processes": ["sqlservr.exe (pid: 1040)", "powershell.exe (pid: 8010)", "vssadmin.exe (pid: 8812)"]
        }
    }
    return devices_db.get(device_id, {
        "device_id": device_id,
        "name": "unknown-host",
        "ip_address": "127.0.0.1",
        "owner": "Unknown",
        "os": "Linux/Windows Generic",
        "criticality": "MEDIUM",
        "past_incidents_30d": 0,
        "active_processes": []
    })
