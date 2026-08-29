import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, MessageSquare, Sparkles, Cpu, Radio } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { TelemetryWSStatus } from '../hooks/useTelemetryWebSocket';

interface HeaderNavProps {
  wsStatus?: TelemetryWSStatus;
  onOpenSimulate?: () => void;
  onOpenFleet?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  wsStatus = 'connected',
  onOpenSimulate,
  onOpenFleet
}) => {
  const location = useLocation();

  const isDashboardActive = location.pathname === '/' || location.pathname.startsWith('/incidents');
  const isChatActive = location.pathname === '/chat';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 border-b border-[rgba(255,255,255,0.08)] backdrop-blur-md text-[#E6E9ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none">
          <div className="w-8 h-8 rounded-lg bg-[#F5A900]/10 border border-[#F5A900]/40 flex items-center justify-center text-[#F5A900] shadow-[0_0_15px_rgba(245,169,0,0.2)] group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#E6E9ED]">
              <span>CYRA SENTINEL</span>
              <span className="text-[#66707C]">//</span>
              <span className="text-[10px] text-[#F5A900]">SOC AGENT</span>
            </div>
            <span className="text-[10px] text-[#66707C] font-mono leading-none">
              AUTONOMOUS INVESTIGATION & CONTAINMENT
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#07090E] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
          <Link
            to="/"
            className={`px-3.5 py-1.5 flex items-center gap-2 text-xs font-medium rounded-md transition-all ${
              isDashboardActive
                ? 'bg-[#131A26] text-[#E6E9ED] shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]'
                : 'text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]/50'
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${isDashboardActive ? 'text-[#F5A900]' : 'text-[#9AA3AD]'}`} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/chat"
            className={`px-3.5 py-1.5 flex items-center gap-2 text-xs font-medium rounded-md transition-all ${
              isChatActive
                ? 'bg-[#131A26] text-[#E6E9ED] shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]'
                : 'text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]/50'
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${isChatActive ? 'text-[#F5A900]' : 'text-[#9AA3AD]'}`} />
            <span>Agent Console</span>
          </Link>
        </nav>

        {/* Action Controls & Telemetry Heartbeat */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenFleet && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenFleet}
              leftIcon={<Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />}
              className="hidden sm:inline-flex text-[11px]"
            >
              Endpoints
            </Button>
          )}

          {onOpenSimulate && (
            <Button
              variant="neon"
              size="sm"
              onClick={onOpenSimulate}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#F5A900]" />}
              className="text-[11px]"
            >
              Simulate Attack
            </Button>
          )}

          {/* WebSocket Status Indicator */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] bg-[#07090E] px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
            <span
              className={`w-2 h-2 rounded-full ${
                wsStatus === 'connected'
                  ? 'bg-[#10B981] radar-ping'
                  : wsStatus === 'connecting'
                  ? 'bg-[#F5A900] animate-pulse'
                  : 'bg-[#FF4D5A]'
              }`}
            />
            <span className="text-[#9AA3AD] text-[10px] uppercase">
              {wsStatus === 'connected' ? 'LIVE TELEMETRY' : wsStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
