CREATE TABLE IF NOT EXISTS threat_patterns (
    pattern_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    threat_category VARCHAR(64) NOT NULL,
    mitre_tactic VARCHAR(64),
    severity VARCHAR(16) NOT NULL,
    description TEXT
);
