import React, { useState, useMemo } from 'react';
import { animated, useTrail } from '@react-spring/web';
import { ShieldAlert, Search, RefreshCw, Radio, Sparkles, Filter } from 'lucide-react';
import { IncidentCard } from './IncidentCard';
import { Button } from './ui/Button';
import { Incident } from '../api/client';
import { cn } from '../lib/utils';

interface IncidentStreamProps {
  incidents: Incident[];
  selectedIncident?: Incident | null;
  selectedIncidentId?: string;
  onSelectIncident: (inc: Incident) => void;
  loading?: boolean;
  onRefresh?: () => void;
  onOpenSimulate?: () => void;
}

export const IncidentStream: React.FC<IncidentStreamProps> = ({
  incidents,
  selectedIncident,
  selectedIncidentId,
  onSelectIncident,
  loading = false,
  onRefresh,
  onOpenSimulate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const activeSelectedId = selectedIncident?.id || selectedIncidentId;

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch =
        searchQuery === '' ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.attack_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.device_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity =
        severityFilter === 'ALL' || inc.severity?.toUpperCase() === severityFilter;

      const matchesStatus =
        statusFilter === 'ALL' || inc.status?.toUpperCase() === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  const trail = useTrail(filteredIncidents.length, {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 350, friction: 28 },
    reset: true
  });

  return (
    <div className="space-y-3 flex flex-col h-full">
      {/* Stream Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#F5A900]/10 text-[#F5A900]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6E9ED]">
              REAL-TIME INCIDENT STREAM
            </h2>
            <span className="text-[10px] text-[#66707C] font-mono">
              {filteredIncidents.length} of {incidents.length} RECORDS
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={onRefresh}
          className="h-7 w-7 p-0"
          title="Refresh Incident Feed"
        >
          <RefreshCw className={cn('w-3.5 h-3.5 text-[#9AA3AD]', loading && 'animate-spin text-[#F5A900]')} />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#66707C] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by ID, host, attack type, keyword..."
          className="w-full bg-[#0D121B] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#E6E9ED] placeholder-[#66707C] focus:outline-none focus:border-[#F5A900]/60 transition-colors font-sans"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
        <span className="text-[#66707C] mr-0.5 flex items-center gap-1">
          <Filter className="w-3 h-3" />
        </span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={cn(
              'px-2 py-0.5 rounded transition-colors select-none',
              severityFilter === sev
                ? 'bg-[#F5A900]/20 text-[#F5A900] border border-[#F5A900]/40 font-semibold'
                : 'text-[#9AA3AD] hover:text-[#E6E9ED] bg-[#131A26]/50 border border-transparent'
            )}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Incident List */}
      <div className="space-y-2.5 flex-1 max-h-[640px] overflow-y-auto pr-1">
        {filteredIncidents.length > 0 ? (
          trail.map((style, index) => {
            const inc = filteredIncidents[index];
            if (!inc) return null;
            return (
              <animated.div key={inc.id} style={style}>
                <IncidentCard
                  incident={inc}
                  isSelected={activeSelectedId === inc.id}
                  onClick={() => onSelectIncident(inc)}
                />
              </animated.div>
            );
          })
        ) : (
          <div className="p-6 text-center bg-[#0D121B]/80 rounded-xl border border-[rgba(255,255,255,0.06)] text-xs space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="font-mono font-semibold text-[#E6E9ED]">
                LIVE TELEMETRY // SENSOR CONNECTED
              </div>
              <p className="text-[#9AA3AD] text-[11px] max-w-xs mx-auto">
                No matching incidents detected. Sensors are actively streaming telemetry.
              </p>
            </div>
            {onOpenSimulate && (
              <Button
                variant="neon"
                size="sm"
                onClick={onOpenSimulate}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="mx-auto"
              >
                Simulate Attack Scenario
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
