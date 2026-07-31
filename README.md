# Cyra Sentinel 🛡️
> Autonomous Threat Detection, AI Investigation & Remediation Platform

Cyra Sentinel is an AI-powered Security Operations Center (SOC) agent designed for high-velocity incident response. It connects real-time telemetry from security sensors to an AI reasoning pipeline powered by AWS Bedrock (Claude) to automatically detect, investigate, remember, and remediate cybersecurity threats.

---

## 🚀 Key Workflow: Detect → Investigate → Remember → Act

1. **Detect (Sensor & Stage 1 Rules)**: Streams real-time system/network events (DDoS, Privilege Escalation, Ransomware) and evaluates heuristics & signature rules.
2. **Investigate (Claude AI Agent & Tools)**: Bedrock-powered AI agent inspects device history, correlates process trees, and checks similar historical threat vectors via vector search embeddings.
3. **Remember (Agent Vector Memory)**: Stores incident summaries, root causes, and analyst notes in vector memory for future pattern recognition.
4. **Act (Autonomous Actions)**: Recommends & executes automated isolation actions (device network isolation, process termination, analyst escalation).

---

## 📁 Repository Structure

```text
cyra-sentinel/
├── sensor/                 # Fake/eBPF attack event generator & rules
├── backend/                # FastAPI entrypoint, API routes, websocket & services
├── ai/                     # AWS Bedrock Claude wrapper, embeddings & reasoning
├── tools/                  # Agent tool definitions (Device history, vector search, etc.)
├── database/               # SQL schema definitions & migrations
├── ui/                     # React + Vite + Tailwind Security Dashboard
├── demo/                   # Interactive demo scripts & sample attack events
├── docs/                   # Architecture specs & flow diagrams
└── tests/                  # Unit tests for rules, AI pipeline & backend
```

---

## ⚡ Quick Start

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Seed Database
```bash
python -m backend.database.seed
```

### 4. Run Backend Server
```bash
uvicorn backend.main:app --reload --port 8000
```

### 5. Run UI Dashboard
```bash
cd ui
npm install
npm run dev
```

### 6. Run Attack Demo Simulation
```bash
python -m demo.run_demo --attack ddos
```

---

## 🧪 Running Tests
```bash
pytest tests/
```
