import logging
from typing import Dict, Any, List
from ai.bedrock import BedrockClient
from tools.query_device_history import query_device_history
from tools.search_similar_incidents import search_similar_incidents
from tools.explain_detection import explain_detection
from tools.recommend_action import recommend_action
from tools.isolate_device import isolate_device
from tools.remember_incident import remember_incident

logger = logging.getLogger("cyra_sentinel.ai.reasoning")

SYSTEM_PROMPT = """You are Cyra Sentinel, an autonomous AI Security Operations Center (SOC) agent.
Your mission is to perform automated threat investigation and response following the workflow:
Detect -> Investigate -> Remember -> Act.

Analyze incoming alert telemetry using available tools:
- query_device_history: Get risk profile and active process tree of target host
- search_similar_incidents: Query vector memory for similar past threat vectors
- explain_detection: Generate clear technical explanation of rule triggers
- recommend_action: Formulate containment & remediation strategy
- isolate_device: Execute automated network containment if threat is HIGH/CRITICAL
- remember_incident: Persist incident findings and remediation into vector memory

Provide concise, highly structured security reasoning."""

class AIReasoningEngine:
    def __init__(self):
        self.bedrock = BedrockClient()

    def analyze_incident(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core AI Investigation pipeline."""
        device_id = alert_data.get("device_id", "UNKNOWN-DEV")
        attack_type = alert_data.get("attack_type", alert_data.get("suggested_type", "Unknown Threat"))
        rule_id = alert_data.get("rule_id", "RULE-GENERIC-000")
        details = alert_data.get("details", {})

        # Step 1: Query device history
        device_info = query_device_history(device_id)

        # Step 2: Search similar incidents in vector memory
        similar_threats = search_similar_incidents(f"{attack_type} {rule_id}")

        # Step 3: Explain detection
        explanation = explain_detection(rule_id, attack_type, details)

        # Step 4: Recommend action
        recommendation = recommend_action(attack_type, device_info.get("criticality", "MEDIUM"))

        # Step 5: Execute action if CRITICAL or HIGH severity
        isolation_result = None
        if alert_data.get("severity") in ["CRITICAL", "HIGH"]:
            isolation_result = isolate_device(device_id, reason=f"Automated AI response to {attack_type}")

        # Step 6: Remember incident in vector memory
        incident_id = alert_data.get("incident_id", "INC-PENDING")
        memory_result = remember_incident(
            incident_id=incident_id,
            summary=f"{attack_type} on {device_id}: {explanation}",
            threat_type=attack_type,
            action_taken=recommendation.get("recommended_action", "Isolated host")
        )

        # Step 7: Construct final agent reasoning narrative
        default_verdict = f"Threat Verified: {attack_type}. Automated containment initiated. Criticality: {device_info.get('criticality')}."
        agent_verdict = default_verdict

        # Live LLM analysis if provider key is configured
        if self.bedrock.client or self.bedrock.gemini_api_key or self.bedrock.groq_api_key:
            try:
                llm_prompt = (
                    f"Incident: {attack_type} on {device_id} ({device_info.get('name')}).\n"
                    f"Rule: {rule_id} | Details: {details}\n"
                    f"Action: {recommendation.get('recommended_action')}\n"
                    f"Write a concise 1-2 sentence SOC verdict and immediate containment rationale."
                )
                res = self.bedrock.invoke_claude(
                    system_prompt=SYSTEM_PROMPT,
                    messages=[{"role": "user", "content": llm_prompt}],
                    temperature=0.1
                )
                if res and res.get("content") and len(res["content"]) > 0:
                    text = res["content"][0].get("text", "").strip()
                    if text:
                        agent_verdict = text
            except Exception as e:
                logger.warning(f"Live LLM verdict note: {e}")

        reasoning_summary = {
            "incident_id": incident_id,
            "device_info": device_info,
            "explanation": explanation,
            "similar_threats": similar_threats,
            "recommended_action": recommendation,
            "isolation_executed": isolation_result is not None,
            "isolation_details": isolation_result,
            "memory_persisted": memory_result,
            "agent_verdict": agent_verdict
        }

        return reasoning_summary

# Global AI engine instance
ai_engine = AIReasoningEngine()
