import React, { useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  spotlight?: boolean;
  glowColor?: 'amber' | 'cyan' | 'critical' | 'emerald' | 'violet';
  tilt?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glowOnHover = true,
  spotlight = false,
  glowColor = 'amber',
  tilt = false,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const [tiltStyle, setTilt] = useSpring(() => ({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, opacity: 1 });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      setTilt({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)` });
    }
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, opacity: 0 }));
    if (tilt) {
      setTilt({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
    }
  };

  const glowRgb = {
    amber: '245, 169, 0',
    cyan: '6, 182, 212',
    critical: '255, 77, 90',
    emerald: '16, 185, 129',
    violet: '139, 92, 246'
  }[glowColor];

  return (
    <animated.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? tiltStyle : undefined}
      className={cn(
        'relative rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0D121B]/90 backdrop-blur-md overflow-hidden transition-colors duration-200',
        className
      )}
      {...props}
    >
      {glowOnHover && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${glowRgb}, 0.12), transparent 80%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </animated.div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 pb-2 flex flex-col space-y-1.5', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-sm font-semibold tracking-tight text-[#E6E9ED]', className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs text-[#9AA3AD] leading-relaxed', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 pt-2', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 pt-0 flex items-center justify-between', className)} {...props} />
);
