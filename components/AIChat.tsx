
import React, { useState, useEffect, useRef } from 'https://esm.sh/react@19.0.0';
import { ChatMessage } from '../types';
import { generateExplanation } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  moduleName?: string;
  onBack: () => void;
}

const AIChat: React.FC<Props> = ({ moduleName, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "핵심 공식 요약해줘",
    "시험에 자주 나오는 포인트는?",
    "암기 팁 알려줘",
    "연소의 3요소 설명해줘"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateExplanation(moduleName || "가스기사 전반", userMessage);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] md:h-[700px] rounded-[2rem] shadow-2xl border overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="bg-blue-600 p-5 text-white flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-black text-base leading-none tracking-tight italic">GAS TUTOR</h3>
            <p className="text-[10px] opacity-70 mt-1 uppercase font-black tracking-widest">AI Expert Engine v3.0</p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] font-black bg-blue-700/50 px-3 py-1.5 rounded-xl border border-blue-500/30">
          {moduleName || "General Learning Mode"}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/20 rotate-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black tracking-tight dark:text-white">가스기사 마스터 튜터입니다</h4>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                {moduleName ? `[${moduleName}] 분야에 대해 궁금한 점이 있으신가요?` : "가스기사 전 범위에 대해 무엇이든 물어보세요."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {quickPrompts.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(p)}
                  className="p-3 text-[11px] font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-blue-500 transition-all active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-800 rounded-tl-none'
            }`}>
              <div className="text-sm md:text-base leading-relaxed">
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] px-6 py-4 shadow-sm border border-gray-100 dark:border-gray-800 flex space-x-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-4 md:p-6 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 relative z-10">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="가스 전공 지식을 물어보세요..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:grayscale active:scale-90 transition-all shadow-xl shadow-blue-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
