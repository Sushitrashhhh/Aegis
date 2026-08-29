import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { HeaderNav } from './components/HeaderNav';
import { Dashboard } from './pages/Dashboard';
import { IncidentPage } from './pages/Incident';
import { ChatPage } from './pages/Chat';
import { AttackSimulatorModal } from './components/AttackSimulatorModal';
import { DeviceFleetDrawer } from './components/DeviceFleetDrawer';
import { useTelemetryWebSocket } from './hooks/useTelemetryWebSocket';
import { fetchDevices, Device } from './api/client';

const AppContent: React.FC = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [fleetOpen, setFleetOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const { status: wsStatus, lastEvent } = useTelemetryWebSocket();

  const loadDevices = async () => {
    try {
      const data = await fetchDevices();
      setDevices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E6E9ED] font-sans flex flex-col antialiased selection:bg-[#F5A900]/20 selection:text-[#F5A900]">
      <HeaderNav
        wsStatus={wsStatus}
        onOpenSimulate={() => setSimulatorOpen(true)}
        onOpenFleet={() => setFleetOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                onOpenSimulate={() => setSimulatorOpen(true)}
                onOpenFleet={() => setFleetOpen(true)}
                lastWsEvent={lastEvent}
              />
            }
          />
          <Route path="/incidents/:id" element={<IncidentPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <AttackSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onAttackTriggered={loadDevices}
      />

      <DeviceFleetDrawer
        isOpen={fleetOpen}
        onClose={() => setFleetOpen(false)}
        devices={devices}
        onDevicesUpdated={loadDevices}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
};

export default App;

