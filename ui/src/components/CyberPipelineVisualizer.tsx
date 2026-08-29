import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Activity, Search, ShieldCheck, Database, Zap, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CyberPipelineVisualizerProps {
  activeStage?: number | 'sensor' | 'rules' | 'reasoning' | 'memory' | 'containment';
  className?: string;
}

interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGlow: string;
  borderColor: string;
}

export const CyberPipelineVisualizer: React.FC<CyberPipelineVisualizerProps> = ({
  activeStage = 3,
  className
}) => {
  const numericStage = typeof activeStage === 'number'
    ? activeStage
    : {
        sensor: 1,
        rules: 2,
        reasoning: 3,
        memory: 4,
        containment: 5
      }[activeStage] || 3;

  const steps: PipelineStep[] = [
    {
      id: 1,
      title: 'Sensor Stream',
      subtitle: 'Kernel/eBPF Telemetry',
      icon: Activity,
      color: '#06B6D4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      id: 2,
      title: 'Stage 1 Rules',
      subtitle: 'Heuristic Engine',
      icon: Search,
      color: '#F5A900',
      bgGlow: 'rgba(245, 169, 0, 0.15)',
      borderColor: 'rgba(245, 169, 0, 0.4)'
    },
    {
      id: 3,
      title: 'Bedrock Claude',
      subtitle: 'Autonomous Reasoning',
      icon: ShieldCheck,
      color: '#A78BFA',
      bgGlow: 'rgba(167, 139, 250, 0.15)',
      borderColor: 'rgba(167, 139, 250, 0.4)'
    },
    {
      id: 4,
      title: 'Titan Vector Memory',
      subtitle: 'Pattern Store & Retrieval',
      icon: Database,
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      borderColor: 'rgba(56, 189, 248, 0.4)'
    },
    {
      id: 5,
      title: 'Remediation',
      subtitle: 'Subnet Isolation & Action',
      icon: Zap,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.4)'
    }
  ];

  const pulseSpring = useSpring({
    from: { opacity: 0.6, transform: 'scale(0.98)' },
    to: async (next) => {
      while (true) {
        await next({ opacity: 1, transform: 'scale(1)' });
        await next({ opacity: 0.6, transform: 'scale(0.98)' });
      }
    },
    config: { duration: 1800 }
  });

  return (
    <div
      className={cn(
        'p-3.5 sm:p-4 rounded-xl bg-[#0B0F17]/90 border border-[rgba(255,255,255,0.08)] backdrop-blur-md',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3 border-b border-[rgba(255,255,255,0.06)] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-[#E6E9ED] uppercase">
            AUTONOMOUS CYRA PIPELINE ARCHITECTURE
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#F5A900] bg-[#F5A900]/10 px-2 py-0.5 rounded border border-[#F5A900]/20">
          ZERO-HUMAN-BOTTLENECK
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = step.id <= numericStage;
          const isCurrent = step.id === numericStage;

          return (
            <div key={step.id} className="relative group">
              <div
                className={cn(
                  'p-2.5 rounded-lg border transition-all duration-300 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 h-full',
                  isCurrent
                    ? 'bg-[#131A26] border-[#F5A900]/60 shadow-[0_0_20px_rgba(245,169,0,0.18)]'
                    : isPassed
                    ? 'bg-[#0E1420]/80 border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
                    : 'bg-[#080B10]/60 border-[rgba(255,255,255,0.04)] opacity-60'
                )}
              >
                <div className="flex items-center gap-2 sm:w-full sm:justify-between">
                  <div
                    className="p-1.5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: step.bgGlow,
                      color: step.color,
                      border: `1px solid ${step.borderColor}`
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#66707C]">
                    0{step.id}
                  </span>
                </div>

                <div className="min-w-0 flex-1 sm:mt-1">
                  <div
                    className="text-xs font-semibold truncate"
                    style={{ color: isPassed ? '#E6E9ED' : '#9AA3AD' }}
                  >
                    {step.title}
                  </div>
                  <div className="text-[10px] text-[#66707C] truncate font-sans">
                    {step.subtitle}
                  </div>
                </div>

                {isCurrent && (
                  <animated.div
                    style={pulseSpring}
                    className="hidden sm:block w-full mt-1 h-0.5 bg-gradient-to-r from-transparent via-[#F5A900] to-transparent rounded"
                  />
                )}
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-[#66707C]/40">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
