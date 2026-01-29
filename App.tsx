
import React, { useState } from 'react';
import { ModuleId, ModuleInfo } from './types';
import { MODULES, MOCK_DB, APP_VERSION } from './constants';
import FlashcardView from './components/FlashcardView';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'selection' | 'flashcards' | 'ai'>('selection');

  const startFlashcards = (module: ModuleInfo) => {
    setSelectedModule(module);
    setStudyMode('flashcards');
  };

  const startAI = (module?: ModuleInfo) => {
    if (module) setSelectedModule(module);
    setStudyMode('ai');
  };

  const handleBackToSelection = () => {
    setStudyMode('selection');
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleBackToSelection}
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none">GAS ENGINE</h1>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Version {APP_VERSION}</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-6 text-sm font-bold text-gray-500 uppercase tracking-tighter">
            <button 
              onClick={() => startAI()}
              className={`hover:text-blue-600 transition-colors ${studyMode === 'ai' ? 'text-blue-600' : ''}`}
            >
              AI Tutor
            </button>
            <a href="#" className="hover:text-blue-600 transition-colors">Resources</a>
          </div>

          <button 
             onClick={() => startAI()}
             className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        
        {studyMode === 'selection' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">가스기사 마스터 학습 엔진</h2>
              <p className="text-gray-500 text-lg">최신 출제 경향을 반영한 과목별 핵심 요약과 AI 튜터링을 통해 자격증 합격에 도전하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MODULES.map((mod) => (
                <div key={mod.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300 inline-block">{mod.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{mod.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed h-16 overflow-hidden line-clamp-3">
                    {mod.description}
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => startFlashcards(mod)}
                      className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>플래시카드 학습</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => startAI(mod)}
                      className="w-full py-3 border border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                    >
                      AI 상세 설명 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                   <h3 className="text-2xl font-bold mb-2">실시간 AI 학습 지원</h3>
                   <p className="opacity-90 max-w-lg">어려운 수식이나 복잡한 법규가 있으신가요? 제미나이 엔진 기반 AI가 24시간 실시간으로 설명해 드립니다.</p>
                 </div>
                 <button 
                   onClick={() => startAI()}
                   className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
                 >
                   AI 튜터 시작하기
                 </button>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            </div>
          </div>
        )}

        {studyMode === 'flashcards' && selectedModule && (
          <div className="space-y-6">
             <div className="flex items-center space-x-2 mb-4">
                <button 
                  onClick={handleBackToSelection}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-2xl font-black text-gray-800">{selectedModule.name} Flashcards</h2>
             </div>
             <FlashcardView 
               cards={MOCK_DB[selectedModule.id] || []} 
               onFinish={handleBackToSelection}
             />
          </div>
        )}

        {studyMode === 'ai' && (
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleBackToSelection}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-black text-gray-800">가스기사 AI 튜터링</h2>
                </div>
                {selectedModule && (
                  <div className="text-sm font-bold bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                    Topic: {selectedModule.name}
                  </div>
                )}
             </div>
             <AIChat moduleName={selectedModule?.name} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <p>© 2025 Gas Engineer Study Engine v2.5. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
