CREATE TABLE IF NOT EXISTS agent_memory (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64),
    threat_type VARCHAR(64) NOT NULL,
    summary TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    embedding_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
