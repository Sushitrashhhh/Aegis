import os
import json
import sqlite3
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("cyra_sentinel.database.db")

DB_PATH = os.getenv("DATABASE_URL", "sqlite:///./cyra_sentinel.db").replace("sqlite:///", "")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    schema_sql = """
    CREATE TABLE IF NOT EXISTS devices (
        device_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        owner TEXT NOT NULL,
        os TEXT NOT NULL,
        criticality TEXT NOT NULL DEFAULT 'MEDIUM',
        status TEXT NOT NULL DEFAULT 'HEALTHY',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        device_id TEXT,
        title TEXT NOT NULL,
        attack_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'OPEN',
        confidence REAL NOT NULL DEFAULT 0.9,
        description TEXT,
        ai_reasoning TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_memory (
        id TEXT PRIMARY KEY,
        incident_id TEXT,
        threat_type TEXT NOT NULL,
        summary TEXT NOT NULL,
        action_taken TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    cursor.executescript(schema_sql)
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully.")

def save_incident(incident: Dict[str, Any]):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO incidents (id, device_id, title, attack_type, severity, status, confidence, description, ai_reasoning)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        incident.get("id"),
        incident.get("device_id"),
        incident.get("title"),
        incident.get("attack_type"),
        incident.get("severity"),
        incident.get("status", "OPEN"),
        incident.get("confidence", 0.95),
        incident.get("description"),
        json.dumps(incident.get("ai_reasoning", {}))
    ))
    conn.commit()
    conn.close()

def get_incidents(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        item = dict(r)
        if item.get("ai_reasoning"):
            try:
                item["ai_reasoning"] = json.loads(item["ai_reasoning"])
            except Exception:
                pass
        result.append(item)
    return result

def get_incident_by_id(incident_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    item = dict(row)
    if item.get("ai_reasoning"):
        try:
            item["ai_reasoning"] = json.loads(item["ai_reasoning"])
        except Exception:
            pass
    return item

def update_incident_status(incident_id: str, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE incidents SET status = ? WHERE id = ?", (status, incident_id))
    conn.commit()
    conn.close()

def get_devices() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_device_status(device_id: str, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE devices SET status = ? WHERE device_id = ?", (status, device_id))
    conn.commit()
    conn.close()
