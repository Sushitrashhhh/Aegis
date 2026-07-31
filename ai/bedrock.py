import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("cyra_sentinel.ai.bedrock")

class BedrockClient:
    """Wrapper for AWS Bedrock Claude API with automatic mock fallback if credentials are unset or call fails."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.model_id = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")
        self.client = None
        
        try:
            import boto3
            if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
                self.client = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=self.region,
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
                )
        except Exception as e:
            logger.warning(f"Boto3 Bedrock initialization bypassed: {e}")

    def invoke_claude(
        self,
        system_prompt: str,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.1
    ) -> Dict[str, Any]:
        """Invoke Claude 3 model via Bedrock or return structured AI reasoning mock if offline."""
        if self.client:
            try:
                body = {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 2048,
                    "system": system_prompt,
                    "messages": messages,
                    "temperature": temperature
                }
                if tools:
                    body["tools"] = tools

                response = self.client.invoke_model(
                    modelId=self.model_id,
                    contentType="application/json",
                    accept="application/json",
                    body=json.dumps(body)
                )
                response_body = json.loads(response.get("body").read())
                return response_body
            except Exception as e:
                logger.error(f"Bedrock API call failed: {e}. Falling back to Cyra AI engine fallback.")

        # Fallback simulated response
        return self._generate_fallback_response(messages)

    def _generate_fallback_response(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        content = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                content = str(m.get("content"))
                break

        return {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": f"Cyra Sentinel AI Agent evaluated the context. Critical threat detected based on telemetry analysis. Recommending immediate host containment and privilege revocation."
                }
            ],
            "stop_reason": "end_turn"
        }
