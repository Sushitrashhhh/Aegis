# Cyra Sentinel Architecture Spec

Cyra Sentinel is designed for 3-minute hackathon demonstration while offering an end-to-end autonomous threat response loop.

## Core Modules
1. **Sensor & Telemetry Layer (`sensor/`)**: eBPF/Network event simulation emitting structured JSON telemetry.
2. **Stage 1 Detection Engine (`sensor/rules.py`)**: High-throughput rule filtering identifying threat signatures and anomalies.
3. **AI Pipeline & Bedrock Claude Agent (`ai/`, `backend/agents/`)**: Multimodal LLM reasoning engine executing tool calls for device history, vector similarity search, and automated host containment.
4. **Vector Agent Memory (`ai/memory.py`)**: Persistent vector memory indexing attack indicators and remediation strategies via Amazon Bedrock Titan embeddings.
5. **FastAPI Backend (`backend/`)**: REST APIs, database persistence (CockroachDB / SQLite), and real-time WebSocket broadcasting.
6. **React Dashboard (`ui/`)**: Cyberpunk security dashboard visualizing process execution trees, agent reasoning logs, confidence scores, and containment controls.
