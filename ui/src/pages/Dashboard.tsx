import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Activity, Play, Zap, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Incidents</div>
            <div className="text-2xl font-bold text-slate-100">{incidents.length}</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-400 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20" />
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Monitored Endpoints</div>
            <div className="text-2xl font-bold text-slate-100">{devices.length}</div>
          </div>
          <Cpu className="w-8 h-8 text-cyan-400 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20" />
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">AI Contained Nodes</div>
            <div className="text-2xl font-bold text-emerald-400">
              {devices.filter(d => d.status === 'ISOLATED').length}
            </div>
          </div>
          <Zap className="w-8 h-8 text-emerald-400 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Autonomous Mode</div>
            <div className="text-2xl font-bold text-cyan-400">ACTIVE</div>
          </div>
          <Activity className="w-8 h-8 text-cyan-400 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 animate-pulse" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Incidents Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Real-Time Incident Stream</span>
            </h2>
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                isSelected={selectedIncident?.id === inc.id}
                onClick={() => setSelectedIncident(inc)}
              />
            ))}
          </div>
        </div>

        {/* Middle & Right Col: Deep AI Investigation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <>
              {/* Selected Incident Header */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-400">{selectedIncident.id} • {selectedIncident.attack_type}</div>
                  <h1 className="text-lg font-bold text-slate-100">{selectedIncident.title}</h1>
                </div>
                <button
                  onClick={() => handleIsolate(selectedIncident.device_id)}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-slate-100 text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-red-950"
                >
                  <Zap className="w-4 h-4" /> Isolate Device Subnet
                </button>
              </div>

              {/* Agent Reasoning */}
              <AgentReasoning reasoning={selectedIncident.ai_reasoning} />

              {/* Grid: Process Tree & Vector Matches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProcessTree deviceInfo={selectedIncident.ai_reasoning?.device_info} />
                <SimilarThreats threats={selectedIncident.ai_reasoning?.similar_threats || []} />
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
              Select an incident from the stream to inspect Bedrock Claude reasoning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
