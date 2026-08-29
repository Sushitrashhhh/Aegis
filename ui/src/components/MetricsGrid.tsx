import React from 'react';
import { ShieldAlert, Cpu, Zap, Database, TrendingUp, Radio } from 'lucide-react';
import { Card } from './ui/Card';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Badge } from './ui/Badge';
import { Incident, Device } from '../api/client';

interface MetricsGridProps {
  incidents: Incident[];
  devices: Device[];
  onOpenFleet?: () => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  incidents,
  devices,
  onOpenFleet
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const isolatedCount = devices.filter(d => d.status === 'ISOLATED').length;
  const memoryCount = incidents.reduce((acc, inc) => {
    return acc + (inc.ai_reasoning?.similar_threats?.length || 1);
  }, 3);

  const metrics = [
    {
      title: 'Active Threats',
      value: activeIncidents.length,
      subtitle: `${criticalCount} High / Critical severity`,
      icon: ShieldAlert,
      color: '#FF4D5A',
      glowColor: 'critical' as const,
      trend: activeIncidents.length > 0 ? '+ Live' : 'Nominal',
      trendVariant: activeIncidents.length > 0 ? ('critical' as const) : ('success' as const)
    },
    {
      title: 'Endpoints Monitored',
      value: devices.length,
      subtitle: 'Real-time telemetry stream',
      icon: Cpu,
      color: '#06B6D4',
      glowColor: 'cyan' as const,
      trend: '100% Online',
      trendVariant: 'info' as const,
      onClick: onOpenFleet
    },
    {
      title: 'Contained Nodes',
      value: isolatedCount,
      subtitle: `${isolatedCount} hosts in network quarantine`,
      icon: Zap,
      color: '#F5A900',
      glowColor: 'amber' as const,
      trend: isolatedCount > 0 ? 'Quarantined' : 'Zero Active',
      trendVariant: isolatedCount > 0 ? ('amber' as const) : ('outline' as const)
    },
    {
      title: 'Titan Vector Memory',
      value: memoryCount,
      subtitle: 'Indexed attack vectors & lessons',
      icon: Database,
      color: '#10B981',
      glowColor: 'emerald' as const,
      trend: 'Titan v2 Engine',
      trendVariant: 'success' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card
            key={idx}
            glowColor={metric.glowColor}
            tilt={true}
            onClick={metric.onClick}
            className={`p-4 transition-all duration-200 ${
              metric.onClick ? 'cursor-pointer hover:border-[rgba(255,255,255,0.2)]' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-medium text-[#9AA3AD] uppercase tracking-wider">
                  {metric.title}
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#E6E9ED] flex items-center gap-1">
                  <AnimatedNumber value={metric.value} />
                </div>
              </div>
              <div
                className="p-2.5 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${metric.color}15`,
                  borderColor: `${metric.color}40`,
                  color: metric.color
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#66707C] font-sans truncate mr-1">
                {metric.subtitle}
              </span>
              <Badge variant={metric.trendVariant} size="sm" dot={metric.trendVariant === 'critical' || metric.trendVariant === 'amber'}>
                {metric.trend}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
