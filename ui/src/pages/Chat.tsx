import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Database, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { ChatWindow } from '../components/ChatWindow';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchIncidents, Incident } from '../api/client';

export const ChatPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchIncidents().then(setIncidents).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <Card spotlight className="p-5 bg-gradient-to-br from-[#0B0F17] to-[#07090E] border-[rgba(255,255,255,0.09)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm" dot>
                BEDROCK AI COPILOT
              </Badge>
              <span className="font-mono text-xs text-[#66707C]">//</span>
              <span className="font-mono text-xs font-bold text-[#E6E9ED]">
                AUTONOMOUS THREAT REASONING CONSOLE
              </span>
            </div>
            <p className="text-xs text-[#9AA3AD] font-sans max-w-2xl">
              Engage directly with the Bedrock Claude 3.5 investigation agent. Ask forensic questions, verify MITRE ATT&CK kill-chain mapping, or query Titan vector memory for similar attack patterns.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] bg-[#07090E] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
            <Database className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[#9AA3AD]">TITAN VECTOR STORE:</span>
            <span className="text-[#10B981] font-semibold">ONLINE</span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Incident Selector & Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Incident Context Picker (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 bg-[#0B0F17] border-[rgba(255,255,255,0.08)] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6E9ED] flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F5A900]" />
                <span>ACTIVE INCIDENTS</span>
              </h2>
              <span className="text-[10px] font-mono text-[#66707C]">
                {incidents.length} LOADED
              </span>
            </div>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedIncidentId(undefined)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
                  selectedIncidentId === undefined
                    ? 'bg-[#131A26] border-[#F5A900]/40 text-[#F5A900] shadow-[0_0_10px_rgba(245,169,0,0.1)]'
                    : 'bg-[#07090E] border-[rgba(255,255,255,0.04)] text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">GLOBAL THREAT CONTEXT</span>
                  <Sparkles className="w-3 h-3 text-[#F5A900]" />
                </div>
                <div className="text-[10px] text-[#66707C] mt-0.5 font-sans">
                  Query fleet-wide memory and general SOC knowledge
                </div>
              </button>

              {incidents.map(inc => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
                    selectedIncidentId === inc.id
                      ? 'bg-[#131A26] border-[#F5A900]/40 text-[#F5A900] shadow-[0_0_10px_rgba(245,169,0,0.1)]'
                      : 'bg-[#07090E] border-[rgba(255,255,255,0.04)] text-[#9AA3AD] hover:text-[#E6E9ED] hover:bg-[#131A26]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate">#{inc.id} - {inc.attack_type?.toUpperCase()}</span>
                    <span className={`text-[10px] uppercase font-bold ${
                      inc.severity === 'CRITICAL' ? 'text-[#FF4D5A]' : 'text-[#F5A900]'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#CBD5E1] font-sans truncate mt-0.5">
                    {inc.title}
                  </div>
                  <div className="text-[10px] text-[#66707C] font-mono mt-1 flex items-center justify-between">
                    <span>HOST: {inc.device_id}</span>
                    <span>CONF: {Math.round(inc.confidence * 100)}%</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* AI Capability Card */}
          <Card className="p-4 bg-[#0B0F17] border-[rgba(255,255,255,0.06)] space-y-2 text-xs">
            <h3 className="font-mono text-[11px] font-bold text-[#E6E9ED] uppercase flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#F5A900]" />
              <span>AGENT PIPELINE ARCHITECTURE</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] text-[#9AA3AD] font-sans list-disc list-inside">
              <li>Deterministic Stage 1 heuristic rule engine</li>
              <li>Amazon Bedrock Claude 3.5 Sonnet reasoning</li>
              <li>Amazon Titan 1536-dim vector embeddings</li>
              <li>Autonomous host isolation and rollback</li>
            </ul>
          </Card>
        </div>

        {/* Right Main Column: Chat Window (8 cols) */}
        <div className="lg:col-span-8">
          <ChatWindow incidentId={selectedIncidentId} />
        </div>
      </div>
    </div>
  );
};

