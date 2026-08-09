import React from 'react';
import { ShieldAlert, Cpu, Clock } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';

interface IncidentCardProps {
  incident: any;
  onClick?: () => void;
  isSelected?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick, isSelected }) => {
  const getSeverityBorder = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'border-l-[#FF4D5A]';
      case 'MEDIUM':
        return 'border-l-[#F5A900]';
      default:
        return 'border-l-[#4DA3FF]';
    }
  };

  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className={`p-3 rounded bg-[#0D1117] border border-l-4 transition-colors cursor-pointer ${getSeverityBorder(
        incident.severity
      )} ${
        isSelected
          ? 'border-t-[#F5A900]/50 border-r-[#F5A900]/50 border-b-[#F5A900]/50 bg-[#131822]'
          : 'border-t-[rgba(255,255,255,0.08)] border-r-[rgba(255,255,255,0.08)] border-b-[rgba(255,255,255,0.08)] hover:bg-[#131822] hover:border-t-[rgba(255,255,255,0.15)] hover:border-r-[rgba(255,255,255,0.15)] hover:border-b-[rgba(255,255,255,0.15)]'
      } focus-visible:outline-none`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 font-mono text-xs text-[#9AA3AD]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#FF4D5A] shrink-0" />
          <span className="font-semibold text-[#E6E9ED]">{incident.id}</span>
          <span className="text-[#66707C]">·</span>
          <span className="text-[#F5A900] font-medium">{incident.attack_type}</span>
        </div>
        <ScoreBadge score={incident.confidence} />
      </div>

      <h3 className="font-sans font-medium text-xs text-[#E6E9ED] mb-1 line-clamp-1">{incident.title}</h3>
      <p className="font-sans text-[12px] text-[#9AA3AD] line-clamp-2 mb-2.5 leading-relaxed">{incident.description}</p>

      <div className="flex items-center justify-between text-[11px] text-[#66707C] pt-2 border-t border-[rgba(255,255,255,0.05)] font-mono">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#9AA3AD]" />
          <span>{incident.device_id}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#66707C]" />
          <span className="uppercase">{incident.status}</span>
        </div>
      </div>
    </div>
  );
};
