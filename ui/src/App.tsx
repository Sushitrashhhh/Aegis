import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, MessageSquare } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { IncidentPage } from './pages/Incident';
import { ChatPage } from './pages/Chat';

const HeaderNav: React.FC = () => {
  const location = useLocation();

  const isDashboardActive = location.pathname === '/' || location.pathname.startsWith('/incidents');
  const isChatActive = location.pathname === '/chat';

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117] border-b border-[rgba(255,255,255,0.08)] text-[#E6E9ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#F5A900] shrink-0" />
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[#E6E9ED]">
            <span>CYRA SENTINEL</span>
            <span className="text-[#66707C]">//</span>
            <span className="text-[11px] text-[#9AA3AD]">SOC AGENT</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 h-full">
          <Link
            to="/"
            className={`h-full px-3.5 flex items-center gap-2 text-xs font-medium tracking-wide transition-all border-b-2 ${
              isDashboardActive
                ? 'border-[#F5A900] text-[#E6E9ED] bg-[#131822]'
                : 'border-transparent text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131822]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#9AA3AD]" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/chat"
            className={`h-full px-3.5 flex items-center gap-2 text-xs font-medium tracking-wide transition-all border-b-2 ${
              isChatActive
                ? 'border-[#F5A900] text-[#E6E9ED] bg-[#131822]'
                : 'border-transparent text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131822]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#9AA3AD]" />
            <span>Agent Chat</span>
          </Link>
        </nav>

        {/* System Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#9AA3AD]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#36C98F]" />
          <span>AUTONOMOUS ACTIVE</span>
        </div>
      </div>
    </header>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#07090C] text-[#E6E9ED] font-sans flex flex-col antialiased">
        <HeaderNav />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents/:id" element={<IncidentPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
