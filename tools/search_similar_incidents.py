from typing import List, Dict, Any
from ai.memory import global_agent_memory

def search_similar_incidents(query: str) -> List[Dict[str, Any]]:
    """Search vector agent memory for similar historical security threats and resolution paths."""
    results = global_agent_memory.search_similar_threats(query, top_k=2)
    formatted = []
    for r in results:
        payload = r.get("payload", {})
        formatted.append({
            "id": payload.get("id"),
            "similarity_score": round(float(r.get("score", 0.0)), 3),
            "threat_type": payload.get("type"),
            "summary": payload.get("text"),
            "recommended_action": payload.get("recommended_action")
        })
    return formatted
