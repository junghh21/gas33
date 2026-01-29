
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
        <span>{currentCard.category}</span>
        <span>{currentIndex + 1} / {shuffledCards.length}</span>
      </div>

      <div 
        onClick={() => setShowAnswer(!showAnswer)}
        className={`relative w-full min-h-[300px] cursor-pointer transition-all duration-500 transform preserve-3d group ${showAnswer ? 'rotate-y-180' : ''}`}
        style={{ perspective: '1000px' }}
      >
        {/* Front (Question) */}
        <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-blue-100 backface-hidden transition-opacity duration-300 ${showAnswer ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Question</h3>
           <div className="text-center text-xl font-semibold text-gray-800 leading-relaxed">
             <MarkdownRenderer content={currentCard.question} />
           </div>
           <p className="mt-8 text-blue-500 text-sm font-medium animate-pulse">Click to flip</p>
        </div>

        {/* Back (Answer) */}
        <div className={`w-full min-h-[300px] bg-blue-50 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-blue-500 transition-opacity duration-300 ${showAnswer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <h3 className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-4">Answer</h3>
           <div className="text-gray-800 leading-relaxed">
             <MarkdownRenderer content={currentCard.answer} />
           </div>
           <p className="mt-8 text-blue-400 text-sm font-medium">Click to see question</p>
        </div>
      </div>

      <div className="flex space-x-4 w-full">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-6 rounded-xl font-bold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          className="flex-2 py-3 px-10 rounded-xl font-bold transition-all bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95"
        >
          {currentIndex === shuffledCards.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
