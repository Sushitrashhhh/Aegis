import React from 'react';
import { ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';

interface IncidentCardProps {
  incident: any;
  onClick?: () => void;
  isSelected?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick, isSelected }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-500 bg-slate-900/80 hover:bg-slate-800/80';
      case 'HIGH':
        return 'border-l-4 border-l-orange-500 bg-slate-900/80 hover:bg-slate-800/80';
      case 'MEDIUM':
        return 'border-l-4 border-l-amber-500 bg-slate-900/80 hover:bg-slate-800/80';
      default:
        return 'border-l-4 border-l-blue-500 bg-slate-900/80 hover:bg-slate-800/80';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${getSeverityStyle(incident.severity)} ${
        isSelected ? 'ring-2 ring-cyan-500 border-cyan-500/50 shadow-lg shadow-cyan-950/50' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span className="font-mono text-xs text-slate-400">{incident.id}</span>
        </div>
        <ScoreBadge score={incident.confidence} />
      </div>

      <h3 className="font-semibold text-slate-100 text-sm mb-1">{incident.title}</h3>
      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{incident.description}</p>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">{incident.device_id}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{incident.status}</span>
        </div>
      </div>
    </div>
  );
};
