
import React, { useState, useEffect } from 'https://esm.sh/react@19.0.0';
import { Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  cards: Flashcard[];
  onFinish: () => void;
  isDarkMode: boolean;
  onShuffle: () => void;
}

const FlashcardView: React.FC<Props> = ({ cards, onFinish, isDarkMode, onShuffle }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Reset revealed states when cards change (shuffle)
  useEffect(() => {
    setRevealedIds(new Set());
  }, [cards]);

  const toggleReveal = (id: string) => {
    const newSet = new Set(revealedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setRevealedIds(newSet);
  };

  const progress = Math.round((revealedIds.size / cards.length) * 100);

  return (
    <div className="space-y-6 pb-32">
      {/* Bottom Sticky Controls */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 p-4 border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100'} backdrop-blur-lg`}>
        <div className="max-w-2xl mx-auto flex items-center space-x-3">
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <button 
            onClick={onShuffle}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-blue-400' : 'bg-white border-gray-200 text-blue-600'}`}
            title="새 문항 섞기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={onFinish}
            className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl active:scale-95 transition-transform"
          >
            학습종료
          </button>
        </div>
      </div>

      <div className="text-center py-2">
        <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          Focus Set: {revealedIds.size} / {cards.length} Completed
        </div>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => {
          const isRevealed = revealedIds.has(card.id);
          return (
            <div 
              key={`${card.id}-${index}`}
              onClick={() => toggleReveal(card.id)}
              className={`group cursor-pointer rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
                isRevealed 
                  ? (isDarkMode ? 'bg-gray-900 border-blue-900/50' : 'bg-white border-blue-100 ring-2 ring-blue-50')
                  : (isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 hover:border-blue-200')
              }`}
            >
              <div className="p-5 md:p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                      {index + 1}
                    </span>
                    <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                      QUESTION
                    </span>
                  </div>
                  {isRevealed && (
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black text-blue-500 tracking-tighter uppercase">Revealed</span>
                    </div>
                  )}
                </div>

                <div className={`text-base md:text-lg font-bold leading-snug mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <MarkdownRenderer content={card.question} />
                </div>

                {isRevealed ? (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t pt-4 border-gray-100 dark:border-gray-800">
                    <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'}`}>
                       <div className="text-[9px] font-black text-blue-600 dark:text-blue-400 mb-2 tracking-widest uppercase">The Answer</div>
                       <div className={`text-sm md:text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                         <MarkdownRenderer content={card.answer} />
                       </div>
                    </div>
                    {card.explanation && (
                      <div className={`p-4 rounded-xl border italic ${isDarkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-[9px] font-black text-gray-400 dark:text-gray-600 mb-2 tracking-widest uppercase">Expert Note</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed prose-sm">
                          <MarkdownRenderer content={card.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 h-12 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 tracking-tighter">TAP TO REVEAL ANSWER</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-10 flex flex-col items-center space-y-4">
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
          onClick={onFinish}
          className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
        >
          학습 세트 종료
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
