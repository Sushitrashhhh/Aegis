from tools.query_device_history import query_device_history
from tools.search_similar_incidents import search_similar_incidents
from tools.explain_detection import explain_detection
from tools.recommend_action import recommend_action
from tools.isolate_device import isolate_device
from tools.remember_incident import remember_incident

TOOL_DEFINITIONS = [
    {
        "name": "query_device_history",
        "description": "Get risk profile and active processes of a target device.",
        "input_schema": {
            "type": "object",
            "properties": {"device_id": {"type": "string"}},
            "required": ["device_id"]
        }
    },
    {
        "name": "search_similar_incidents",
        "description": "Query Titan vector memory for similar historical security threats.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"]
        }
    },
    {
        "name": "isolate_device",
        "description": "Isolate host from subnet dynamically.",
        "input_schema": {
            "type": "object",
            "properties": {
                "device_id": {"type": "string"},
                "reason": {"type": "string"}
            },
            "required": ["device_id", "reason"]
        }
    }
]
