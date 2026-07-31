import logging
from typing import List, Dict, Any
from ai.titan_embeddings import TitanEmbeddings
from ai.vector_search import VectorSearchStore

logger = logging.getLogger("cyra_sentinel.ai.memory")

class AgentMemoryStore:
    """Agent memory store backing incident knowledge and threat intelligence vectors."""

    def __init__(self):
        self.embeddings = TitanEmbeddings()
        self.vector_store = VectorSearchStore()
        self._seed_initial_threat_memory()

    def _seed_initial_threat_memory(self):
        knowledge_base = [
            {
                "id": "KB-001",
                "text": "DDoS HTTP flood attack targeting port 80/443 with abnormal bandwidth spike exceeding 500MB/s. Mitigation: Rate limiting, IP blacklisting, traffic scrubbing.",
                "type": "DDoS",
                "recommended_action": "Block source IP addresses at firewall perimeter and trigger Cloudflare rate limiting."
            },
            {
                "id": "KB-002",
                "text": "Privilege escalation via LSASS memory dumping using mimikatz or debug privileges. Mitigation: Isolate compromised workstation, terminate parent process, force credential reset.",
                "type": "Privilege Escalation",
                "recommended_action": "Isolate device from network, terminate mimikatz process tree, revoke compromised user access token."
            },
            {
                "id": "KB-003",
                "text": "Ransomware encryption activity paired with vssadmin shadow copy deletion. Mitigation: Immediate host network containment, terminate encrypting process, restore from immutable backup.",
                "type": "Ransomware",
                "recommended_action": "Immediately execute host network isolation, kill process, preserve memory snapshot for forensic analysis."
            }
        ]
        for kb in knowledge_base:
            emb = self.embeddings.get_embedding(kb["text"])
            self.vector_store.add_vector(kb["id"], emb, kb)

    def search_similar_threats(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        emb = self.embeddings.get_embedding(query)
        return self.vector_store.search(emb, top_k=top_k)

    def remember_incident(self, incident_id: str, summary: str, threat_type: str, action_taken: str):
        text = f"Incident {incident_id}: {threat_type} - {summary}. Action taken: {action_taken}"
        emb = self.embeddings.get_embedding(text)
        payload = {
            "id": incident_id,
            "text": text,
            "type": threat_type,
            "recommended_action": action_taken
        }
        self.vector_store.add_vector(incident_id, emb, payload)
        logger.info(f"Stored incident {incident_id} in vector agent memory.")

# Global agent memory instance
global_agent_memory = AgentMemoryStore()
