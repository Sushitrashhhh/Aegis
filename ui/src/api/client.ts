const API_BASE = '/api/v1';

export interface Device {
  device_id: string;
  name: string;
  ip_address: string;
  owner: string;
  os: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'HEALTHY' | 'ISOLATED' | 'COMPROMISED' | string;
  created_at?: string;
}

export interface Incident {
  id: string;
  device_id: string;
  title: string;
  attack_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'FALSE_POSITIVE' | string;
  confidence: number;
  description: string;
  timestamp?: string;
  created_at?: string;
  ai_reasoning?: {
    incident_id?: string;
    agent_verdict?: string;
    explanation?: string;
    device_info?: any;
    similar_threats?: Array<{
      id?: string;
      threat_type?: string;
      similarity_score: number;
      summary: string;
      recommended_action?: string;
    }>;
    recommended_action?: {
      recommended_action: string;
      steps?: string[];
    };
    isolation_executed?: boolean;
    memory_persisted?: {
      status?: string;
      id?: string;
      message?: string;
    };
  };
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchIncidentById(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch incident ${id}`);
  return res.json();
}

export async function updateIncidentStatus(incidentId: string, status: string) {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update incident status');
  return res.json();
}

export async function fetchDevices(): Promise<Device[]> {
  const res = await fetch(`${API_BASE}/devices`);
  if (!res.ok) throw new Error('Failed to fetch devices');
  return res.json();
}

export async function isolateDevice(deviceId: string, reason: string = 'Manual analyst containment') {
  const res = await fetch(`${API_BASE}/devices/${deviceId}/isolate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) throw new Error(`Failed to isolate device ${deviceId}`);
  return res.json();
}

export async function sendAgentMessage(message: string, incidentId?: string) {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, incident_id: incidentId })
  });
  if (!res.ok) throw new Error('Failed to communicate with Cyra Agent');
  return res.json();
}

export async function ingestTelemetry(events: any[]) {
  const res = await fetch(`${API_BASE}/telemetry/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  });
  if (!res.ok) throw new Error('Failed to ingest telemetry');
  return res.json();
}

export async function simulateAttack(type: 'ddos' | 'privesc' | 'ransomware') {
  const now = new Date().toISOString();
  let events: any[] = [];

  if (type === 'ddos') {
    events = [
      {
        timestamp: now,
        device_id: 'DEV-PROD-SRV-01',
        device_name: 'prod-web-server-01',
        event_type: 'network_traffic',
        port: 443,
        network_bytes_sec: 98500000.0,
        details: { packet_rate: 18500, syn_flood_detected: true, target_service: 'HTTPS' }
      }
    ];
  } else if (type === 'privesc') {
    events = [
      {
        timestamp: now,
        device_id: 'DEV-FIN-WKS-04',
        device_name: 'finance-laptop-04',
        event_type: 'process_execution',
        process_name: 'mimikatz.exe',
        process_id: 4892,
        parent_process: 'cmd.exe',
        user: 'NT AUTHORITY\\SYSTEM',
        command_line: 'mimikatz.exe privilege::debug sekurlsa::logonpasswords',
        details: { credential_access: true, dumped_process: 'lsass.exe' }
      }
    ];
  } else if (type === 'ransomware') {
    events = [
      {
        timestamp: now,
        device_id: 'DEV-DB-SRV-02',
        device_name: 'db-cluster-node-02',
        event_type: 'process_execution',
        process_name: 'vssadmin.exe',
        process_id: 8812,
        parent_process: 'powershell.exe',
        user: 'NT AUTHORITY\\SYSTEM',
        command_line: 'vssadmin delete shadows /all /quiet',
        details: { shadow_copy_deleted: true }
      },
      {
        timestamp: now,
        device_id: 'DEV-DB-SRV-02',
        device_name: 'db-cluster-node-02',
        event_type: 'file_modification',
        process_name: 'encrypter.exe',
        process_id: 9012,
        parent_process: 'powershell.exe',
        user: 'NT AUTHORITY\\SYSTEM',
        file_path: 'C:\\Data\\FinancialRecords.db.locked',
        command_line: 'encrypter.exe --dir C:\\Data --key x8f9a2',
        details: { files_modified_count: 520, entropy: 7.98 }
      }
    ];
  }

  return ingestTelemetry(events);
}

