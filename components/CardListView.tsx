
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  cards: Flashcard[];
  moduleName: string;
  onBack: () => void;
  isDarkMode: boolean;
  onShuffle: () => void;
  totalCount?: number;
}

const CardListView: React.FC<Props> = ({ cards, moduleName, onBack, isDarkMode, onShuffle, totalCount }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Reset states when cards change (on shuffle)
  useEffect(() => {
    setRevealedIds(new Set());
    setShowAll(false);
  }, [cards]);

  const toggleReveal = (id: string) => {
    const newSet = new Set(revealedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setRevealedIds(newSet);
  };

  const handleToggleAll = () => {
    if (showAll) {
      setRevealedIds(new Set());
    } else {
      setRevealedIds(new Set(cards.map(c => c.id)));
    }
    setShowAll(!showAll);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-14 md:top-16 backdrop-blur-md py-4 z-40 border-b transition-colors duration-300 bg-gray-50/90 dark:bg-gray-950/90 border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className={`p-2 rounded-full shadow-sm border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className={`text-lg md:text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{moduleName}</h2>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">
              {totalCount ? `전체 ${totalCount}개 중 무작위 20개 학습 중` : '무작위 20개 집중 학습'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onShuffle}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-blue-400' : 'bg-white border-gray-200 text-blue-600'}`}
            title="새로운 20문제 섞기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={handleToggleAll}
            className={`px-4 md:px-6 py-2.5 border-2 font-black rounded-xl transition-all text-[10px] md:text-xs shadow-sm ${
              isDarkMode 
                ? 'border-blue-900 text-blue-400 bg-gray-900' 
                : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-50'
            }`}
          >
            {showAll ? '전체 정답 숨기기' : '전체 정답 펼치기'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => {
          const isRevealed = revealedIds.has(card.id);
          return (
            <div key={`${card.id}-${index}`} className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
              <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="md:w-10 shrink-0">
                  <span className={`font-black text-sm opacity-30 ${isDarkMode ? 'text-gray-500' : 'text-blue-600'}`}>#{index + 1}</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className={`text-base md:text-lg font-bold leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    <MarkdownRenderer content={card.question} />
                  </div>
                  
                  {isRevealed ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50/50 border-blue-100'}`}>
                        <div className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-2">The Answer</div>
                        <div className={`text-sm md:text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          <MarkdownRenderer content={card.answer} />
                        </div>
                      </div>
                      {card.explanation && (
                        <div className={`p-4 rounded-xl border italic ${isDarkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Expert Note</div>
                          <div className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <MarkdownRenderer content={card.explanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleReveal(card.id)}
                      className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 flex items-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>정답 및 해설 보기</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-8 flex flex-col items-center space-y-4">
        <button 
          onClick={onShuffle}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center space-x-2 border-2 ${isDarkMode ? 'border-blue-900 text-blue-400 bg-blue-900/10' : 'border-blue-100 text-blue-600 bg-white shadow-sm'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>이 과목 새로운 20문제 섞기</span>
        </button>
        <button 
          onClick={onBack}
          className={`px-10 py-3 rounded-xl font-bold text-sm transition-all ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
        >
          과목 선택으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default CardListView;
