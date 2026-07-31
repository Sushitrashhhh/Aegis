import React from 'react';
import { ChatWindow } from '../components/ChatWindow';

export const ChatPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
        <h1 className="text-lg font-bold text-slate-100">Cyra Sentinel Interactive AI Console</h1>
        <p className="text-xs text-slate-400">Direct interface to query agent memory, request device history, and trigger containment.</p>
      </div>
      <ChatWindow />
    </div>
  );
};
