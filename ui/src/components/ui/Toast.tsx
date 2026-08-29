import React, { createContext, useContext, useState, useCallback } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'critical' | 'danger' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  toast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = useCallback((options: ToastOptions) => {
    showToast(options.title, options.message, options.type, options.duration);
  }, [showToast]);

  const transitions = useTransition(toasts, {
    keys: item => item.id,
    from: { opacity: 0, transform: 'translateY(-20px) scale(0.9)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    config: { tension: 350, friction: 25 }
  });

  const getIcon = (type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />;
      case 'critical':
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-[#FF4D5A] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F5A900] shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#06B6D4] shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        return 'border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'critical':
      case 'danger':
        return 'border-[#FF4D5A]/40 shadow-[0_0_15px_rgba(255,77,90,0.25)]';
      case 'warning':
        return 'border-[#F5A900]/40 shadow-[0_0_15px_rgba(245,169,0,0.2)]';
      default:
        return 'border-[#06B6D4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {transitions((style, toast) => (
          <animated.div
            style={style}
            className={cn(
              'pointer-events-auto p-3.5 rounded-lg bg-[#0D121B]/95 backdrop-blur-md border flex items-start gap-3 text-xs',
              getBorderColor(toast.type)
            )}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="font-mono font-semibold text-[#E6E9ED] text-xs">{toast.title}</div>
              {toast.message && <p className="text-[#9AA3AD] font-sans text-xs leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#66707C] hover:text-[#E6E9ED] transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </animated.div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
