import React from 'react';

interface ScoreBadgeProps {
  score: number | string;
  label?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, label }) => {
  const numScore = typeof score === 'number' ? score : parseFloat(score) || 0.9;
  const pct = Math.round(numScore > 1 ? numScore : numScore * 100);

  let badgeStyle = 'bg-[#4DA3FF]/10 text-[#4DA3FF] border-[#4DA3FF]/30';
  if (pct >= 85) {
    badgeStyle = 'bg-[#FF4D5A]/10 text-[#FF4D5A] border-[#FF4D5A]/30';
  } else if (pct >= 60) {
    badgeStyle = 'bg-[#F5A900]/10 text-[#F5A900] border-[#F5A900]/30';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label && <span>{label}:</span>}
      <span className="tabular-nums">{pct}% Confidence</span>
    </span>
  );
};
