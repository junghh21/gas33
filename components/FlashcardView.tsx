
import React, { useState, useMemo } from 'react';
import { Flashcard } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  cards: Flashcard[];
  onFinish: () => void;
}

const FlashcardView: React.FC<Props> = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Shuffle cards on start
  const shuffledCards = useMemo(() => [...cards].sort(() => Math.random() - 0.5), [cards]);

  const currentCard = shuffledCards[currentIndex];

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl mx-auto py-10">
      <div className="w-full flex justify-between items-center text-sm font-medium text-gray-500">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{currentCard.category || '가스기사 핵심'}</span>
        <span className="font-mono">{currentIndex + 1} / {shuffledCards.length}</span>
      </div>

      <div 
        onClick={() => setShowAnswer(!showAnswer)}
        className={`relative w-full min-h-[350px] cursor-pointer transition-all duration-500 transform preserve-3d group ${showAnswer ? 'rotate-y-180' : ''}`}
        style={{ perspective: '1000px' }}
      >
        {/* Front (Question) */}
        <div className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center border-2 border-blue-50 backface-hidden transition-opacity duration-300 ${showAnswer ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <h3 className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Learning Question</h3>
           <div className="text-center text-2xl font-bold text-gray-800 leading-relaxed">
             <MarkdownRenderer content={currentCard.question} />
           </div>
           <div className="mt-12 flex items-center space-x-2 text-blue-500 text-xs font-bold animate-pulse">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             <span>CLICK TO REVEAL ANSWER</span>
           </div>
        </div>

        {/* Back (Answer & Explanation) */}
        <div className={`w-full min-h-[350px] bg-white rounded-3xl shadow-2xl p-10 flex flex-col border-2 border-blue-600 transition-opacity duration-300 ${showAnswer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Verified Answer</h3>
           <div className="text-gray-900 text-lg font-semibold mb-6 flex-1">
             <MarkdownRenderer content={currentCard.answer} />
           </div>
           
           {currentCard.explanation && (
             <div className="mt-4 pt-6 border-t border-gray-100">
               <h4 className="text-gray-400 text-[9px] font-black uppercase mb-3 flex items-center">
                 <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
                 Tutor's Note
               </h4>
               <div className="text-xs text-gray-500 leading-relaxed italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                 <MarkdownRenderer content={currentCard.explanation} />
               </div>
             </div>
           )}
           
           <p className="mt-6 text-center text-[9px] text-gray-300 font-bold">CLICK TO SEE QUESTION AGAIN</p>
        </div>
      </div>

      <div className="flex space-x-4 w-full">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-4 px-6 rounded-2xl font-black text-sm transition-all bg-white border-2 border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          PREV
        </button>
        <button 
          onClick={handleNext}
          className="flex-[2] py-4 px-10 rounded-2xl font-black text-sm transition-all bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>{currentIndex === shuffledCards.length - 1 ? 'FINISH STUDY' : 'NEXT CARD'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
