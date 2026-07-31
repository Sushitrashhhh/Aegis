import React from 'react';
import { Terminal, GitBranch } from 'lucide-react';

interface ProcessTreeProps {
  deviceInfo: any;
}

export const ProcessTree: React.FC<ProcessTreeProps> = ({ deviceInfo }) => {
  if (!deviceInfo) return null;

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Device Risk Profile & Process Tree</span>
        </div>
        <span className="font-mono text-cyan-400">{deviceInfo.device_id}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
        <div><span className="text-slate-500">Host:</span> <span className="text-slate-200 font-mono">{deviceInfo.name}</span></div>
        <div><span className="text-slate-500">IP:</span> <span className="text-slate-200 font-mono">{deviceInfo.ip_address}</span></div>
        <div><span className="text-slate-500">Owner:</span> <span className="text-slate-200">{deviceInfo.owner}</span></div>
        <div><span className="text-slate-500">Criticality:</span> <span className="text-amber-400 font-semibold">{deviceInfo.criticality}</span></div>
      </div>

      {deviceInfo.active_processes && deviceInfo.active_processes.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Active Process Tree</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1">
            {deviceInfo.active_processes.map((proc: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-600">└─</span>
                <span className={proc.includes('mimikatz') || proc.includes('vssadmin') ? 'text-red-400 font-bold animate-pulse' : ''}>
                  {proc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
