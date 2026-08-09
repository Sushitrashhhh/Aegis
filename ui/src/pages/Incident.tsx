import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { fetchIncidentById } from '../api/client';
import { AgentReasoning } from '../components/AgentReasoning';
import { SimilarThreats } from '../components/SimilarThreats';
import { ProcessTree } from '../components/ProcessTree';
import { ScoreBadge } from '../components/ScoreBadge';

export const IncidentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchIncidentById(id).then(setIncident).catch(console.error);
    }
  }, [id]);

  if (!incident) {
    return (
      <div className="p-12 text-center font-mono text-xs uppercase tracking-wider text-[#66707C] bg-[#0D1117] border border-[rgba(255,255,255,0.08)] rounded">
        LOADING INCIDENT RECORD [{id}]...
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Return to Stream Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9AA3AD] hover:text-[#F5A900] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO INCIDENT STREAM</span>
        </Link>
      </div>

      {/* Incident Header Card */}
      <div className="p-4 bg-[#0D1117] border border-[rgba(255,255,255,0.08)] rounded space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-mono text-[#F5A900] tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF4D5A]" />
            <span>INCIDENT RECORD // {incident.id}</span>
          </div>
          <ScoreBadge score={incident.confidence} />
        </div>
        <h1 className="text-base font-sans font-semibold text-[#E6E9ED]">{incident.title}</h1>
        <p className="text-xs font-sans text-[#9AA3AD] leading-relaxed max-w-3xl">{incident.description}</p>
      </div>

      {/* Responsive Investigation Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Workspace Left Column: Agent Reasoning Log */}
        <div className="md:col-span-2 space-y-5">
          <AgentReasoning reasoning={incident.ai_reasoning} />
        </div>

        {/* Side Rail Right Column: Forensic Evidence (ProcessTree & Vector Matches) */}
        <div className="space-y-5">
          <ProcessTree deviceInfo={incident.ai_reasoning?.device_info} />
          <SimilarThreats threats={incident.ai_reasoning?.similar_threats || []} />
        </div>
      </div>
    </div>
  );
};
