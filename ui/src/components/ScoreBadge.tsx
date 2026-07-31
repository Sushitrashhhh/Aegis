import React from 'react';

interface ScoreBadgeProps {
  score: number | string;
  label?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, label }) => {
  const numScore = typeof score === 'number' ? score : parseFloat(score) || 0.9;
  const pct = Math.round(numScore > 1 ? numScore : numScore * 100);

  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (pct >= 85) badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
  else if (pct >= 60) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
      {label && <span>{label}:</span>}
      <span>{pct}% Confidence</span>
    </span>
  );
};
