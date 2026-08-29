import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Zap, ExternalLink, Activity, Terminal, Shield, RefreshCw } from 'lucide-react';
import { fetchIncidents, fetchDevices, isolateDevice, Incident, Device, updateIncidentStatus } from '../api/client';
import { CyberPipelineVisualizer } from '../components/CyberPipelineVisualizer';
import { MetricsGrid } from '../components/MetricsGrid';
import { IncidentStream } from '../components/IncidentStream';
import { AgentReasoning } from '../components/AgentReasoning';
import { ProcessTree } from '../components/ProcessTree';
import { SimilarThreats } from '../components/SimilarThreats';
import { ChatWindow } from '../components/ChatWindow';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ScoreBadge } from '../components/ScoreBadge';
import { useToast } from '../components/ui/Toast';

interface DashboardProps {
  onOpenSimulate?: () => void;
  onOpenFleet?: () => void;
  lastWsEvent?: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenSimulate,
  onOpenFleet,
  lastWsEvent
}) => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [isolating, setIsolating] = useState(false);
  const [activeTab, setActiveTab] = useState<'forensics' | 'chat'>('forensics');

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [incData, devData] = await Promise.all([
        fetchIncidents(),
        fetchDevices()
      ]);
      setIncidents(incData);
      setDevices(devData);

      // Keep selection or default to first incident
      setSelectedIncident(prev => {
        if (!prev && incData.length > 0) return incData[0];
        if (prev) {
          const updated = incData.find(i => i.id === prev.id);
          return updated || (incData.length > 0 ? incData[0] : null);
        }
        return null;
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // React to incoming live WebSocket events
  useEffect(() => {
    if (lastWsEvent) {
      loadData(true);
    }
  }, [lastWsEvent, loadData]);

  const handleIsolateHost = async (deviceId: string) => {
    setIsolating(true);
    try {
      await isolateDevice(deviceId, 'Manual containment command issued from SOC Dashboard');
      toast({
        type: 'danger',
        title: 'Host Quarantined',
        message: `Endpoint ${deviceId} has been placed in network isolation.`
      });
      await loadData(true);
    } catch (err: any) {
      toast({
        type: 'danger',
        title: 'Containment Failed',
        message: err?.message || 'Could not communicate with host sensor.'
      });
    } finally {
      setIsolating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedIncident) return;
    try {
      await updateIncidentStatus(selectedIncident.id, newStatus);
      toast({
        type: 'success',
        title: 'Status Updated',
        message: `Incident ${selectedIncident.id} updated to ${newStatus}.`
      });
      await loadData(true);
    } catch (err: any) {
      toast({
        type: 'danger',
        title: 'Update Error',
        message: err?.message || 'Failed to update incident status.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 5-Stage Architectural Pipeline */}
      <CyberPipelineVisualizer activeStage={selectedIncident ? 'containment' : 'sensor'} />

      {/* Real-Time Metrics Grid */}
      <MetricsGrid incidents={incidents} devices={devices} />

      {/* Main SOC Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Incident Stream (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <IncidentStream
            incidents={incidents}
            selectedIncidentId={selectedIncident?.id}
            onSelectIncident={setSelectedIncident}
            onOpenSimulate={onOpenSimulate}
          />
        </div>

        {/* Right Column: AI Investigation Workspace (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedIncident ? (
            <>
              {/* Incident Master Banner */}
              <Card spotlight className="p-5 bg-gradient-to-br from-[#0B0F17] to-[#07090E] border-[rgba(255,255,255,0.09)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" size="sm" dot>
                        {selectedIncident.attack_type?.toUpperCase() || 'SECURITY ALERT'}
                      </Badge>
                      <span className="font-mono text-xs text-[#66707C]">//</span>
                      <span className="font-mono text-xs font-bold text-[#F5A900]">
                        INCIDENT {selectedIncident.id}
                      </span>
                    </div>

                    <h1 className="text-base sm:text-lg font-sans font-bold text-[#E6E9ED] leading-snug">
                      {selectedIncident.title}
                    </h1>

                    <p className="text-xs text-[#9AA3AD] font-sans line-clamp-2 leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <ScoreBadge score={selectedIncident.confidence} label="AI Confidence" />
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/incidents/${selectedIncident.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Deep Dive
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        size="sm"
                        loading={isolating}
                        onClick={() => handleIsolateHost(selectedIncident.device_id)}
                        leftIcon={<Zap className="w-3.5 h-3.5" />}
                      >
                        Isolate Subnet
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metadata details strip */}
                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#66707C] block text-[10px]">HOST ID</span>
                    <span className="text-[#E6E9ED] font-semibold">{selectedIncident.device_id}</span>
                  </div>
                  <div>
                    <span className="text-[#66707C] block text-[10px]">TIMESTAMP</span>
                    <span className="text-[#E6E9ED]">
                      {new Date(selectedIncident.timestamp || selectedIncident.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66707C] block text-[10px]">CURRENT STATUS</span>
                    <span className="text-[#F5A900] font-semibold">{selectedIncident.status}</span>
                  </div>
                  <div>
                    <span className="text-[#66707C] block text-[10px]">SEVERITY LEVEL</span>
                    <span className="text-[#FF4D5A] font-semibold uppercase">{selectedIncident.severity}</span>
                  </div>
                </div>
              </Card>

              {/* Bedrock AI Reasoning Engine Report */}
              <AgentReasoning
                reasoning={selectedIncident.ai_reasoning}
                currentStatus={selectedIncident.status}
                onStatusChange={handleStatusChange}
              />

              {/* Tab selector for Forensics vs Embedded Copilot Console */}
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('forensics')}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                      activeTab === 'forensics'
                        ? 'bg-[#131A26] text-[#F5A900] border border-[#F5A900]/30'
                        : 'text-[#9AA3AD] hover:text-[#E6E9ED]'
                    }`}
                  >
                    FORENSIC TELEMETRY & VECTOR MEMORY
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors flex items-center gap-1.5 ${
                      activeTab === 'chat'
                        ? 'bg-[#131A26] text-[#F5A900] border border-[#F5A900]/30'
                        : 'text-[#9AA3AD] hover:text-[#E6E9ED]'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>INTERACTIVE COPILOT CONSOLE</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'forensics' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProcessTree deviceInfo={selectedIncident.ai_reasoning?.device_info} />
                  <SimilarThreats threats={selectedIncident.ai_reasoning?.similar_threats || []} />
                </div>
              ) : (
                <ChatWindow incidentId={selectedIncident.id} />
              )}
            </>
          ) : (
            <Card className="p-12 text-center bg-[#0B0F17]/80 border-[rgba(255,255,255,0.08)]">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F5A900]/10 border border-[#F5A900]/30 flex items-center justify-center text-[#F5A900]">
                  <Shield className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-mono text-sm font-bold text-[#E6E9ED] tracking-wider">
                  AUTONOMOUS SENTINEL STANDBY
                </h3>
                <p className="text-xs text-[#9AA3AD] font-sans leading-relaxed">
                  No incident currently selected. Select any threat from the live stream or trigger a simulated attack scenario to observe real-time AI reasoning.
                </p>
                {onOpenSimulate && (
                  <Button
                    variant="neon"
                    size="md"
                    onClick={onOpenSimulate}
                    className="mx-auto"
                  >
                    Launch Attack Simulator
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

