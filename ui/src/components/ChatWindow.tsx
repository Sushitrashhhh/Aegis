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
    <div className="flex flex-col h-[450px] bg-[#0D1117] rounded border border-[rgba(255,255,255,0.08)] overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-[#07090C] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#F5A900]" />
          <span className="font-mono font-semibold text-xs uppercase tracking-wider text-[#E6E9ED]">
            CYRA AGENT INTERACTIVE CONSOLE
          </span>
        </div>
        {incidentId && (
          <span className="font-mono text-[11px] text-[#F5A900] bg-[#F5A900]/10 px-2 py-0.5 rounded border border-[#F5A900]/20">
            CONTEXT: {incidentId}
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'agent' && (
              <div className="w-6 h-6 rounded bg-[#F5A900]/10 border border-[#8A6300]/40 flex items-center justify-center text-[#F5A900] shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#131822] border border-[#8A6300]/40 text-[#E6E9ED] rounded-tr-none'
                  : 'bg-[#07090C] border border-[rgba(255,255,255,0.08)] text-[#E6E9ED] rounded-tl-none font-sans'
              }`}
            >
              <div className="text-[10px] font-mono text-[#66707C] mb-1 uppercase tracking-wider">
                {m.sender === 'user' ? 'ANALYST COMMAND' : 'CYRA AGENT'}
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-[#131822] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#E6E9ED] shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[#66707C] font-mono text-xs pl-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A900] animate-pulse" />
            <span>CYRA AGENT ANALYZING TELEMETRY...</span>
          </div>
        )}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSend} className="p-2.5 bg-[#07090C] border-t border-[rgba(255,255,255,0.08)] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Command Cyra Sentinel (e.g. 'Explain the root cause')..."
          className="flex-1 bg-[#0D1117] border border-[rgba(255,255,255,0.08)] rounded px-3 py-1.5 text-xs font-sans text-[#E6E9ED] placeholder-[#66707C] focus:outline-none focus:border-[#F5A900]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3.5 py-1.5 rounded bg-[#F5A900]/10 border border-[#F5A900] text-[#F5A900] hover:bg-[#F5A900] hover:text-[#07090C] text-xs font-mono font-semibold transition-colors focus-visible:outline-none disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SEND</span>
        </button>
      </form>
    </div>
  );
};
