def get_demo_historical_telemetry():
    return [
        {"device_id": "DEV-PROD-SRV-01", "event": "HTTP GET /api/v1/health", "timestamp": "10:00:00"},
        {"device_id": "DEV-PROD-SRV-01", "event": "Network spike 850MB/s", "timestamp": "10:05:22"},
        {"device_id": "DEV-FIN-WKS-04", "event": "user jdoe logged in via RDP", "timestamp": "09:30:10"},
        {"device_id": "DEV-FIN-WKS-04", "event": "mimikatz.exe privilege::debug", "timestamp": "09:45:00"}
    ]
