import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'amber' | 'critical' | 'danger' | 'warning' | 'info' | 'success' | 'violet' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'default',
  dot = false,
  pulse = false,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#131A26] text-[#E6E9ED] border-[rgba(255,255,255,0.1)]',
    amber: 'bg-[#F5A900]/10 text-[#F5A900] border-[#F5A900]/30 shadow-[0_0_10px_rgba(245,169,0,0.15)]',
    critical: 'bg-[#FF4D5A]/10 text-[#FF4D5A] border-[#FF4D5A]/35 shadow-[0_0_10px_rgba(255,77,90,0.18)]',
    danger: 'bg-[#FF4D5A]/10 text-[#FF4D5A] border-[#FF4D5A]/35 shadow-[0_0_10px_rgba(255,77,90,0.18)]',
    warning: 'bg-[#F5A900]/10 text-[#F5A900] border-[#F5A900]/30',
    info: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    success: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    violet: 'bg-[#8B5CF6]/10 text-[#A78BFA] border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
    outline: 'bg-transparent text-[#9AA3AD] border-[rgba(255,255,255,0.12)]'
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    default: 'text-[11px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2'
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded-full border transition-all select-none',
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full bg-current shrink-0',
            pulse && 'animate-pulse'
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
