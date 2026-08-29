import React, { useState, useRef, useEffect } from 'react';
import { useTransition, animated, config } from '@react-spring/web';
import { Send, Bot, User, Sparkles, Copy, Check, Terminal, ShieldAlert } from 'lucide-react';
import { sendAgentMessage } from '../api/client';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useToast } from './ui/Toast';

interface ChatWindowProps {
  incidentId?: string;
  className?: string;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'Explain the root cause and kill chain',
  'What containment actions are recommended?',
  'Search Titan vector memory for similar attack patterns',
  'Summarize suspect process hierarchy'
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ incidentId, className = '' }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: incidentId
        ? `Cyra Sentinel interactive analyst console engaged. Focused on incident **${incidentId}**. Ask for forensic breakdown, containment advice, or historical threat correlation.`
        : 'Cyra Sentinel interactive analyst console engaged. I am ready to query vector memory, explain detection heuristics, and assist with active telemetry investigation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const transitions = useTransition(messages, {
    keys: item => item.id,
    from: { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: config.stiff
  });

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAgentMessage(userMsg.text, incidentId);
      const agentMsg: MessageItem = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.response || 'Agent finished processing query with no output.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `⚠️ **Error communicating with Cyra Bedrock agent:** ${err?.message || 'Check backend connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(input);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Agent response copied.'
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`flex flex-col h-[560px] bg-[#07090E] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}>
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#0B0F17] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F5A900]/10 border border-[#F5A900]/40 flex items-center justify-center text-[#F5A900]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs tracking-wider text-[#E6E9ED]">
                CYRA BEDROCK COPILOT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] radar-ping" />
            </div>
            <span className="text-[10px] text-[#66707C] font-mono">
              AWS Bedrock Claude 3.5 + Titan Vector Engine
            </span>
          </div>
        </div>

        {incidentId && (
          <Badge variant="warning" size="sm" dot>
            CONTEXT: {incidentId}
          </Badge>
        )}
      </div>

      {/* Suggested quick chips */}
      <div className="px-3 py-2 bg-[#0A0D14] border-b border-[rgba(255,255,255,0.04)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-[#66707C] uppercase shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3 text-[#F5A900]" /> Suggestions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loading}
            onClick={() => handleSendText(prompt)}
            className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-[#131A26] hover:bg-[#1C2638] text-[#9AA3AD] hover:text-[#E6E9ED] border border-[rgba(255,255,255,0.06)] hover:border-[#F5A900]/40 transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs scrollbar-thin">
        {transitions((style, item) => (
          <animated.div
            style={style}
            className={`flex items-start gap-2.5 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {item.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-[#F5A900]/10 border border-[#F5A900]/30 flex items-center justify-center text-[#F5A900] shrink-0 mt-0.5 shadow-[0_0_10px_rgba(245,169,0,0.15)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-xl max-w-[84%] relative group transition-all ${
                item.sender === 'user'
                  ? 'bg-gradient-to-r from-[#1E293B] to-[#162032] border border-[#F5A900]/30 text-[#E6E9ED] rounded-tr-none shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'bg-[#0E131F] border border-[rgba(255,255,255,0.08)] text-[#E6E9ED] rounded-tl-none shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1.5">
                <span className="text-[10px] font-mono font-medium tracking-wider text-[#F5A900]">
                  {item.sender === 'user' ? 'SOC ANALYST' : 'CYRA INVESTIGATION ENGINE'}
                </span>
                <span className="text-[9px] font-mono text-[#66707C]">
                  {item.timestamp}
                </span>
              </div>

              <div className="text-xs text-[#CBD5E1] leading-relaxed whitespace-pre-wrap selection:bg-[#F5A900]/30">
                {item.text}
              </div>

              {item.sender === 'agent' && (
                <button
                  type="button"
                  onClick={() => copyMessage(item.id, item.text)}
                  className="absolute bottom-2 right-2 p-1 rounded bg-[#131A26]/80 text-[#66707C] hover:text-[#E6E9ED] opacity-0 group-hover:opacity-100 transition-opacity border border-[rgba(255,255,255,0.06)]"
                  title="Copy to clipboard"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {item.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#162032] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#E6E9ED] shrink-0 mt-0.5">
                <User className="w-4 h-4 text-[#9AA3AD]" />
              </div>
            )}
          </animated.div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-[#9AA3AD] font-mono text-xs pl-9 py-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F5A900] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#F5A900] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#F5A900] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px] tracking-wider text-[#F5A900]">
              QUERYING CLAUDE & TITAN VECTOR MEMORY...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-[#0B0F17] border-t border-[rgba(255,255,255,0.08)] flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Cyra Sentinel (e.g., 'What is the MITRE technique?', 'Is host quarantined?')..."
            className="w-full bg-[#07090E] border border-[rgba(255,255,255,0.1)] focus:border-[#F5A900]/60 rounded-lg px-3.5 py-2 text-xs font-sans text-[#E6E9ED] placeholder-[#66707C] focus:outline-none transition-all shadow-inner"
          />
        </div>
        <Button
          type="submit"
          variant="neon"
          size="md"
          disabled={loading || !input.trim()}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

