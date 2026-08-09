import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Activity, Zap, RefreshCw, Radio } from 'lucide-react';
import { fetchIncidents, fetchDevices, isolateDevice } from '../api/client';
import { IncidentCard } from '../components/IncidentCard';
import { AgentReasoning } from '../components/AgentReasoning';
import { SimilarThreats } from '../components/SimilarThreats';
import { ProcessTree } from '../components/ProcessTree';

export const Dashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const incData = await fetchIncidents();
      const devData = await fetchDevices();
      setIncidents(incData);
      setDevices(devData);
      if (incData.length > 0 && !selectedIncident) {
        setSelectedIncident(incData[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIsolate = async (deviceId: string) => {
    try {
      await isolateDevice(deviceId, 'Manual containment from dashboard');
      await loadData();
    } catch (err) {
      alert('Failed to isolate device');
    }
  };

  return (
    <div className="space-y-5">
      {/* Compact Operational Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[#66707C] uppercase tracking-wider">ACTIVE INCIDENTS</div>
            <div className="text-xl font-mono font-bold tabular-nums text-[#E6E9ED]">{incidents.length}</div>
          </div>
          <ShieldAlert className="w-5 h-5 text-[#FF4D5A]" />
        </div>

        <div className="p-3 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[#66707C] uppercase tracking-wider">ENDPOINTS MONITORED</div>
            <div className="text-xl font-mono font-bold tabular-nums text-[#E6E9ED]">{devices.length}</div>
          </div>
          <Cpu className="w-5 h-5 text-[#9AA3AD]" />
        </div>

        <div className="p-3 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[#66707C] uppercase tracking-wider">CONTAINED NODES</div>
            <div className="text-xl font-mono font-bold tabular-nums text-[#36C98F]">
              {devices.filter(d => d.status === 'ISOLATED').length}
            </div>
          </div>
          <Zap className="w-5 h-5 text-[#36C98F]" />
        </div>

        <div className="p-3 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono text-[#66707C] uppercase tracking-wider">AGENT PIPELINE</div>
            <div className="text-sm font-mono font-bold text-[#F5A900] tracking-wide">AUTONOMOUS</div>
          </div>
          <Activity className="w-5 h-5 text-[#F5A900]" />
        </div>
      </div>

      {/* Main Operational Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Live Incident Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6E9ED] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#F5A900]" />
              <span>REAL-TIME INCIDENT STREAM</span>
            </h2>
            <button
              onClick={loadData}
              title="Refresh Stream"
              aria-label="Refresh Stream"
              className="p-1 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] text-[#66707C] hover:text-[#E6E9ED] transition-colors focus-visible:outline-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F5A900]' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {incidents.length > 0 ? (
              incidents.map((inc) => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  isSelected={selectedIncident?.id === inc.id}
                  onClick={() => setSelectedIncident(inc)}
                />
              ))
            ) : (
              <div className="p-6 text-left bg-[#0D1117] border border-[rgba(255,255,255,0.08)] rounded text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#36C98F] font-mono font-semibold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>LIVE TELEMETRY // SENSOR CONNECTED</span>
                </div>
                <p className="text-[#9AA3AD] font-sans">
                  No active threats detected. System is listening to sensor event telemetry. Run a simulation script to trigger live AI investigation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Investigation Workspace */}
        <div className="lg:col-span-2 space-y-5">
          {selectedIncident ? (
            <>
              {/* Selected Incident Header Card */}
              <div className="p-4 bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-[#F5A900] font-semibold">
                    INCIDENT {selectedIncident.id} // {selectedIncident.attack_type?.toUpperCase()}
                  </div>
                  <h1 className="text-sm font-sans font-semibold text-[#E6E9ED]">
                    {selectedIncident.title}
                  </h1>
                </div>
                <button
                  onClick={() => handleIsolate(selectedIncident.device_id)}
                  className="px-3 py-1.5 rounded bg-[#FF4D5A]/10 border border-[#FF4D5A]/40 text-[#FF4D5A] hover:bg-[#FF4D5A]/20 text-xs font-mono font-semibold transition-colors focus-visible:outline-none flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>ISOLATE HOST SUBNET</span>
                </button>
              </div>

              {/* Agent Reasoning Log */}
              <AgentReasoning reasoning={selectedIncident.ai_reasoning} />

              {/* Grid: Process Tree & Vector Matches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProcessTree deviceInfo={selectedIncident.ai_reasoning?.device_info} />
                <SimilarThreats threats={selectedIncident.ai_reasoning?.similar_threats || []} />
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#66707C] bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] font-mono text-xs uppercase tracking-wider">
              SELECT AN INCIDENT FROM THE STREAM TO INSPECT INVESTIGATION LOGS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
