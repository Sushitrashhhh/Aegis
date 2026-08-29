import os
import json
import numpy as np
import logging
import urllib.request
import urllib.error
from typing import List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("cyra_sentinel.ai.embeddings")

class TitanEmbeddings:
    """Vector Embeddings generator with support for Amazon Titan, Google Gemini Free Tier, and deterministic fallback."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.model_id = os.getenv("TITAN_EMBEDDING_MODEL_ID", "amazon.titan-embed-text-v1")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
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
            except Exception:
                pass

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding vector via AWS Titan, Google Gemini, or local fallback."""
        # 1. Try AWS Titan if AWS keys are provided
        if self.client:
            try:
                body = json.dumps({"inputText": text})
                response = self.client.invoke_model(
                    modelId=self.model_id,
                    contentType="application/json",
                    accept="application/json",
                    body=body
                )
                response_body = json.loads(response.get("body").read())
                return response_body.get("embedding")
            except Exception as e:
                logger.warning(f"Titan embedding failed: {e}")

        # 2. Try Google Gemini Free Tier embeddings
        if self.gemini_api_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={self.gemini_api_key}"
                data = json.dumps({
                    "model": "models/gemini-embedding-001",
                    "content": {"parts": [{"text": text[:2048]}]}
                }).encode("utf-8")
                req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=25) as resp:
                    res = json.loads(resp.read().decode("utf-8"))
                    return res["embedding"]["values"]
            except Exception as e:
                logger.warning(f"Gemini embedding failed: {e}")

        # 3. Deterministic pseudo-embedding for fallback/offline
        np.random.seed(abs(hash(text)) % (2**32))
        vec = np.random.randn(1536)
        norm = np.linalg.norm(vec)
        return (vec / norm).tolist()
