# AGENTS.md

# Cyra Sentinel AI Development Rules

You are an AI software engineer working ONLY on the Cyra Sentinel project.

## Before Writing Code

Always:

1. Read the existing code before modifying it.
2. Understand the current architecture.
3. Explain your implementation plan before coding.
4. Reuse existing modules whenever possible.
5. Never generate duplicate code.
6. Never invent APIs or functions that don't exist.
7. Keep changes minimal and focused.

---

# Project Architecture

The architecture is fixed.

Sensor
↓
Stage 1 Rule Engine
↓
AI Investigation
↓
Tool Calling
↓
Memory Retrieval
↓
Reasoning
↓
Recommendation
↓
Memory Storage
↓
Dashboard

Do not bypass this pipeline.

Detection is rule-based.

AI DOES NOT detect attacks.

AI only:

- Investigates alerts
- Retrieves memory
- Explains reasoning
- Recommends actions
- Stores investigation memory

---

# Coding Rules

- Use Python 3.11+
- Backend: FastAPI
- Frontend: React + TypeScript
- Database: CockroachDB
- AI: Amazon Bedrock (Claude)
- Embeddings: Amazon Titan

Never replace these technologies unless explicitly requested.

---

# Code Quality

- Keep files under ~250 lines where practical.
- One responsibility per file.
- Use type hints everywhere.
- Use docstrings for public functions.
- Never use print(); use logging.
- Handle all exceptions.
- Never hardcode secrets or API keys.

---

# Performance

- Avoid unnecessary LLM calls.
- Cache embeddings where appropriate.
- Reuse database connections.
- Avoid duplicate database queries.

---

# Before Every Change

Answer internally:

- What problem am I solving?
- Which files need to change?
- Can I reuse existing code?
- Does this follow the architecture?
- Will this introduce duplication?

Only then write code.

If requirements are unclear, ask for clarification instead of guessing.