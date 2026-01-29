
import React, { useState, useEffect } from 'react';
import { ModuleInfo, Flashcard } from './types';
import { MODULES, APP_VERSION } from './constants';
import FlashcardView from './components/FlashcardView';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'selection' | 'flashcards' | 'ai'>('selection');
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlashcards = async (moduleId: string) => {
    setLoading(true);
    try {
      // id를 기반으로 json/ 폴더의 파일 페칭
      const response = await fetch(`./json/${moduleId}.json`);
      if (response.ok) {
        const data = await response.json();
        setCurrentCards(data);
      } else {
        console.error("Failed to load cards for:", moduleId);
        setCurrentCards([]);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setCurrentCards([]);
    } finally {
      setLoading(false);
    }
  };

  const startFlashcards = async (module: ModuleInfo) => {
    setSelectedModule(module);
    await fetchFlashcards(module.id);
    setStudyMode('flashcards');
  };

  const startAI = (module?: ModuleInfo) => {
    if (module) setSelectedModule(module);
    setStudyMode('ai');
  };

  const handleBackToSelection = () => {
    setStudyMode('selection');
    setSelectedModule(null);
    setCurrentCards([]);
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
            <span className="text-gray-300">|</span>
            <div className="text-blue-600 font-bold">총 {MODULES.length}개 과목</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        
        {studyMode === 'selection' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">가스기사 학습 엔진 v2.5</h2>
              <p className="text-gray-500 text-lg">마크다운 기반 전처리 엔진이 추출한 {MODULES.reduce((acc, m) => acc + m.h4Count, 0)}개의 핵심 문항으로 완벽 대비하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MODULES.map((mod) => (
                <div key={mod.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative flex flex-col">
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
                    {mod.h4Count} 핵심
                  </div>
                  <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300 inline-block">{mod.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{mod.name}</h3>
                  <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-1">
                    {mod.description}
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => startFlashcards(mod)}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>학습 시작</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => startAI(mod)}
                      className="w-full py-2 border border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all text-[11px]"
                    >
                      AI 상세 설명
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {studyMode === 'flashcards' && selectedModule && (
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleBackToSelection}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-black text-gray-800">{selectedModule.name}</h2>
                </div>
                {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
             </div>
             {!loading && currentCards.length > 0 ? (
               <FlashcardView 
                 cards={currentCards} 
                 onFinish={handleBackToSelection}
               />
             ) : (
               !loading && <div className="text-center py-20 text-gray-400">데이터를 불러오는 중이거나 파일이 없습니다.</div>
             )}
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
             </div>
             <AIChat moduleName={selectedModule?.name} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[11px] gap-4">
          <p>© 2025 Gas Engineer Study Engine v2.5. Data Preprocessed with Heading 4 Analysis.</p>
          <div className="flex space-x-6">
            <span>총 {MODULES.reduce((acc, m) => acc + m.h4Count, 0)}개의 핵심 체크포인트</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
