import React from 'react';
import { animated, useSpring } from '@react-spring/web';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const { val } = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { mass: 1, tension: 170, friction: 26 }
  });

  return (
    <animated.span className={`tabular-nums font-mono ${className}`}>
      {val.to(n => `${prefix}${n.toFixed(decimals)}${suffix}`)}
    </animated.span>
  );
};
