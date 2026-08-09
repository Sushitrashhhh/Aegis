import React from 'react';
import { Terminal, GitBranch } from 'lucide-react';

interface ProcessTreeProps {
  deviceInfo: any;
}

export const ProcessTree: React.FC<ProcessTreeProps> = ({ deviceInfo }) => {
  if (!deviceInfo) return null;

  const processes = deviceInfo.active_processes || [];

  return (
    <div className="bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2 text-xs font-mono font-semibold tracking-wider text-[#E6E9ED]">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-[#F5A900]" />
          <span>PROCESS EXECUTION TREE</span>
        </div>
        <span className="text-[#8A6300] font-mono">{deviceInfo.device_id}</span>
      </div>

      {/* Host Meta Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#07090C] p-2.5 rounded border border-[rgba(255,255,255,0.05)]">
        <div>
          <span className="text-[#66707C]">HOST:</span>{' '}
          <span className="text-[#E6E9ED] font-semibold">{deviceInfo.name}</span>
        </div>
        <div>
          <span className="text-[#66707C]">IP:</span>{' '}
          <span className="text-[#E6E9ED]">{deviceInfo.ip_address}</span>
        </div>
        <div>
          <span className="text-[#66707C]">OWNER:</span>{' '}
          <span className="text-[#E6E9ED]">{deviceInfo.owner}</span>
        </div>
        <div>
          <span className="text-[#66707C]">CRITICALITY:</span>{' '}
          <span className="text-[#F5A900] font-semibold">{deviceInfo.criticality}</span>
        </div>
      </div>

      {/* Process Hierarchy */}
      {processes.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono font-semibold text-[#9AA3AD] flex items-center gap-1.5 uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-[#66707C]" />
            <span>SUSPECT PROCESS HIERARCHY</span>
          </div>
          <div className="p-3 rounded bg-[#07090C] font-mono text-xs border border-[rgba(255,255,255,0.08)] space-y-1">
            {processes.map((proc: string, idx: number) => {
              const isLast = idx === processes.length - 1;
              const isSuspicious =
                proc.toLowerCase().includes('mimikatz') ||
                proc.toLowerCase().includes('vssadmin') ||
                proc.toLowerCase().includes('encrypter') ||
                proc.toLowerCase().includes('cmd');

              return (
                <div key={idx} className="flex items-center gap-2 font-mono">
                  <span className="text-[#66707C] select-none">
                    {isLast ? '└──' : '├──'}
                  </span>
                  <span
                    className={`tabular-nums ${
                      isSuspicious
                        ? 'text-[#FF4D5A] font-semibold bg-[#FF4D5A]/10 px-1.5 py-0.5 rounded border border-[#FF4D5A]/30'
                        : 'text-[#E6E9ED]'
                    }`}
                  >
                    {proc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
