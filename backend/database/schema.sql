-- Unified Schema for CockroachDB / PostgreSQL / SQLite

CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    owner VARCHAR(128) NOT NULL,
    os VARCHAR(64) NOT NULL,
    criticality VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(32) NOT NULL DEFAULT 'HEALTHY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(64),
    title VARCHAR(256) NOT NULL,
    attack_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    confidence FLOAT NOT NULL DEFAULT 0.9,
    description TEXT,
    ai_reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_memory (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64),
    threat_type VARCHAR(64) NOT NULL,
    summary TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
