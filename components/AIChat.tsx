
import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await generateExplanation(moduleName || "가스기사 전반", userMessage);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] md:h-[650px] rounded-3xl shadow-2xl border overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-black text-sm md:text-base leading-none">AI TUTOR</h3>
            <p className="text-[9px] opacity-70 mt-1 uppercase font-bold tracking-tighter">Powered by Gemini 3.0</p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] font-bold bg-white/10 px-2 py-1 rounded-lg">
          {moduleName || "General Mode"}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
              안녕하세요! 무엇을 도와드릴까요?<br/>가스 관련 용어, 수식, 암기법 등 무엇이든 물어보세요.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
            }`}>
              <div className="text-sm md:text-base">
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 md:p-4 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex space-x-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요..."
          className="flex-1 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-100 dark:bg-gray-800 text-sm md:text-base text-gray-900 dark:text-white"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 active:scale-90 transition-transform shadow-lg shadow-blue-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIChat;
