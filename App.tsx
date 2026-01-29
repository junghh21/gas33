
import React, { useState, useEffect } from 'react';
import { Flashcard } from './types';
import { SUBJECTS, APP_VERSION, SubjectInfo } from './constants';
import FlashcardView from './components/FlashcardView';
import AIChat from './components/AIChat';
import CardListView from './components/CardListView';

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'selection' | 'flashcards' | 'ai' | 'list'>('selection');
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalShuffleMode, setTotalShuffleMode] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gas-engine-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gas-engine-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gas-engine-theme', 'light');
    }
  }, [isDarkMode]);

  const fetchSubjectCards = async (subIds: string[]) => {
    setLoading(true);
    try {
      const allPromises = subIds.map(async (id) => {
        const response = await fetch(`./json/${id}.json`);
        if (response.ok) return await response.json();
        return [];
      });
      const results = await Promise.all(allPromises);
      return results.flat();
    } catch (error) {
      console.error("Error fetching subject cards:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startFlashcards = async (subject: SubjectInfo) => {
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    const allCards = await fetchSubjectCards(subject.subModuleIds);
    // Shuffle and pick 20
    const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
    setCurrentCards(shuffled);
    setStudyMode('flashcards');
    window.scrollTo(0, 0);
  };

  const startListView = async (subject: SubjectInfo) => {
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    const cards = await fetchSubjectCards(subject.subModuleIds);
    setCurrentCards(cards);
    setStudyMode('list');
    window.scrollTo(0, 0);
  };

  const startTotalShuffle = async () => {
    setLoading(true);
    setTotalShuffleMode(true);
    try {
      const allSubIds = SUBJECTS.flatMap(s => s.subModuleIds);
      const allCards = await fetchSubjectCards(allSubIds);
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
      setCurrentCards(shuffled);
      setStudyMode('flashcards');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error in total shuffle:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCards = async () => {
    if (!selectedSubject && !totalShuffleMode) return;
    
    setLoading(true);
    const subIds = totalShuffleMode 
      ? SUBJECTS.flatMap(s => s.subModuleIds) 
      : selectedSubject!.subModuleIds;
      
    const allCards = await fetchSubjectCards(subIds);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
    setCurrentCards(shuffled);
    window.scrollTo(0, 0);
    setLoading(false);
  };

  const startAI = (subject?: SubjectInfo) => {
    if (subject) setSelectedSubject(subject);
    setStudyMode('ai');
    window.scrollTo(0, 0);
  };

  const handleBackToSelection = () => {
    setStudyMode('selection');
    setSelectedSubject(null);
    setCurrentCards([]);
    setTotalShuffleMode(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} flex flex-col`}>
      <header className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleBackToSelection}>
            <div className="bg-blue-600 text-white p-1 rounded-lg shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className={`text-lg md:text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GAS ENGINE</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
            >
              {isDarkMode ? (
                <svg className="w-4 h-4 md:w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 max-w-6xl mx-auto w-full px-4 ${studyMode === 'selection' ? 'py-8 md:py-12' : 'py-4 md:py-8'}`}>
        {loading && (
          <div className="fixed inset-0 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm z-[100] flex items-center justify-center">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-black text-gray-700 dark:text-gray-300">데이터를 갱신하는 중...</p>
             </div>
          </div>
        )}

        {studyMode === 'selection' && (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6 px-2">
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                Efficient Learning
              </div>
              <h2 className={`text-3xl md:text-5xl font-black leading-tight tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>스마트 집중 학습</h2>
              <p className={`text-sm md:text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                수백 개의 문항 중 핵심 20개를 엄선하여 보여줍니다.<br className="hidden md:block"/> 반복 학습과 셔플 기능으로 완벽히 암기하세요.
              </p>
              
              <div className="pt-2">
                <button 
                  onClick={startTotalShuffle}
                  className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 group active:scale-95 ${isDarkMode ? 'bg-white text-gray-950' : 'bg-gray-900 text-white'} shadow-xl`}
                >
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>통합 무작위 20문항 시작</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {SUBJECTS.map((sub) => (
                <div key={sub.id} className={`rounded-3xl p-6 shadow-sm border transition-all group flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-blue-500' : 'bg-white border-gray-100 hover:shadow-xl'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{sub.icon}</div>
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border-blue-900' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {sub.h4Count} Q
                    </div>
                  </div>
                  <h3 className={`text-xl font-black mb-2 group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{sub.name}</h3>
                  <p className={`text-xs mb-8 flex-1 leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {sub.description}
                  </p>
                  
                  <div className="space-y-3 mt-auto">
                    <button 
                      onClick={() => startFlashcards(sub)}
                      className="w-full py-4 bg-blue-600 text-white text-sm font-black rounded-2xl active:scale-95 transition-transform flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                    >
                      <span>집중 20문항 학습</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => startListView(sub)}
                        className={`py-2.5 border font-bold rounded-xl text-[10px] active:scale-95 ${isDarkMode ? 'border-gray-800 text-gray-500 bg-gray-950' : 'border-gray-200 text-gray-600 bg-gray-50'}`}
                      >
                        전체 목록
                      </button>
                      <button 
                        onClick={() => startAI(sub)}
                        className={`py-2.5 border font-bold rounded-xl text-[10px] active:scale-95 ${isDarkMode ? 'border-gray-800 text-gray-500 bg-gray-950' : 'border-gray-200 text-gray-600 bg-gray-50'}`}
                      >
                        AI 상담
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {studyMode === 'flashcards' && currentCards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
             <div className="flex items-center justify-between mb-6 px-1">
                <button onClick={handleBackToSelection} className={`p-2 rounded-full border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="text-center">
                   <h2 className={`text-sm md:text-base font-black truncate max-w-[180px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {totalShuffleMode ? '전 범위 통합' : selectedSubject?.name}
                   </h2>
                </div>
                <button 
                  onClick={handleRefreshCards}
                  className={`p-2 rounded-full border ${isDarkMode ? 'bg-gray-900 border-gray-800 text-blue-400' : 'bg-white border-gray-100 text-blue-600'}`}
                  title="새로운 20문제 섞기"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
             </div>
             <FlashcardView 
               cards={currentCards} 
               onFinish={handleBackToSelection} 
               isDarkMode={isDarkMode}
               onShuffle={handleRefreshCards}
             />
          </div>
        )}

        {studyMode === 'list' && selectedSubject && (
          <div className="animate-in fade-in duration-500">
            <CardListView cards={currentCards} moduleName={selectedSubject.name} onBack={handleBackToSelection} />
          </div>
        )}

        {studyMode === 'ai' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
             <AIChat moduleName={selectedSubject?.name} onBack={handleBackToSelection} />
          </div>
        )}
      </main>

      <footer className={`border-t py-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 border-gray-900 text-gray-600' : 'bg-white border-gray-100 text-gray-400'}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Gas Engineer Engine v{APP_VERSION}</p>
          <p className="text-[9px]">본 시스템은 20문항 집중 학습을 권장합니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
