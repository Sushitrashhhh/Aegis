import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { cn } from '../lib/utils';

interface ScoreBadgeProps {
  score: number | string;
  label?: string;
  className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, label, className }) => {
  const numScore = typeof score === 'number' ? score : parseFloat(score) || 0.9;
  const pct = Math.round(numScore > 1 ? numScore : numScore * 100);

  const { val } = useSpring({
    from: { val: 0 },
    to: { val: pct },
    config: { tension: 220, friction: 20 }
  });

  let colorStyle = 'bg-[#06B6D4]/10 text-[#67E8F9] border-[#06B6D4]/35 shadow-[0_0_10px_rgba(6,182,212,0.15)]';
  let dotColor = 'bg-[#06B6D4]';

  if (pct >= 85) {
    colorStyle = 'bg-[#FF4D5A]/10 text-[#FF4D5A] border-[#FF4D5A]/35 shadow-[0_0_10px_rgba(255,77,90,0.2)]';
    dotColor = 'bg-[#FF4D5A]';
  } else if (pct >= 65) {
    colorStyle = 'bg-[#F5A900]/10 text-[#F5A900] border-[#F5A900]/35 shadow-[0_0_10px_rgba(245,169,0,0.15)]';
    dotColor = 'bg-[#F5A900]';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border transition-all select-none',
        colorStyle,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColor)} />
      {label && <span className="opacity-80">{label}:</span>}
      <span className="tabular-nums">
        <animated.span>{val.to(n => Math.round(n))}</animated.span>%
      </span>
    </span>
  );
};

