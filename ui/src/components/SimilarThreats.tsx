import React from 'react';
import { Database } from 'lucide-react';

interface SimilarThreatsProps {
  threats: any[];
}

export const SimilarThreats: React.FC<SimilarThreatsProps> = ({ threats }) => {
  if (!threats || threats.length === 0) {
    return (
      <div className="p-4 bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#66707C] uppercase tracking-wider text-center">
        NO VECTOR MEMORY MATCHES FOUND
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#E6E9ED] border-b border-[rgba(255,255,255,0.08)] pb-2">
        <Database className="w-3.5 h-3.5 text-[#F5A900]" />
        <span>TITAN VECTOR MEMORY MATCHES</span>
      </div>

      <div className="space-y-2">
        {threats.map((t, idx) => (
          <div
            key={idx}
            className="p-3 rounded bg-[#07090C] border border-[rgba(255,255,255,0.08)] hover:bg-[#131822] hover:border-[rgba(255,255,255,0.15)] transition-colors space-y-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-[#E6E9ED]">{t.threat_type || t.id}</span>
              <span className="px-2 py-0.5 rounded bg-[#F5A900]/10 text-[#F5A900] text-[11px] font-mono font-semibold border border-[#F5A900]/30 tabular-nums">
                {(t.similarity_score * 100).toFixed(1)}% Match
              </span>
            </div>
            <p className="font-sans text-[#9AA3AD] leading-relaxed">{t.summary}</p>
            {t.recommended_action && (
              <p className="text-[11px] text-[#66707C] font-mono pt-1">
                HISTORICAL ACTION: {t.recommended_action}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
