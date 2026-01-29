
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
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gas-engine-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const log = (msg: string) => {
    console.log(`[App] ${msg}`);
    setDebugLog(prev => [msg, ...prev].slice(0, 5));
  };

  useEffect(() => {
    log(`Initialized v${APP_VERSION} (Dark: ${isDarkMode})`);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchSubjectCards = async (subIds: string[]) => {
    log(`Fetching cards for: ${subIds.join(', ')}`);
    setLoading(true);
    try {
      const allPromises = subIds.map(async (id) => {
        const response = await fetch(`./json/${id}.json`);
        if (response.ok) return await response.json();
        console.warn(`JSON load failed: ${id}`);
        return [];
      });
      const results = await Promise.all(allPromises);
      const flattened = results.flat();
      log(`Fetched ${flattened.length} cards.`);
      return flattened;
    } catch (error) {
      log(`Error: ${error instanceof Error ? error.message : "Fetch Failed"}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startFlashcards = async (subject: SubjectInfo) => {
    log(`Mode: Flashcards - Subject: ${subject.name}`);
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    const allCards = await fetchSubjectCards(subject.subModuleIds);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
    setCurrentCards(shuffled);
    setStudyMode('flashcards');
    window.scrollTo(0, 0);
  };

  const startListView = async (subject: SubjectInfo) => {
    log(`Mode: List - Subject: ${subject.name}`);
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    const allCards = await fetchSubjectCards(subject.subModuleIds);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
    setCurrentCards(shuffled);
    setStudyMode('list');
    window.scrollTo(0, 0);
  };

  const startTotalShuffle = async () => {
    log("Mode: Total Shuffle");
    setLoading(true);
    setTotalShuffleMode(true);
    try {
      const allSubIds = SUBJECTS.flatMap(s => s.subModuleIds);
      const allCards = await fetchSubjectCards(allSubIds);
      const shuffled = [...allCards].sort(() => Math.random() - 0.5).slice(0, 20);
      setCurrentCards(shuffled);
      setStudyMode('flashcards');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCards = async () => {
    log("Refreshing cards...");
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
    log("Mode: AI Tutor");
    if (subject) setSelectedSubject(subject);
    setStudyMode('ai');
    window.scrollTo(0, 0);
  };

  const handleBackToSelection = () => {
    log("Navigating to Selection");
    setStudyMode('selection');
    setSelectedSubject(null);
    setCurrentCards([]);
    setTotalShuffleMode(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Visual Debug Info (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-[10px] text-green-400 p-3 rounded-lg border border-green-900 font-mono shadow-xl hidden md:block">
        <div className="flex items-center space-x-2 mb-1 border-b border-green-900 pb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold">SYSTEM STATUS v{APP_VERSION}</span>
        </div>
        <div>Mode: {studyMode}</div>
        <div>Cards: {currentCards.length}</div>
        <div className="mt-1 opacity-60">
          {debugLog.map((l, i) => <div key={i}>&gt; {l}</div>)}
        </div>
      </div>

      <header className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleBackToSelection}>
            <div className="bg-blue-600 text-white p-1 rounded-lg shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter">GAS ENGINE</h1>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className={`flex-1 max-w-6xl mx-auto w-full px-4 ${studyMode === 'selection' ? 'py-8' : 'py-4'}`}>
        {loading && (
          <div className="fixed inset-0 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm z-[100] flex items-center justify-center">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-black text-gray-700 dark:text-gray-300 tracking-tight">DATA LOADING...</p>
             </div>
          </div>
        )}

        {studyMode === 'selection' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                Focused Learning Engine
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">가스기사 마스터 v2.5</h2>
              <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
                과목별 20문항 집중 학습 모드<br/>
                학습 종료 시 무작위 셔플을 통해 반복 숙달하세요.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={startTotalShuffle}
                  className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-3 group active:scale-95 ${isDarkMode ? 'bg-white text-gray-950' : 'bg-gray-900 text-white'} shadow-xl`}
                >
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>전 범위 통합 20문제 학습</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBJECTS.map((sub) => (
                <div key={sub.id} className={`rounded-3xl p-6 shadow-sm border transition-all group flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 hover:shadow-xl'}`}>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{sub.icon}</div>
                  <h3 className="text-xl font-black mb-2">{sub.name}</h3>
                  <p className="text-xs text-gray-500 mb-8 flex-1 leading-relaxed">{sub.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    <button 
                      onClick={() => startFlashcards(sub)}
                      className="w-full py-4 bg-blue-600 text-white text-sm font-black rounded-2xl active:scale-95 transition-transform flex items-center justify-center space-x-2"
                    >
                      <span>집중 20문항 카드</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => startListView(sub)}
                        className={`py-2.5 border font-bold rounded-xl text-[10px] ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}
                      >
                        문항 리스트
                      </button>
                      <button 
                        onClick={() => startAI(sub)}
                        className={`py-2.5 border font-bold rounded-xl text-[10px] ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}
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

        {studyMode === 'flashcards' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
             <div className="flex items-center justify-between mb-6 px-1">
                <button onClick={handleBackToSelection} className="p-2 rounded-full border dark:border-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="text-center">
                   <h2 className="text-sm font-black truncate max-w-[150px]">
                      {totalShuffleMode ? '전 범위 통합' : selectedSubject?.name}
                   </h2>
                </div>
                <button onClick={handleRefreshCards} className="p-2 rounded-full border dark:border-gray-800 text-blue-500">
                   🔄
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

        {studyMode === 'list' && (
          <div className="animate-in fade-in duration-500">
            <CardListView 
              cards={currentCards} 
              moduleName={selectedSubject?.name || "List View"} 
              onBack={handleBackToSelection} 
              isDarkMode={isDarkMode}
              onShuffle={handleRefreshCards}
            />
          </div>
        )}

        {studyMode === 'ai' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
             <AIChat moduleName={selectedSubject?.name} onBack={handleBackToSelection} />
          </div>
        )}
      </main>

      <footer className={`border-t py-10 text-center text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-gray-950 border-gray-900 text-gray-700' : 'bg-white border-gray-100 text-gray-400'}`}>
          Gas Engineer Master Engine v{APP_VERSION}
      </footer>
    </div>
  );
};

export default App;
