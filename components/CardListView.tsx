
import React, { useState } from 'react';
import { Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  cards: Flashcard[];
  moduleName: string;
  onBack: () => void;
}

const CardListView: React.FC<Props> = ({ cards, moduleName, onBack }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 backdrop-blur-md py-4 z-40 border-b transition-colors duration-300 bg-gray-50/90 dark:bg-gray-950/90 border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 rounded-full shadow-sm border transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{moduleName} 리스트</h2>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-wider">Total {cards.length} Questions</p>
          </div>
        </div>
        <button 
          onClick={handleToggleAll}
          className="px-6 py-2.5 bg-white dark:bg-gray-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-black rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm shadow-sm"
        >
          {showAll ? '모든 정답 숨기기' : '모든 정답 보이기'}
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => {
          const isRevealed = revealedIds.has(card.id);
          return (
            <div key={card.id} className="bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden transition-all border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="md:w-12 shrink-0">
                  <span className="text-blue-600 dark:text-blue-500 font-black text-lg opacity-20">#{index + 1}</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    <MarkdownRenderer content={card.question} />
                  </div>
                  
                  {isRevealed ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-2">Answer</div>
                        <div className="text-gray-900 dark:text-gray-200 font-medium">
                          <MarkdownRenderer content={card.answer} />
                        </div>
                      </div>
                      {card.explanation && (
                        <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Explanation</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                            <MarkdownRenderer content={card.explanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleReveal(card.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-4"
                    >
                      정답 및 해설 확인하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardListView;
