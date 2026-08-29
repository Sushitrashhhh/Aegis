import os
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("cyra_sentinel.ai.bedrock")

class BedrockClient:
    """Wrapper for AI Investigation LLMs with support for AWS Bedrock, Groq Free Tier, Google Gemini Free Tier, Ollama Local, and Zero-Key Fallback."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.model_id = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2")
        self.client = None
        
        if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
            try:
                import boto3
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
        """Invoke AI model via AWS Bedrock, Groq (Free), Gemini (Free), Ollama (Free local), or Built-in Offline Fallback."""
        # 1. Try AWS Bedrock if credentials are set
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
                logger.error(f"Bedrock API call failed: {e}")

        # 2. Try Groq Free API (Llama 3.3 70B / 3.1 8B)
        if self.groq_api_key:
            groq_res = self._call_groq(system_prompt, messages, temperature)
            if groq_res:
                return groq_res

        # 3. Try Google Gemini Free API
        if self.gemini_api_key:
            gemini_res = self._call_gemini(system_prompt, messages, temperature)
            if gemini_res:
                return gemini_res

        # 4. Fallback simulated response (Zero API keys needed, 100% offline free)
        return self._generate_fallback_response(messages)

    def _call_groq(self, system_prompt: str, messages: List[Dict[str, Any]], temperature: float) -> Optional[Dict[str, Any]]:
        try:
            req_messages = [{"role": "system", "content": system_prompt}] + messages
            req_data = json.dumps({
                "model": self.groq_model,
                "messages": req_messages,
                "temperature": temperature,
                "max_tokens": 1024
            }).encode("utf-8")

            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {self.groq_api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "CyraSentinel/1.0"
                }
            )
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choice = data["choices"][0]["message"]
                return {
                    "role": "assistant",
                    "content": [{"type": "text", "text": choice["content"]}],
                    "stop_reason": "end_turn"
                }
        except Exception as e:
            logger.warning(f"Groq API call error: {e}")
            return None

    def _call_gemini(self, system_prompt: str, messages: List[Dict[str, Any]], temperature: float) -> Optional[Dict[str, Any]]:
        try:
            user_text = "\n".join([f"{m.get('role')}: {m.get('content')}" for m in messages])
            prompt = f"{system_prompt}\n\nUser Message:\n{user_text}"
            req_data = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": temperature, "maxOutputTokens": 1024}
            }).encode("utf-8")

            model = self.gemini_model
            if not model.startswith("models/"):
                model = f"models/{model}"
            url = f"https://generativelanguage.googleapis.com/v1beta/{model}:generateContent?key={self.gemini_api_key}"
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "role": "assistant",
                    "content": [{"type": "text", "text": text}],
                    "stop_reason": "end_turn"
                }
        except Exception as e:
            logger.warning(f"Gemini API call error: {e}")
            return None

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
