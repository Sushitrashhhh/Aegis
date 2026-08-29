import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Laptop, Server, AlertTriangle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Device, isolateDevice } from '../api/client';
import { useToast } from './ui/Toast';

interface DeviceFleetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  onDevicesUpdated?: () => void;
}

export const DeviceFleetDrawer: React.FC<DeviceFleetDrawerProps> = ({
  isOpen,
  onClose,
  devices,
  onDevicesUpdated
}) => {
  const { showToast } = useToast();
  const [isolatingId, setIsolatingId] = useState<string | null>(null);

  const handleIsolate = async (deviceId: string) => {
    setIsolatingId(deviceId);
    try {
      await isolateDevice(deviceId, 'Manual containment command from Fleet Console');
      showToast('Node Isolated', `Device ${deviceId} placed into network containment quarantine.`, 'warning');
      if (onDevicesUpdated) {
        onDevicesUpdated();
      }
    } catch (err: any) {
      showToast('Containment Failed', err?.message || 'Could not isolate host', 'critical');
    } finally {
      setIsolatingId(null);
    }
  };

  const getDeviceIcon = (os: string) => {
    if (os.toLowerCase().includes('server') || os.toLowerCase().includes('ubuntu')) {
      return <Server className="w-4 h-4 text-[#06B6D4]" />;
    }
    return <Laptop className="w-4 h-4 text-[#F5A900]" />;
  };

  const getStatusBadge = (status: string) => {
    if (status?.toUpperCase() === 'ISOLATED') {
      return <Badge variant="critical" size="sm" dot pulse>ISOLATED</Badge>;
    }
    return <Badge variant="success" size="sm" dot>HEALTHY</Badge>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="MONITORED ENDPOINTS FLEET"
      subtitle="Autonomous agent telemetry listeners across critical enterprise infrastructure"
      icon={<Cpu className="w-5 h-5 text-[#06B6D4]" />}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#9AA3AD] border-b border-[rgba(255,255,255,0.06)] pb-2">
          <span>{devices.length} ENDPOINTS ACTIVE</span>
          <span className="text-[#F5A900]">SUBNET CONTAINMENT TIME: &lt;500MS</span>
        </div>

        <div className="space-y-3">
          {devices.map(dev => {
            const isIsolated = dev.status?.toUpperCase() === 'ISOLATED';
            const isPending = isolatingId === dev.device_id;

            return (
              <div
                key={dev.device_id}
                className="p-4 rounded-xl bg-[#07090E] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#131A26] border border-[rgba(255,255,255,0.08)] shrink-0 mt-0.5">
                    {getDeviceIcon(dev.os)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-semibold text-xs text-[#E6E9ED]">{dev.name}</h4>
                      {getStatusBadge(dev.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[#9AA3AD]">
                      <span>ID: <strong className="text-[#E6E9ED]">{dev.device_id}</strong></span>
                      <span>IP: <strong className="text-[#06B6D4]">{dev.ip_address}</strong></span>
                      <span>OS: <strong>{dev.os}</strong></span>
                    </div>
                    <div className="text-[11px] text-[#66707C] font-sans">
                      Owner: {dev.owner} · Risk: <span className="font-mono text-[#F5A900]">{dev.criticality}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0">
                  {!isIsolated ? (
                    <Button
                      variant="critical"
                      size="xs"
                      loading={isPending}
                      onClick={() => handleIsolate(dev.device_id)}
                      leftIcon={<Zap className="w-3 h-3" />}
                    >
                      Isolate Host
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF4D5A] bg-[#FF4D5A]/10 px-2 py-1 rounded border border-[#FF4D5A]/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>QUARANTINED</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
