
import React, { useState, useRef, useEffect } from 'react';
import { brainstormGameIdea } from '../services/geminiService';
import { ChatMessage } from '../types';

interface BrainstormPanelProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const BrainstormPanel: React.FC<BrainstormPanelProps> = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await brainstormGameIdea(userMsg, messages);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error: any) {
      console.error("AI Brainstorm Error:", error);
      const errorMsg = error.message || "无法连接到设计大脑。请检查网络环境或重试。";
      setMessages(prev => [...prev, { role: 'ai', content: `❌ ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="text-purple-400">●</span> AI 设计助手
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">MODEL: GEMINI-3-FLASH</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-inner'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述你的想法，或者让 AI 改进之前的方案..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainstormPanel;
