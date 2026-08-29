import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Database, Sparkles, History, ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/Badge';

interface SimilarThreatsProps {
  threats: any[];
}

const ThreatMatchItem: React.FC<{ threat: any }> = ({ threat }) => {
  const score = threat.similarity_score ? Math.round(threat.similarity_score * 100) : 85;

  const barSpring = useSpring({
    from: { width: '0%' },
    to: { width: `${score}%` },
    config: { tension: 180, friction: 24 }
  });

  return (
    <div className="p-3.5 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.07)] hover:bg-[#131A26]/70 hover:border-[rgba(255,255,255,0.15)] transition-all space-y-2.5 text-xs group">
      {/* Title and score */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono font-semibold text-[#E6E9ED] truncate">
          <History className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
          <span className="truncate">{threat.threat_type || threat.id}</span>
        </div>
        <Badge variant="violet" size="sm">
          {score}% SIMILAR
        </Badge>
      </div>

      {/* Animated Match Bar */}
      <div className="w-full bg-[#131A26] h-1.5 rounded-full overflow-hidden">
        <animated.div
          style={barSpring}
          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-full"
        />
      </div>

      {/* Summary */}
      <p className="font-sans text-[#9AA3AD] leading-relaxed text-[11px]">
        {threat.summary}
      </p>

      {/* Historical action */}
      {threat.recommended_action && (
        <div className="pt-2 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[10px] font-mono text-[#66707C]">
          <span className="text-[#9AA3AD]">REMEDIED VIA:</span>
          <span className="text-[#F5A900] truncate max-w-[180px]">{threat.recommended_action}</span>
        </div>
      )}
    </div>
  );
};

export const SimilarThreats: React.FC<SimilarThreatsProps> = ({ threats }) => {
  if (!threats || threats.length === 0) {
    return (
      <div className="bg-[#0D121B]/95 rounded-xl border border-[rgba(255,255,255,0.08)] p-5 text-center space-y-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <Database className="w-6 h-6 text-[#66707C] mx-auto" />
        <div className="text-xs font-mono text-[#66707C] uppercase tracking-wider">
          NO TITAN VECTOR MEMORY MATCHES FOUND
        </div>
        <p className="text-[11px] text-[#66707C]">
          This attack vector appears novel. Incident details will be indexed into Titan vector memory upon investigation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D121B]/95 rounded-xl border border-[rgba(255,255,255,0.08)] p-4 sm:p-5 space-y-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#8B5CF6]/10 text-[#A78BFA]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono font-semibold text-xs uppercase tracking-wider text-[#E6E9ED]">
              TITAN VECTOR MEMORY MATCHES
            </h4>
            <span className="text-[10px] text-[#66707C] font-mono">EMBEDDING SIMILARITY CORRELATION</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#A78BFA] bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/30">
          TITAN V2
        </span>
      </div>

      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
        {threats.map((t, idx) => (
          <ThreatMatchItem key={idx} threat={t} />
        ))}
      </div>
    </div>
  );
};

