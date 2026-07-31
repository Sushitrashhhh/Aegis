import os
import json
import numpy as np
import logging
from typing import List

logger = logging.getLogger("cyra_sentinel.ai.embeddings")

class TitanEmbeddings:
    """Bedrock Titan Embeddings generator with deterministic hash/vector fallback."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.model_id = os.getenv("TITAN_EMBEDDING_MODEL_ID", "amazon.titan-embed-text-v1")
        self.client = None

        try:
            import boto3
            if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
                self.client = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=self.region
                )
        except Exception:
            pass

    def get_embedding(self, text: str) -> List[float]:
        """Generate 1536-dim embedding vector."""
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
                logger.warning(f"Titan embedding failed: {e}. Using local embedding fallback.")

        # Deterministic pseudo-embedding (1536 dimensions) for fallback/demo
        np.random.seed(abs(hash(text)) % (2**32))
        vec = np.random.randn(1536)
        norm = np.linalg.norm(vec)
        return (vec / norm).tolist()
