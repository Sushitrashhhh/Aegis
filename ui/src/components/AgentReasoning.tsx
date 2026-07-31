import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, ShieldCheck, Database, Layers } from 'lucide-react';

interface AgentReasoningProps {
  reasoning: any;
}

export const AgentReasoning: React.FC<AgentReasoningProps> = ({ reasoning }) => {
  if (!reasoning) {
    return (
      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 text-center text-slate-400">
        No active agent reasoning output. Select an incident to view Bedrock Claude analysis.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Bedrock Claude AI Investigation</h3>
            <p className="text-xs text-slate-400">Autonomous Detect → Investigate → Remember → Act Pipeline</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verdict Formulated
        </span>
      </div>

      {/* Agent Verdict */}
      <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 text-sm font-medium">
        {reasoning.agent_verdict}
      </div>

      {/* Explanation */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Stage 1 Root Cause Analysis</span>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
          {reasoning.explanation}
        </p>
      </div>

      {/* Action Recommendation */}
      {reasoning.recommended_action && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Recommended Containment Strategy</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
            <div className="font-semibold text-amber-300">
              {reasoning.recommended_action.recommended_action}
            </div>
            {reasoning.recommended_action.steps && (
              <ul className="list-disc list-inside text-slate-400 space-y-0.5 pt-1">
                {reasoning.recommended_action.steps.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Vector Memory Persistence */}
      {reasoning.memory_persisted && (
        <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 border-t border-slate-800/60">
          <Database className="w-4 h-4" />
          <span>{reasoning.memory_persisted.message}</span>
        </div>
      )}
    </div>
  );
};
