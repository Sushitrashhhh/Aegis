import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Zap, Cpu, Clock, Layers, Activity } from 'lucide-react';
import { fetchIncidentById, isolateDevice, updateIncidentStatus, Incident } from '../api/client';
import { AgentReasoning } from '../components/AgentReasoning';
import { SimilarThreats } from '../components/SimilarThreats';
import { ProcessTree } from '../components/ProcessTree';
import { ScoreBadge } from '../components/ScoreBadge';
import { ChatWindow } from '../components/ChatWindow';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export const IncidentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [isolating, setIsolating] = useState(false);

  const loadIncident = async () => {
    if (!id) return;
    try {
      const data = await fetchIncidentById(id);
      setIncident(data);
    } catch (err: any) {
      console.error(err);
      toast({
        type: 'danger',
        title: 'Error Loading Incident',
        message: `Could not retrieve incident record ${id}.`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncident();
  }, [id]);

  const handleIsolate = async () => {
    if (!incident) return;
    setIsolating(true);
    try {
      await isolateDevice(incident.device_id, `Containment triggered from Incident #${incident.id} deep dive`);
      toast({
        type: 'danger',
        title: 'Host Quarantined',
        message: `Endpoint ${incident.device_id} isolated from network.`
      });
      await loadIncident();
    } catch (err: any) {
      toast({
        type: 'danger',
        title: 'Isolation Failed',
        message: err?.message || 'Device isolation command failed.'
      });
    } finally {
      setIsolating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!incident) return;
    try {
      await updateIncidentStatus(incident.id, newStatus);
      toast({
        type: 'success',
        title: 'Status Updated',
        message: `Incident marked as ${newStatus}.`
      });
      await loadIncident();
    } catch (err: any) {
      toast({
        type: 'danger',
        title: 'Status Update Error',
        message: err?.message || 'Failed to update status.'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs uppercase tracking-wider text-[#9AA3AD] bg-[#0B0F17] border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#F5A900] animate-ping" />
        <span>RETRIEVING FORENSIC INCIDENT RECORD [{id}]...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-md mx-auto">
        <ShieldAlert className="w-8 h-8 text-[#FF4D5A] mx-auto" />
        <h2 className="font-mono text-sm font-bold text-[#E6E9ED]">INCIDENT NOT FOUND</h2>
        <p className="text-xs text-[#9AA3AD]">The requested incident #{id} does not exist or has expired from CockroachDB.</p>
        <Link to="/">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Return to Stream Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#9AA3AD] hover:text-[#F5A900] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>RETURN TO DASHBOARD & LIVE STREAM</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#66707C]">
          <Clock className="w-3.5 h-3.5 text-[#F5A900]" />
          <span>DETECTED AT: {new Date(incident.timestamp || incident.created_at || Date.now()).toLocaleString()}</span>
        </div>
      </div>

      {/* Incident Header Card */}
      <Card spotlight className="p-5 sm:p-6 bg-gradient-to-br from-[#0B0F17] to-[#07090E] border-[rgba(255,255,255,0.09)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="danger" size="sm" dot>
                {incident.attack_type?.toUpperCase() || 'SECURITY INCIDENT'}
              </Badge>
              <Badge variant={incident.status === 'RESOLVED' ? 'success' : 'warning'} size="sm">
                STATUS: {incident.status}
              </Badge>
              <span className="font-mono text-xs text-[#66707C]">//</span>
              <span className="font-mono text-xs font-bold text-[#F5A900]">
                RECORD #{incident.id}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-sans font-bold text-[#E6E9ED] leading-snug">
              {incident.title}
            </h1>

            <p className="text-xs sm:text-sm font-sans text-[#9AA3AD] leading-relaxed">
              {incident.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <ScoreBadge score={incident.confidence} label="Bedrock Confidence" />
            <Button
              variant="danger"
              size="md"
              loading={isolating}
              onClick={handleIsolate}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Isolate Subnet
            </Button>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.04)]">
            <span className="text-[#66707C] block text-[10px] uppercase">TARGET ENDPOINT</span>
            <span className="text-[#06B6D4] font-semibold flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5" />
              {incident.device_id}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.04)]">
            <span className="text-[#66707C] block text-[10px] uppercase">SEVERITY TIER</span>
            <span className="text-[#FF4D5A] font-semibold uppercase mt-0.5 block">
              {incident.severity}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.04)]">
            <span className="text-[#66707C] block text-[10px] uppercase">RULE ENGINE STAGE</span>
            <span className="text-[#10B981] font-semibold mt-0.5 block">
              STAGE 1 HEURISTIC
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.04)]">
            <span className="text-[#66707C] block text-[10px] uppercase">REASONING ENGINE</span>
            <span className="text-[#F5A900] font-semibold mt-0.5 block">
              BEDROCK CLAUDE 3.5
            </span>
          </div>
        </div>
      </Card>

      {/* Main Forensic Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Reasoning Log + Live Analyst Chat */}
        <div className="lg:col-span-7 space-y-6">
          <AgentReasoning
            reasoning={incident.ai_reasoning}
            currentStatus={incident.status}
            onStatusChange={handleStatusChange}
          />

          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6E9ED] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#F5A900]" />
              <span>INCIDENT #{incident.id} INTERACTIVE COPILOT DIALOGUE</span>
            </h2>
            <ChatWindow incidentId={incident.id} />
          </div>
        </div>

        {/* Right Column (5 Cols): Process Tree & Vector Matches */}
        <div className="lg:col-span-5 space-y-6">
          <ProcessTree deviceInfo={incident.ai_reasoning?.device_info} />
          <SimilarThreats threats={incident.ai_reasoning?.similar_threats || []} />
        </div>
      </div>
    </div>
  );
};

