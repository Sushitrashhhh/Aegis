import React from 'react';
import { Terminal, GitBranch, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/Badge';

interface ProcessTreeProps {
  deviceInfo: any;
}

export const ProcessTree: React.FC<ProcessTreeProps> = ({ deviceInfo }) => {
  if (!deviceInfo) return null;

  const processes: string[] = deviceInfo.active_processes || [];

  const getCriticalityBadge = (crit: string = 'MEDIUM') => {
    switch (crit.toUpperCase()) {
      case 'CRITICAL':
        return <Badge variant="critical" size="sm" dot>CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="critical" size="sm" dot>HIGH</Badge>;
      case 'LOW':
        return <Badge variant="success" size="sm">LOW</Badge>;
      default:
        return <Badge variant="warning" size="sm">MEDIUM</Badge>;
    }
  };

  return (
    <div className="bg-[#0D121B]/95 rounded-xl border border-[rgba(255,255,255,0.08)] p-4 sm:p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#06B6D4]/10 text-[#06B6D4]">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono font-semibold text-xs uppercase tracking-wider text-[#E6E9ED]">
              PROCESS EXECUTION TREE
            </h4>
            <span className="text-[10px] text-[#66707C] font-mono">HOST FORENSIC TELEMETRY</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#F5A900] bg-[#F5A900]/10 px-2 py-0.5 rounded border border-[#F5A900]/30">
          {deviceInfo.device_id}
        </span>
      </div>

      {/* Host Meta Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono bg-[#07090E] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-[#66707C] text-[10px] uppercase block">Host Name</span>
          <span className="text-[#E6E9ED] font-semibold truncate block">{deviceInfo.name}</span>
        </div>
        <div>
          <span className="text-[#66707C] text-[10px] uppercase block">IP Address</span>
          <span className="text-[#06B6D4] font-medium block">{deviceInfo.ip_address}</span>
        </div>
        <div>
          <span className="text-[#66707C] text-[10px] uppercase block">Owner</span>
          <span className="text-[#9AA3AD] truncate block">{deviceInfo.owner}</span>
        </div>
        <div>
          <span className="text-[#66707C] text-[10px] uppercase block">Risk Profile</span>
          <div className="mt-0.5">{getCriticalityBadge(deviceInfo.criticality)}</div>
        </div>
      </div>

      {/* Process Hierarchy */}
      {processes.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-semibold text-[#9AA3AD] flex items-center justify-between uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#F5A900]" />
              <span>FORENSIC PROCESS ANCESTRY</span>
            </div>
            <span className="text-[10px] text-[#66707C] font-mono">{processes.length} NODES</span>
          </div>
          <div className="p-3 rounded-lg bg-[#07090E] font-mono text-xs border border-[rgba(255,255,255,0.07)] space-y-1.5">
            {processes.map((proc: string, idx: number) => {
              const isLast = idx === processes.length - 1;
              const isSuspicious =
                proc.toLowerCase().includes('mimikatz') ||
                proc.toLowerCase().includes('vssadmin') ||
                proc.toLowerCase().includes('encrypter') ||
                proc.toLowerCase().includes('cmd');

              return (
                <div key={idx} className="flex items-center gap-2 font-mono group">
                  <span className="text-[#66707C] select-none text-xs">
                    {isLast ? '└──' : '├──'}
                  </span>
                  <span
                    className={`tabular-nums text-xs px-2 py-0.5 rounded transition-colors ${
                      isSuspicious
                        ? 'text-[#FF4D5A] font-semibold bg-[#FF4D5A]/15 border border-[#FF4D5A]/40 shadow-[0_0_10px_rgba(255,77,90,0.2)]'
                        : 'text-[#E6E9ED] bg-[#131A26]/50 group-hover:bg-[#131A26]'
                    }`}
                  >
                    {proc}
                  </span>
                  {isSuspicious && (
                    <span className="text-[10px] font-mono text-[#FF4D5A] uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> SUSPECT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

