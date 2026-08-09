import React from 'react';
import { Bot, AlertTriangle, ShieldCheck, Database, Layers } from 'lucide-react';

interface AgentReasoningProps {
  reasoning: any;
}

export const AgentReasoning: React.FC<AgentReasoningProps> = ({ reasoning }) => {
  if (!reasoning) {
    return (
      <div className="p-6 bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#66707C] text-center">
        [INVESTIGATION LOG] // NO INCIDENT SELECTED
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] border-l-4 border-l-[#F5A900] p-5 space-y-4">
      {/* Investigation Log Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[rgba(245,169,0,0.1)] border border-[#8A6300]/40 text-[#F5A900]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E6E9ED]">
              BEDROCK CLAUDE AI INVESTIGATION REPORT
            </h3>
            <p className="text-[11px] font-mono text-[#66707C]">PIPELINE: DETECT → INVESTIGATE → REMEMBER → ACT</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#36C98F]/10 text-[#36C98F] border border-[#36C98F]/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> VERDICT FORMULATED
        </span>
      </div>

      {/* Agent Verdict Block */}
      <div className="p-3 rounded bg-[#07090C] border border-[#8A6300]/30 font-mono text-xs text-[#F5A900] font-semibold">
        &gt; {reasoning.agent_verdict}
      </div>

      {/* Root Cause Analysis */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#9AA3AD] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#F5A900]" />
          <span>Stage 1 Root Cause Analysis</span>
        </div>
        <div className="p-3 rounded bg-[#07090C] border border-[rgba(255,255,255,0.08)] font-sans text-xs text-[#E6E9ED] leading-relaxed">
          {reasoning.explanation}
        </div>
      </div>

      {/* Containment Strategy */}
      {reasoning.recommended_action && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#9AA3AD] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F5A900]" />
            <span>Recommended Containment Strategy</span>
          </div>
          <div className="p-3 rounded bg-[#07090C] border border-[rgba(255,255,255,0.08)] text-xs space-y-2">
            <div className="font-mono font-semibold text-[#F5A900] uppercase tracking-wide">
              {reasoning.recommended_action.recommended_action}
            </div>
            {reasoning.recommended_action.steps && (
              <ul className="list-disc list-inside text-[#9AA3AD] font-sans text-xs space-y-1 pt-0.5">
                {reasoning.recommended_action.steps.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Vector Memory Store Confirmation */}
      {reasoning.memory_persisted && (
        <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#36C98F] border-t border-[rgba(255,255,255,0.08)]">
          <Database className="w-3.5 h-3.5" />
          <span>{reasoning.memory_persisted.message}</span>
        </div>
      )}
    </div>
  );
};
