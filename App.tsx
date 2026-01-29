
import React, { useState, useEffect } from 'react';
import { ModuleInfo, Flashcard } from './types';
import { MODULES, APP_VERSION } from './constants';
import FlashcardView from './components/FlashcardView';
import AIChat from './components/AIChat';
import CardListView from './components/CardListView';

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'selection' | 'flashcards' | 'ai' | 'list'>('selection');
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalShuffleMode, setTotalShuffleMode] = useState(false);

  const fetchFlashcards = async (moduleId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`./json/${moduleId}.json`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startFlashcards = async (module: ModuleInfo) => {
    setSelectedModule(module);
    setTotalShuffleMode(false);
    const cards = await fetchFlashcards(module.id);
    setCurrentCards(cards);
    setStudyMode('flashcards');
  };

  const startListView = async (module: ModuleInfo) => {
    setSelectedModule(module);
    setTotalShuffleMode(false);
    const cards = await fetchFlashcards(module.id);
    setCurrentCards(cards);
    setStudyMode('list');
  };

  const startTotalShuffle = async () => {
    setLoading(true);
    setTotalShuffleMode(true);
    try {
      const allCardsPromises = MODULES.map(m => fetchFlashcards(m.id));
      const results = await Promise.all(allCardsPromises);
      const combinedCards = results.flat();
      setCurrentCards(combinedCards);
      setStudyMode('flashcards');
    } catch (error) {
      console.error("Error in total shuffle:", error);
    } finally {
      setLoading(false);
    }
  };

  const startAI = (module?: ModuleInfo) => {
    if (module) setSelectedModule(module);
    setStudyMode('ai');
  };

  const handleBackToSelection = () => {
    setStudyMode('selection');
    setSelectedModule(null);
    setCurrentCards([]);
    setTotalShuffleMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
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
              <h1 className="text-xl font-black text-gray-900 leading-none tracking-tighter">GAS ENGINE</h1>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Version {APP_VERSION}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-gray-500 tracking-tighter">
            <button 
              onClick={() => startAI()}
              className={`hover:text-blue-600 transition-colors flex items-center space-x-1 ${studyMode === 'ai' ? 'text-blue-600' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>AI Tutor</span>
            </button>
            <span className="text-gray-300">|</span>
            <div className="text-blue-600 font-black">총 {MODULES.reduce((acc, m) => acc + m.h4Count, 0)}문항</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        
        {studyMode === 'selection' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                Gas Engineer Certification Exam Helper
              </div>
              <h2 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">가스기사 학습 엔진 v2.5</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                마크다운 데이터에서 추출된 <span className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-4">{MODULES.reduce((acc, m) => acc + m.h4Count, 0)}개</span>의 핵심 문항으로 자격증을 완벽히 정복하세요.
              </p>
              
              <div className="pt-4 flex flex-col md:flex-row justify-center gap-4">
                <button 
                  onClick={startTotalShuffle}
                  disabled={loading}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center space-x-3 group active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-6 h-6 text-blue-400 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>전 범위 무작위 통합 학습</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MODULES.map((mod) => (
                <div key={mod.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all group relative flex flex-col">
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full border border-blue-100">
                    {mod.h4Count} 핵심
                  </div>
                  <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 inline-block drop-shadow-sm">{mod.icon}</div>
                  <h3 className="text-xl font-black mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{mod.name}</h3>
                  <p className="text-gray-400 text-xs mb-6 leading-relaxed flex-1 font-medium">
                    {mod.description}
                  </p>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => startFlashcards(mod)}
                      className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 active:scale-95"
                    >
                      <span>플래시카드</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => startListView(mod)}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>리스트 보기</span>
                      </button>
                      <button 
                        onClick={() => startAI(mod)}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>AI 과외</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {studyMode === 'flashcards' && currentCards.length > 0 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleBackToSelection}
                    className="p-2 hover:bg-white rounded-full transition-all border border-gray-100 shadow-sm"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {totalShuffleMode ? '전 범위 통합 학습' : selectedModule?.name}
                    </h2>
                    {totalShuffleMode && <p className="text-xs text-blue-600 font-black tracking-widest uppercase">Total Shuffled Deck</p>}
                  </div>
                </div>
                {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
             </div>
             <FlashcardView 
               cards={currentCards} 
               onFinish={handleBackToSelection}
             />
          </div>
        )}

        {studyMode === 'list' && selectedModule && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardListView 
              cards={currentCards} 
              moduleName={selectedModule.name} 
              onBack={handleBackToSelection} 
            />
          </div>
        )}

        {studyMode === 'ai' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleBackToSelection}
                    className="p-2 hover:bg-white rounded-full transition-all border border-gray-100 shadow-sm"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">가스기사 AI 튜터링</h2>
                </div>
             </div>
             <AIChat moduleName={selectedModule?.name} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[11px] gap-8">
          <div className="flex items-center space-x-4">
             <div className="font-black text-gray-800 text-base tracking-tighter">GAS ENGINE</div>
             <span className="h-4 w-px bg-gray-100"></span>
             <p>© 2025 Gas Engineer Learning System v2.5</p>
          </div>
          <div className="flex space-x-8 font-bold uppercase tracking-widest">
            <div className="flex flex-col items-center md:items-end">
              <span className="text-blue-600 text-lg leading-none">{MODULES.reduce((acc, m) => acc + m.h4Count, 0)}</span>
              <span>Total Points</span>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-gray-800 text-lg leading-none">{MODULES.length}</span>
              <span>Modules</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
