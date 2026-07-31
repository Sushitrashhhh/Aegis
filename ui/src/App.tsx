import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, MessageSquare, Terminal } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { IncidentPage } from './pages/Incident';
import { ChatPage } from './pages/Chat';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold">
                <Shield className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CYRA SENTINEL
                </span>
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  HACKATHON SOC AGENT
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 flex items-center gap-1.5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/chat"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Agent Chat</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
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
