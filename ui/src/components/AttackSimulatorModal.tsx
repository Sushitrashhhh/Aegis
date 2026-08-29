import React, { useState } from 'react';
import { ShieldAlert, Zap, Skull, Radio, Flame, Sparkles, Check } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { simulateAttack } from '../api/client';
import { useToast } from './ui/Toast';

interface AttackSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttackTriggered?: () => void;
}

export const AttackSimulatorModal: React.FC<AttackSimulatorModalProps> = ({
  isOpen,
  onClose,
  onAttackTriggered
}) => {
  const { showToast } = useToast();
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const attacks = [
    {
      id: 'ddos' as const,
      title: 'SYN Flood DDoS Attack',
      target: 'DEV-PROD-SRV-01 (prod-web-server-01)',
      severity: 'CRITICAL',
      icon: Flame,
      color: '#FF4D5A',
      desc: 'Injects high-velocity TCP SYN packet storm on port 443 exceeding 18,500 pkts/sec threshold.',
      payloadSample: 'packet_rate: 18500, syn_flood: true, bytes_sec: 98.5MB'
    },
    {
      id: 'privesc' as const,
      title: 'Mimikatz Privilege Escalation',
      target: 'DEV-FIN-WKS-04 (finance-laptop-04)',
      severity: 'CRITICAL',
      icon: Skull,
      color: '#F5A900',
      desc: 'Executes credential dumper via cmd.exe targeting LSASS process memory to obtain SYSTEM hashes.',
      payloadSample: 'mimikatz.exe privilege::debug sekurlsa::logonpasswords'
    },
    {
      id: 'ransomware' as const,
      title: 'Ransomware Shadow Deletion',
      target: 'DEV-DB-SRV-02 (db-cluster-node-02)',
      severity: 'CRITICAL',
      icon: Zap,
      color: '#A78BFA',
      desc: 'Triggers volume shadow copy wipe followed by high-entropy file encryption on financial records.',
      payloadSample: 'vssadmin delete shadows /all /quiet & encrypter.exe'
    }
  ];

  const handleTrigger = async (type: 'ddos' | 'privesc' | 'ransomware', title: string) => {
    setLoadingType(type);
    try {
      await simulateAttack(type);
      showToast('Attack Simulation Triggered', `Streamed telemetry for ${title} to sensor rule engine.`, 'critical');
      if (onAttackTriggered) {
        onAttackTriggered();
      }
      onClose();
    } catch (err: any) {
      showToast('Simulation Failed', err?.message || 'Could not stream attack telemetry', 'critical');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SIMULATE THREAT VECTOR"
      subtitle="Stream realistic attack telemetry directly into Cyra Sentinel sensor pipeline"
      icon={<Radio className="w-5 h-5 animate-pulse" />}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-[#07090E] border border-[rgba(255,255,255,0.06)] text-xs text-[#9AA3AD] font-sans">
          Selecting a scenario will simulate sensor eBPF event telemetry, trigger Stage 1 heuristic detection rules, invoke AWS Bedrock Claude investigation, retrieve Titan vector memory, and auto-quarantine the host.
        </div>

        <div className="space-y-3">
          {attacks.map(att => {
            const Icon = att.icon;
            const isLoading = loadingType === att.id;

            return (
              <div
                key={att.id}
                className="p-4 rounded-xl bg-[#07090E] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded-lg shrink-0 border"
                      style={{
                        backgroundColor: `${att.color}15`,
                        borderColor: `${att.color}40`,
                        color: att.color
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-sans font-semibold text-xs text-[#E6E9ED]">{att.title}</h4>
                        <Badge variant="critical" size="sm">{att.severity}</Badge>
                      </div>
                      <span className="font-mono text-[11px] text-[#06B6D4] block mt-0.5">
                        Target: {att.target}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="critical"
                    size="sm"
                    loading={isLoading}
                    onClick={() => handleTrigger(att.id, att.title)}
                    leftIcon={<Zap className="w-3.5 h-3.5" />}
                  >
                    Simulate
                  </Button>
                </div>

                <p className="text-xs text-[#9AA3AD] font-sans leading-relaxed">
                  {att.desc}
                </p>

                <div className="p-2 rounded bg-[#0D121B] font-mono text-[11px] text-[#66707C] truncate border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[#F5A900]">$ </span>
                  {att.payloadSample}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
