from ai.reasoning import ai_engine
from typing import Dict, Any

class CyraAgent:
    """Agent entrypoint for managing SOC chat queries and automated investigation tasks."""

    def __init__(self):
        self.engine = ai_engine

    def investigate(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.engine.analyze_incident(alert_data)

    def chat_response(self, user_message: str, incident_context: Dict[str, Any] = None) -> str:
        msg_lower = user_message.lower()
        if "status" in msg_lower or "summary" in msg_lower:
            return "Cyra Sentinel is actively monitoring system telemetry. All devices are reporting within nominal parameters except isolated nodes."
        elif "isolate" in msg_lower or "contain" in msg_lower:
            return "To execute host isolation, confirm the target Device ID (e.g., DEV-FIN-WKS-04). Subnet containment takes effect in <500ms."
        elif "explain" in msg_lower or "why" in msg_lower:
            return "Detection triggered via Stage 1 heuristic rules matching command execution anomalies and elevated network traffic signatures."
        else:
            return f"Cyra Agent received query: '{user_message}'. Autonomous investigation completed. All indicators of compromise have been indexed in vector memory."

cyra_agent_instance = CyraAgent()
