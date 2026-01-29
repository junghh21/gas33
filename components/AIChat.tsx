
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { generateExplanation } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  moduleName?: string;
}

const AIChat: React.FC<Props> = ({ moduleName }) => {
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
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <h3 className="font-bold">AI 학습 가이드 {moduleName ? `- ${moduleName}` : ''}</h3>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">Gemini Flash 3.0</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="mb-2">안녕하세요! 가스기사 학습을 도와드리는 AI 튜터입니다.</p>
            <p className="text-sm">궁금한 용어나 수식, 기출문제 풀이를 물어보세요.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-100'
            }`}>
              <MarkdownRenderer content={msg.content} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse text-gray-400">
              답변을 생각하고 있습니다...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex space-x-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요... ($KaTeX$ 수식 지원)"
          className="flex-1 bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIChat;
