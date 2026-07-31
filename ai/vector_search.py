import numpy as np
from typing import List, Dict, Any

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    a = np.array(vec1)
    b = np.array(vec2)
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))

class VectorSearchStore:
    """In-memory cosine similarity vector search store for threat patterns and past incidents."""

    def __init__(self):
        self.vectors: List[Dict[str, Any]] = []

    def add_vector(self, item_id: str, embedding: List[float], payload: Dict[str, Any]):
        self.vectors.append({
            "id": item_id,
            "embedding": embedding,
            "payload": payload
        })

    def search(self, query_vector: List[float], top_k: int = 3) -> List[Dict[str, Any]]:
        results = []
        for v in self.vectors:
            score = cosine_similarity(query_vector, v["embedding"])
            results.append({
                "id": v["id"],
                "score": score,
                "payload": v["payload"]
            })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
