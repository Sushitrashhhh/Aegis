from ai.titan_embeddings import TitanEmbeddings
from ai.vector_search import VectorSearchStore
from ai.reasoning import ai_engine
from tools.query_device_history import query_device_history

def test_titan_embeddings_dimensions():
    titan = TitanEmbeddings()
    emb = titan.get_embedding("DDoS attack simulation")
    assert len(emb) in [1536, 3072]

def test_vector_search_store():
    store = VectorSearchStore()
    emb1 = [1.0] + [0.0] * 1535
    emb2 = [0.9] + [0.1] * 1535
    store.add_vector("item1", emb1, {"title": "DDoS Alert"})
    store.add_vector("item2", emb2, {"title": "Port Scan"})
    
    results = store.search(emb1, top_k=1)
    assert len(results) == 1
    assert results[0]["id"] == "item1"

def test_device_history_tool():
    dev = query_device_history("DEV-FIN-WKS-04")
    assert dev["name"] == "finance-laptop-04"
    assert dev["criticality"] == "MEDIUM"

def test_ai_reasoning_engine():
    alert = {
        "incident_id": "TEST-INC-001",
        "device_id": "DEV-FIN-WKS-04",
        "attack_type": "Privilege Escalation",
        "severity": "CRITICAL",
        "rule_id": "RULE-SEC-002",
        "details": {"command_line": "mimikatz.exe"}
    }
    analysis = ai_engine.analyze_incident(alert)
    assert analysis["incident_id"] == "TEST-INC-001"
    assert analysis["isolation_executed"] is True
