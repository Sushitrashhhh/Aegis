import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIncidentById } from '../api/client';
import { AgentReasoning } from '../components/AgentReasoning';
import { SimilarThreats } from '../components/SimilarThreats';
import { ProcessTree } from '../components/ProcessTree';

export const IncidentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchIncidentById(id).then(setIncident).catch(console.error);
    }
  }, [id]);

  if (!incident) {
    return <div className="p-8 text-center text-slate-400">Loading incident details...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
        <div className="text-xs font-mono text-cyan-400">{incident.id}</div>
        <h1 className="text-xl font-bold text-slate-100 mb-2">{incident.title}</h1>
        <p className="text-sm text-slate-400">{incident.description}</p>
      </div>

      <AgentReasoning reasoning={incident.ai_reasoning} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessTree deviceInfo={incident.ai_reasoning?.device_info} />
        <SimilarThreats threats={incident.ai_reasoning?.similar_threats || []} />
      </div>
    </div>
  );
};
