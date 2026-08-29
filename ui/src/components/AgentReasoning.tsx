import React, { useState } from 'react';
import { Bot, AlertTriangle, ShieldCheck, Database, Layers, Copy, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface AgentReasoningProps {
  reasoning: any;
  incidentId?: string;
  currentStatus?: string;
  onStatusChange?: (newStatus: string) => void;
}

export const AgentReasoning: React.FC<AgentReasoningProps> = ({
  reasoning,
  incidentId,
  currentStatus = 'OPEN',
  onStatusChange
}) => {
  const [copied, setCopied] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!reasoning) {
    return (
      <div className="p-8 bg-[#0D121B]/80 rounded-xl border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#66707C] text-center">
        [INVESTIGATION LOG] // NO INCIDENT RECORD SELECTED
      </div>
    );
  }

  const handleCopyVerdict = () => {
    if (reasoning.agent_verdict) {
      navigator.clipboard.writeText(reasoning.agent_verdict);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusSelect = async (status: string) => {
    if (onStatusChange && status !== currentStatus) {
      setUpdatingStatus(true);
      try {
        await onStatusChange(status);
      } finally {
        setUpdatingStatus(false);
      }
    }
  };

  return (
    <div className="bg-[#0D121B]/95 rounded-xl border border-[rgba(255,255,255,0.08)] border-l-4 border-l-[#F5A900] p-4 sm:p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-[#A78BFA]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E6E9ED]">
                AWS BEDROCK CLAUDE INVESTIGATION REPORT
              </h3>
              <Badge variant="violet" size="sm">Claude 3.5 Sonnet</Badge>
            </div>
            <p className="text-[10px] font-mono text-[#66707C] mt-0.5">
              AUTONOMOUS SOC REASONING ENGINE // TRACE {reasoning.incident_id || incidentId || 'LIVE'}
            </p>
          </div>
        </div>

        {/* Status Switcher */}
        {onStatusChange && (
          <div className="flex items-center gap-1 bg-[#07090E] p-1 rounded-lg border border-[rgba(255,255,255,0.08)]">
            <span className="text-[10px] font-mono text-[#66707C] px-1.5 uppercase">STATUS:</span>
            {['OPEN', 'CONTAINED', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => handleStatusSelect(st)}
                disabled={updatingStatus}
                className={cn(
                  'px-2 py-0.5 text-[10px] font-mono rounded font-medium transition-colors select-none',
                  currentStatus === st
                    ? st === 'RESOLVED'
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                      : st === 'CONTAINED'
                      ? 'bg-[#F5A900]/20 text-[#F5A900] border border-[#F5A900]/40'
                      : 'bg-[#FF4D5A]/20 text-[#FF4D5A] border border-[#FF4D5A]/40'
                    : 'text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]'
                )}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Agent Verdict Banner */}
      <div className="relative p-3.5 rounded-lg bg-[#07090E] border border-[#F5A900]/30 flex items-start justify-between gap-3 shadow-[0_0_15px_rgba(245,169,0,0.08)]">
        <div className="flex items-start gap-2.5 min-w-0">
          <Sparkles className="w-4 h-4 text-[#F5A900] shrink-0 mt-0.5" />
          <div className="font-mono text-xs text-[#F5A900] leading-relaxed font-semibold">
            {reasoning.agent_verdict}
          </div>
        </div>
        <button
          onClick={handleCopyVerdict}
          className="p-1 rounded text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26] transition-colors shrink-0"
          title="Copy Verdict"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Stage 1 Root Cause Analysis */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#9AA3AD] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Stage 1 Heuristic Root Cause Analysis</span>
        </div>
        <div className="p-3.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.07)] font-sans text-xs text-[#E6E9ED] leading-relaxed">
          {reasoning.explanation}
        </div>
      </div>

      {/* Recommended Containment Strategy */}
      {reasoning.recommended_action && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#9AA3AD] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F5A900]" />
            <span>Remediation & Containment Plan</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.07)] text-xs space-y-2.5">
            <div className="font-mono font-semibold text-[#F5A900] uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A900]" />
              <span>{reasoning.recommended_action.recommended_action}</span>
            </div>
            {reasoning.recommended_action.steps && (
              <div className="space-y-1.5 pt-1">
                {reasoning.recommended_action.steps.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#9AA3AD]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vector Memory Store Confirmation */}
      {reasoning.memory_persisted && (
        <div className="flex items-center justify-between pt-3 text-xs font-mono text-[#10B981] border-t border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="truncate">{reasoning.memory_persisted.message}</span>
          </div>
          {reasoning.memory_persisted.id && (
            <Badge variant="success" size="sm">
              {reasoning.memory_persisted.id}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

