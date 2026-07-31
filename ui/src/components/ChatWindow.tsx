import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { sendAgentMessage } from '../api/client';

interface ChatWindowProps {
  incidentId?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ incidentId }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: 'Greetings. I am Cyra Sentinel SOC Agent. Ask me about threat investigation details, containment status, or vector memory findings.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await sendAgentMessage(userText, incidentId);
      setMessages(prev => [...prev, { sender: 'agent', text: res.response || 'Agent processed request.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Error connecting to Cyra Agent endpoint.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <Bot className="w-4 h-4 text-cyan-400" />
        <span className="font-semibold text-xs text-slate-200">Cyra Sentinel Interactive Agent Chat</span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'agent' && (
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div className={`p-2.5 rounded-lg max-w-[80%] leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-cyan-600 text-slate-100 rounded-tr-none' 
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-slate-500 text-[11px] animate-pulse">Cyra Agent analyzing response...</div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Cyra Sentinel (e.g. 'Explain the root cause')"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-100 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
