import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { ShieldAlert, Cpu, Clock, ChevronRight, Activity } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';
import { Badge } from './ui/Badge';
import { Incident } from '../api/client';
import { cn } from '../lib/utils';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  isSelected?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick, isSelected }) => {
  const [springStyle, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    config: { tension: 400, friction: 30 }
  }));

  const handleMouseEnter = () => {
    api.start({ scale: 1.01, x: 2 });
  };

  const handleMouseLeave = () => {
    api.start({ scale: 1, x: 0 });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return { border: 'border-l-[#FF4D5A]', glow: 'rgba(255, 77, 90, 0.2)', variant: 'critical' as const };
      case 'HIGH':
        return { border: 'border-l-[#F43F5E]', glow: 'rgba(244, 63, 94, 0.2)', variant: 'critical' as const };
      case 'MEDIUM':
        return { border: 'border-l-[#F5A900]', glow: 'rgba(245, 169, 0, 0.15)', variant: 'amber' as const };
      default:
        return { border: 'border-l-[#06B6D4]', glow: 'rgba(6, 182, 212, 0.15)', variant: 'info' as const };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONTAINED':
        return <Badge variant="amber" size="sm" dot>CONTAINED</Badge>;
      case 'RESOLVED':
        return <Badge variant="success" size="sm" dot>RESOLVED</Badge>;
      case 'INVESTIGATING':
        return <Badge variant="info" size="sm" dot pulse>INVESTIGATING</Badge>;
      default:
        return <Badge variant="critical" size="sm" dot pulse>OPEN</Badge>;
    }
  };

  const sev = getSeverityColor(incident.severity);

  return (
    <animated.div
      style={springStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className={cn(
        'p-3.5 rounded-xl border border-l-4 transition-all duration-200 cursor-pointer select-none relative group',
        sev.border,
        isSelected
          ? 'bg-[#131A26] border-t-[#F5A900]/60 border-r-[#F5A900]/60 border-b-[#F5A900]/60 shadow-[0_0_25px_rgba(245,169,0,0.15)]'
          : 'bg-[#0D121B]/90 border-[rgba(255,255,255,0.07)] hover:bg-[#131A26]/80 hover:border-[rgba(255,255,255,0.15)]'
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 font-mono text-xs text-[#9AA3AD] min-w-0">
          <div className="p-1 rounded bg-[#FF4D5A]/10 text-[#FF4D5A]">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          </div>
          <span className="font-semibold text-[#E6E9ED] truncate">{incident.id}</span>
          <span className="text-[#66707C]">·</span>
          <span className="text-[#F5A900] font-medium text-[11px] truncate">{incident.attack_type}</span>
        </div>
        <ScoreBadge score={incident.confidence} />
      </div>

      {/* Title & Description */}
      <h3 className="font-sans font-semibold text-xs text-[#E6E9ED] mb-1 line-clamp-1 group-hover:text-[#FFFFFF] transition-colors">
        {incident.title}
      </h3>
      <p className="font-sans text-[11px] text-[#9AA3AD] line-clamp-2 mb-3 leading-relaxed">
        {incident.description}
      </p>

      {/* Footer Meta Row */}
      <div className="flex items-center justify-between text-[11px] text-[#66707C] pt-2.5 border-t border-[rgba(255,255,255,0.06)] font-mono">
        <div className="flex items-center gap-1.5 text-[#9AA3AD]">
          <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span className="truncate max-w-[110px]">{incident.device_id}</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(incident.status)}
          <ChevronRight className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            isSelected ? 'text-[#F5A900] translate-x-0.5' : 'text-[#66707C] group-hover:text-[#E6E9ED]'
          )} />
        </div>
      </div>
    </animated.div>
  );
};

