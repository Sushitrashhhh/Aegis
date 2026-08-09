import React from 'react';
import { ChatWindow } from '../components/ChatWindow';

export const ChatPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="p-3.5 bg-[#0D1117] border border-[rgba(255,255,255,0.08)] rounded space-y-0.5">
        <h1 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E6E9ED] flex items-center gap-2">
          <span className="text-[#F5A900]">//</span>
          <span>CYRA SENTINEL INTERACTIVE AGENT CONSOLE</span>
        </h1>
        <p className="text-xs text-[#9AA3AD] font-sans">
          Direct operational interface to query vector agent memory, inspect threat reasoning, and command host containment actions.
        </p>
      </div>
      <ChatWindow />
    </div>
  );
};
