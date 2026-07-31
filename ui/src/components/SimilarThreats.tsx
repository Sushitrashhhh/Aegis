import React from 'react';
import { Network, Sparkles } from 'lucide-react';

interface SimilarThreatsProps {
  threats: any[];
}

export const SimilarThreats: React.FC<SimilarThreatsProps> = ({ threats }) => {
  if (!threats || threats.length === 0) {
    return (
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
        No similar vector memory patterns found.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span>Bedrock Titan Vector Memory Match</span>
      </div>

      <div className="space-y-2">
        {threats.map((t, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-300">{t.threat_type || t.id}</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/30">
                {(t.similarity_score * 100).toFixed(1)}% Match
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.summary}</p>
            {t.recommended_action && (
              <p className="text-[11px] text-slate-400 pt-1 font-mono">
                Historical Action: {t.recommended_action}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
