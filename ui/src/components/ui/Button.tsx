import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'critical' | 'danger' | 'cyan' | 'success' | 'outline' | 'ghost' | 'secondary' | 'neon';
  size?: 'xs' | 'sm' | 'md' | 'default' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'default',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const [springProps, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 400, friction: 25 }
  }));

  const handleMouseDown = () => {
    if (!disabled && !loading) {
      api.start({ scale: 0.96 });
    }
  };

  const handleMouseUp = () => {
    if (!disabled && !loading) {
      api.start({ scale: 1 });
    }
  };

  const variantStyles = {
    primary:
      'bg-[#F5A900] text-[#07090E] font-semibold hover:bg-[#FFB800] border border-[#F5A900] shadow-[0_0_15px_rgba(245,169,0,0.25)]',
    critical:
      'bg-[#FF4D5A]/15 text-[#FF4D5A] font-semibold hover:bg-[#FF4D5A]/25 border border-[#FF4D5A]/50 shadow-[0_0_15px_rgba(255,77,90,0.2)]',
    danger:
      'bg-[#FF4D5A]/15 text-[#FF4D5A] font-semibold hover:bg-[#FF4D5A]/25 border border-[#FF4D5A]/50 shadow-[0_0_15px_rgba(255,77,90,0.2)]',
    cyan:
      'bg-[#06B6D4]/15 text-[#67E8F9] font-semibold hover:bg-[#06B6D4]/25 border border-[#06B6D4]/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    success:
      'bg-[#10B981]/15 text-[#34D399] font-semibold hover:bg-[#10B981]/25 border border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    secondary:
      'bg-[#131A26] text-[#E6E9ED] hover:bg-[#1A2333] border border-[rgba(255,255,255,0.1)]',
    outline:
      'bg-transparent text-[#E6E9ED] hover:bg-[#131A26] hover:text-[#FFFFFF] border border-[rgba(255,255,255,0.12)]',
    ghost:
      'bg-transparent text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26] border border-transparent',
    neon:
      'bg-[#F5A900]/10 text-[#F5A900] hover:bg-[#F5A900]/20 border border-[#F5A900]/40 shadow-[0_0_15px_rgba(245,169,0,0.15)] font-mono'
  }[variant];

  const sizeStyles = {
    xs: 'h-6 px-2 text-[11px] gap-1 rounded',
    sm: 'h-7 px-2.5 text-xs gap-1.5 rounded',
    md: 'h-8 px-3.5 text-xs gap-2 rounded-md',
    default: 'h-8 px-3.5 text-xs gap-2 rounded-md',
    lg: 'h-10 px-4 text-sm gap-2.5 rounded-md',
    icon: 'h-8 w-8 p-0 rounded-md justify-center'
  }[size];

  return (
    <animated.button
      ref={ref}
      style={springProps}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-sans tracking-wide transition-colors duration-150 select-none cursor-pointer focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </animated.button>
  );
});

Button.displayName = 'Button';
