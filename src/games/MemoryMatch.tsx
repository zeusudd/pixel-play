import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍍', '🥝'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          if (matchedCards.every(c => c.isMatched)) setIsWon(true);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-indigo-50 rounded-2xl text-indigo-900">
      <div className="flex justify-between w-full max-w-[400px]">
        <span className="text-lg font-semibold text-indigo-900">Moves: {moves}</span>
        {isWon && <span className="text-green-600 font-bold">You Won!</span>}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className={`w-16 h-16 cursor-pointer rounded-xl flex items-center justify-center text-3xl shadow-sm
              ${card.isFlipped || card.isMatched ? 'bg-white' : 'bg-indigo-600'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(i)}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
          </motion.div>
        ))}
      </div>

      <Button onClick={initGame} className="bg-indigo-600 hover:bg-indigo-700">
        New Game
      </Button>
    </div>
  );
}
