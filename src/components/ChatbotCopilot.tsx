import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCcw, 
  Compass, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { ChatMessage, MasterProfile, ApplicationRecord } from '../types';

interface ChatbotCopilotProps {
  profile: MasterProfile;
  applications: ApplicationRecord[];
  onNavigateToMatches: () => void;
  onNavigateToTailor: () => void;
}

export const ChatbotCopilot: React.FC<ChatbotCopilotProps> = ({
  profile,
  applications,
  onNavigateToMatches,
  onNavigateToTailor
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: `Hello ${profile.personalInfo.fullName.split(' ')[0] || 'there'}! I am your AI Data Analytics Career Copilot. I have reviewed your master profile and active application pipeline.

I can help you:
• **Analyze your resume** and suggest high-impact Data Analyst, BI, or Analytics Engineer positions.
• **Simulate technical interview questions** (SQL queries, A/B testing trade-offs, Tableau/Power BI DAX).
• **Tailor application answers** to stand out to recruiters without hallucinating fake experience.
• **Diagnose skill gaps** from your rejected applications to boost your shortlist rate.

What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    "What jobs best fit my verified skills?",
    "Simulate a SQL technical interview question",
    "How can I improve my resume for a BI role?",
    "Why are employers rejecting my applications?",
    "Help me answer: Why do you want to work here?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I'm here to support your job search! Let's explore your best opportunities.";

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedMessages, modelMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "I encountered a momentary connection issue. You can continue our conversation or select a quick prompt below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Chat restarted! How can I assist your Data Analytics career strategy right now, ${profile.personalInfo.fullName.split(' ')[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="card-3d-elevated bg-white/95 border border-[rgba(218,196,156,0.45)] rounded-3xl flex flex-col h-[700px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-[rgba(218,196,156,0.35)] flex items-center justify-between bg-gradient-to-r from-white via-[#FAF7F0] to-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#E6CA96] to-[#C89F56] border border-[#B88E44] flex items-center justify-center text-white shadow-[0_3px_10px_rgba(200,159,86,0.3)]">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-[#2A2318]">DataPulse AI Career Copilot</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
            </div>
            <p className="text-[11px] text-[#7A6F5D]">
              Powered by Gemini • Context-aware of your verified master profile
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToMatches}
            className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl btn-white-3d text-[#6A572F] text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-[#B88E44]" />
            <span>Recommended Jobs</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-2 text-[#7A6F5D] hover:text-[#2A2318] rounded-xl hover:bg-[#F4EFE6] transition-colors"
            title="Reset conversation"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-[#FAF8F5]/50 to-white/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-b from-[#D8B470] to-[#B68B40] text-white border border-[#9E752D]'
                  : 'bg-[#FAF4EA] text-[#8C6D2D] border border-[rgba(218,196,156,0.6)]'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-b from-[#FAF2E2] to-[#F3E6CE] border border-[#DFCBA7] text-[#332A1B] shadow-[0_2px_8px_rgba(200,160,88,0.15)]'
                  : 'card-3d bg-white text-[#2C2519] border border-[rgba(218,196,156,0.4)]'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.role === 'user' ? 'text-[#8C7A5D]' : 'text-[#9A8F7E]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF4EA] text-[#8C6D2D] border border-[rgba(218,196,156,0.6)] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="card-3d bg-white border border-[rgba(218,196,156,0.4)] rounded-2xl px-4 py-3 text-xs text-[#7A6F5D] flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#C89F56] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[#C89F56] animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-[#C89F56] animate-bounce [animation-delay:0.4s]"></div>
              <span className="ml-1 text-[11px] text-[#7A6F5D]">Gemini is formulating tailored career insights...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-[#FAF7F0] border-t border-[rgba(218,196,156,0.35)] overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7C68] shrink-0">
          Try asking:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F7EFE1] border border-[rgba(218,196,156,0.5)] text-[#5C503D] hover:text-[#2A2318] text-[11px] whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-white border-t border-[rgba(218,196,156,0.35)]">
        <div className="flex items-center space-x-2 bg-[#FAF7F0] border border-[rgba(218,196,156,0.5)] rounded-2xl px-3 py-1.5 focus-within:border-[#C89F56] focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(200,159,86,0.15)] transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your data analyst career, resume tailoring, or interview prep..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#2A2318] placeholder-[#9E9280] focus:outline-none py-1.5"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="btn-gold-3d p-2 rounded-xl disabled:opacity-40 text-white transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
