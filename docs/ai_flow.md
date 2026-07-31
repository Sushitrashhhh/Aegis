# Cyra Sentinel AI Workflow

```mermaid
graph TD
    A[Sensor Alert Stream] --> B[Stage 1 Rules]
    B --> C[FastAPI Backend]
    C --> D[AWS Bedrock Claude 3]
    D --> E{Tool Calls}
    E --> F[query_device_history]
    E --> G[search_similar_incidents]
    E --> H[recommend_action]
    E --> I[isolate_device]
    E --> J[remember_incident]
    J --> K[Titan Vector Memory]
    I --> L[CockroachDB Persistence]
    L --> M[React Security Dashboard]
```

## Detect -> Investigate -> Remember -> Act
- **Detect**: Heuristics filter high-rate SYN flood, Mimikatz commands, or vssadmin shadow copy deletion.
- **Investigate**: Bedrock Claude queries process trees, host criticality, and vector search store.
- **Remember**: Persists threat parameters and resolution steps to vector memory for future automatic matching.
- **Act**: Executes host network isolation in <500ms for High/Critical severity threats.
