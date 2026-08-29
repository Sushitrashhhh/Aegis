import React, { useEffect } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.94) translateY(12px)' },
    enter: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    leave: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    config: { mass: 0.8, tension: 350, friction: 30 }
  });

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  }[maxWidth];

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Animated Backdrop */}
              <animated.div
                style={{ opacity: style.opacity }}
                onClick={onClose}
                className="fixed inset-0 bg-[#05070A]/85 backdrop-blur-md transition-opacity"
              />

              {/* Animated Modal Container */}
              <animated.div
                style={style}
                className={cn(
                  'relative z-10 w-full bg-[#0D121B] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden',
                  maxWidthClass
                )}
              >
                {/* Header */}
                {(title || icon) && (
                  <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[rgba(255,255,255,0.08)] bg-[#131A26]/50">
                    <div className="flex items-center gap-3">
                      {icon && (
                        <div className="p-2 rounded-lg bg-[#F5A900]/10 border border-[#F5A900]/30 text-[#F5A900]">
                          {icon}
                        </div>
                      )}
                      <div>
                        {title && <h2 className="text-sm font-semibold text-[#E6E9ED] tracking-wide">{title}</h2>}
                        {subtitle && <p className="text-xs text-[#9AA3AD] font-sans mt-0.5">{subtitle}</p>}
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-md text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26] transition-colors focus-visible:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6">{children}</div>
              </animated.div>
            </div>
          )
      )}
    </>
  );
};
