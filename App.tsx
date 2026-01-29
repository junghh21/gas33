
import React, { useState, useEffect, useRef } from 'https://esm.sh/react@19.0.0';
import { Flashcard } from './types';
import { SUBJECTS, APP_VERSION, SubjectInfo } from './constants';
import FlashcardView from './components/FlashcardView';
import AIChat from './components/AIChat';
import CardListView from './components/CardListView';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'selection' | 'flashcards' | 'ai' | 'list'>('selection');
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalShuffleMode, setTotalShuffleMode] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  
  const cardCache = useRef<Record<string, Flashcard[]>>({});

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gas-engine-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const totalQuestions = SUBJECTS.reduce((acc, curr) => acc + curr.h4Count, 0);

  useEffect(() => {
    localStorage.setItem('gas-engine-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check engine readiness based on cache
  useEffect(() => {
    const checkCacheStatus = () => {
      const allSubIds = SUBJECTS.flatMap(s => s.subModuleIds);
      const cachedCount = allSubIds.filter(id => cardCache.current[id] && cardCache.current[id].length > 0).length;
      if (cachedCount > 0 && cachedCount >= allSubIds.length * 0.5) { 
        setIsEngineReady(true);
      }
    };
    checkCacheStatus();
  }, [loading]);

  const fetchSubjectCards = async (subIds: string[]) => {
    const missingIds = subIds.filter(id => !cardCache.current[id]);
    
    if (missingIds.length === 0) {
      return subIds.flatMap(id => cardCache.current[id] || []);
    }

    setLoading(true);
    try {
      const allPromises = missingIds.map(async (id) => {
        try {
          // Try 1: Direct static fetch
          let response = await fetch(`/json/${id}.json`);
          
          // Try 2: Fallback to Worker API if direct fails
          if (!response.ok) {
            console.warn(`[App] Direct fetch failed for ${id}, trying API fallback...`);
            response = await fetch(`/api/json/${id}`);
          }

          if (response.ok) {
            const data = await response.json();
            const cards = Array.isArray(data) ? data : [];
            cardCache.current[id] = cards;
            return cards;
          }
          
          cardCache.current[id] = [];
          return [];
        } catch (e) {
          console.error(`[App] Fatal error loading ${id}:`, e);
          cardCache.current[id] = [];
          return [];
        }
      });
      
      await Promise.all(allPromises);
      const combined = subIds.flatMap(id => cardCache.current[id] || []);
      return combined;
    } catch (error) {
      console.error("[App] Aggregated fetch failed:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startFlashcards = async (subject: SubjectInfo) => {
    if (loading) return;
    const allCards = await fetchSubjectCards(subject.subModuleIds);
    if (allCards.length === 0) {
      alert("데이터를 로드할 수 없습니다. 연결 상태를 확인해주세요.");
      return;
    }
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    const shuffled = shuffleArray(allCards).slice(0, 20);
    setCurrentCards(shuffled);
    setStudyMode('flashcards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startListView = async (subject: SubjectInfo) => {
    if (loading) return;
    const allCards = await fetchSubjectCards(subject.subModuleIds);
    if (allCards.length === 0) {
      alert("데이터 로드에 실패했습니다.");
      return;
    }
    setSelectedSubject(subject);
    setTotalShuffleMode(false);
    setCurrentCards(allCards);
    setStudyMode('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTotalShuffle = async () => {
    if (loading) return;
    setLoading(true);
    
    const allSubIds = SUBJECTS.flatMap(s => s.subModuleIds);
    const allCards = await fetchSubjectCards(allSubIds);
    
    if (allCards.length === 0) {
      setLoading(false);
      alert("전체 학습 데이터를 불러오지 못했습니다. 엔진 상태를 확인해주세요.");
      return;
    }

    setTotalShuffleMode(true);
    setSelectedSubject(null);
    const shuffled = shuffleArray(allCards).slice(0, 20);
    setCurrentCards(shuffled);
    setStudyMode('flashcards');
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshCards = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); 
    
    const subIds = totalShuffleMode 
      ? SUBJECTS.flatMap(s => s.subModuleIds) 
      : (selectedSubject ? selectedSubject.subModuleIds : []);
      
    const allCards = await fetchSubjectCards(subIds);
    if (allCards.length > 0) {
      const shuffled = shuffleArray(allCards).slice(0, 20);
      setCurrentCards(shuffled);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAI = (subject?: SubjectInfo) => {
    if (subject) setSelectedSubject(subject);
    setStudyMode('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelection = () => {
    setStudyMode('selection');
    setSelectedSubject(null);
    setCurrentCards([]);
    setTotalShuffleMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 pointer-events-none md:pointer-events-auto">
        <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md shadow-2xl transition-all ${isDarkMode ? 'bg-gray-900/80 border-gray-800 text-blue-400' : 'bg-white/80 border-gray-200 text-blue-600'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isEngineReady ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-black tracking-tighter uppercase">Engine {isEngineReady ? 'READY' : 'SYNCING'} v{APP_VERSION}</span>
          </div>
        </div>
      </div>

      <header className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={handleBackToSelection}>
            <div className="bg-blue-600 text-white p-1.5 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter italic">GAS MASTER</h1>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className={`flex-1 max-w-6xl mx-auto w-full px-4 ${studyMode === 'selection' ? 'py-8' : 'py-4'}`}>
        {loading && (
          <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-[4px] z-[100] flex items-center justify-center animate-in fade-in duration-300">
             <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center space-y-4 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">Processing Engine</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">이중 로딩 시스템을 통해 최적의 데이터를 구성 중입니다...</p>
                </div>
             </div>
          </div>
        )}

        {studyMode === 'selection' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`md:col-span-2 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center space-y-6 transition-all ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-900/30' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'} border shadow-xl relative overflow-hidden`}>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="relative space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600 text-white'}`}>
                    Welcome Back, Master
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">
                    가스기사 시험 <br/>
                    <span className="text-blue-600">완벽 대비 엔진</span>
                  </h2>
                  <p className={`text-sm md:text-lg leading-relaxed max-w-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    총 {totalQuestions}개의 핵심 기출 변형 문항이 준비되어 있습니다. <br/>
                    과목별 집중 모드 또는 전 범위 무작위 셔플로 실전 감각을 익히세요.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={startTotalShuffle}
                      disabled={loading}
                      className="group px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 ring-4 ring-blue-600/10 disabled:opacity-50"
                    >
                      <svg className="w-6 h-6 group-active:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>무작위 20문제 시작</span>
                    </button>
                    <button 
                      onClick={() => startAI()}
                      className={`px-10 py-5 rounded-[1.5rem] font-black text-lg border-2 transition-all flex items-center justify-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-800 text-gray-300' : 'border-gray-100 text-gray-600 bg-white'}`}
                    >
                      <span>AI 튜터에게 질문하기</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                 <div className={`rounded-3xl p-6 border flex flex-col justify-center items-center text-center space-y-2 transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className={`text-3xl font-black text-blue-600 ${isEngineReady ? 'animate-pulse' : ''}`}>{totalQuestions}</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Cards</div>
                 </div>
                 <div className={`rounded-3xl p-6 border flex flex-col justify-center items-center text-center space-y-2 transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="text-3xl font-black text-blue-600">4</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subjects</div>
                 </div>
                 <div className={`hidden md:flex rounded-3xl p-6 border flex-col justify-center items-center text-center space-y-2 ${isDarkMode ? 'bg-blue-600 text-white border-transparent' : 'bg-gray-900 text-white border-transparent'}`}>
                    <div className="text-xl font-black italic">Gemini 3.0</div>
                    <div className="text-[10px] font-black opacity-60 uppercase tracking-widest">Tutor Engine</div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
              {SUBJECTS.map((sub) => (
                <div key={sub.id} className={`rounded-[2rem] p-6 shadow-sm border transition-all group flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-blue-900/50' : 'bg-white border-gray-100 hover:shadow-xl hover:border-blue-100'}`}>
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">{sub.icon}</div>
                  <h3 className="text-xl font-black mb-2">{sub.name}</h3>
                  <p className={`text-xs mb-8 flex-1 leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{sub.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    <button 
                      onClick={() => startFlashcards(sub)}
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 text-white text-sm font-black rounded-2xl active:scale-95 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 disabled:opacity-50"
                    >
                      <span>집중 20문항 시작</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => startListView(sub)}
                        className={`py-2.5 border font-black rounded-xl text-[10px] transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-800 bg-gray-950 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                      >
                        전체 리스트
                      </button>
                      <button 
                        onClick={() => startAI(sub)}
                        className={`py-2.5 border font-black rounded-xl text-[10px] transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-800 bg-gray-950 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                      >
                        AI 질의응답
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
                <button onClick={handleBackToSelection} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="text-center px-4">
                   <h2 className={`text-xs font-black truncate max-w-[180px] uppercase tracking-widest ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {totalShuffleMode ? '전 범위 통합 챌린지' : selectedSubject?.name}
                   </h2>
                </div>
                <button onClick={handleRefreshCards} disabled={loading} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-blue-400' : 'bg-white border-gray-200 text-blue-600 shadow-sm'} disabled:opacity-50`}>
                   <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

        {studyMode === 'list' && (
          <div className="animate-in fade-in duration-500">
            <CardListView 
              cards={currentCards} 
              moduleName={selectedSubject?.name || "List View"} 
              onBack={handleBackToSelection} 
              isDarkMode={isDarkMode}
              onShuffle={handleRefreshCards}
              totalCount={selectedSubject?.h4Count}
            />
          </div>
        )}

        {studyMode === 'ai' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
             <AIChat moduleName={selectedSubject?.name} onBack={handleBackToSelection} />
          </div>
        )}
      </main>

      <footer className={`border-t py-12 text-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 border-gray-900 text-gray-700' : 'bg-white border-gray-100 text-gray-400'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest">Gas Engineer Master Engine v{APP_VERSION}</p>
          <p className="text-[9px] mt-2 opacity-50 font-bold">© 2025 Study Logic AI Integration. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
