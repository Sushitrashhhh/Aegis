import os
import json
import sqlite3
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("cyra_sentinel.database.db")

def get_db_connection():
    db_url = os.getenv("DATABASE_URL", "sqlite:///./cyra_sentinel.db")
    if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
        try:
            import psycopg2
            import psycopg2.extras
            conn = psycopg2.connect(db_url, cursor_factory=psycopg2.extras.DictCursor)
            return conn
        except Exception as e:
            logger.warning(f"CockroachDB connection failed ({e}). Falling back to SQLite.")

    db_path = db_url.replace("sqlite:///", "")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def _execute_query(query: str, params: tuple = (), fetch_one: bool = False, fetch_all: bool = False, commit: bool = False):
    conn = get_db_connection()
    is_postgres = hasattr(conn, "status") # psycopg2 connection indicator
    
    if is_postgres:
        query = query.replace("?", "%s").replace("INSERT OR REPLACE", "INSERT")
        if "INSERT INTO devices" in query or "INSERT INTO incidents" in query:
            query += " ON CONFLICT DO UPDATE SET status = EXCLUDED.status"

    cursor = conn.cursor()
    try:
        cursor.execute(query, params)
        if commit:
            conn.commit()
        
        result = None
        if fetch_one:
            row = cursor.fetchone()
            result = dict(row) if row else None
        elif fetch_all:
            rows = cursor.fetchall()
            result = [dict(r) for r in rows]
            
        return result
    except Exception as e:
        logger.error(f"Database query failed: {e}")
        if commit:
            conn.rollback()
        raise e
    finally:
        conn.close()

def init_db():
    conn = get_db_connection()
    is_postgres = hasattr(conn, "status")
    cursor = conn.cursor()
    
    if is_postgres:
        schema_sql = """
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
        """
        cursor.execute(schema_sql)
    else:
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
    _execute_query("""
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
    ), commit=True)

def get_incidents(limit: int = 50) -> List[Dict[str, Any]]:
    rows = _execute_query("SELECT * FROM incidents ORDER BY created_at DESC LIMIT ?", (limit,), fetch_all=True) or []
    for item in rows:
        if item.get("ai_reasoning"):
            try:
                if isinstance(item["ai_reasoning"], str):
                    item["ai_reasoning"] = json.loads(item["ai_reasoning"])
            except Exception:
                pass
    return rows

def get_incident_by_id(incident_id: str) -> Optional[Dict[str, Any]]:
    item = _execute_query("SELECT * FROM incidents WHERE id = ?", (incident_id,), fetch_one=True)
    if not item:
        return None
    if item.get("ai_reasoning") and isinstance(item["ai_reasoning"], str):
        try:
            item["ai_reasoning"] = json.loads(item["ai_reasoning"])
        except Exception:
            pass
    return item

def update_incident_status(incident_id: str, status: str):
    _execute_query("UPDATE incidents SET status = ? WHERE id = ?", (status, incident_id), commit=True)

def get_devices() -> List[Dict[str, Any]]:
    return _execute_query("SELECT * FROM devices", fetch_all=True) or []

def update_device_status(device_id: str, status: str):
    _execute_query("UPDATE devices SET status = ? WHERE device_id = ?", (status, device_id), commit=True)
