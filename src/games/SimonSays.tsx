import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

const COLORS = ['green', 'red', 'yellow', 'blue'];

export default function SimonSays() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'showing' | 'ended'>('idle');
  const [score, setScore] = useState(0);

  const playSequence = useCallback(async (seq: string[]) => {
    setGameState('showing');
    for (const color of seq) {
      setActiveColor(color);
      await new Promise(r => setTimeout(r, 600));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setGameState('playing');
  }, []);

  const nextRound = useCallback(() => {
    const nextColor = COLORS[Math.floor(Math.random() * 4)];
    const newSequence = [...sequence, nextColor];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  }, [sequence, playSequence]);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    setGameState('showing');
    const firstColor = COLORS[Math.floor(Math.random() * 4)];
    setSequence([firstColor]);
    playSequence([firstColor]);
  };

  const handleColorClick = (color: string) => {
    if (gameState !== 'playing') return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (color !== sequence[newUserSequence.length - 1]) {
      setGameState('ended');
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(s => s + 1);
      setTimeout(nextRound, 1000);
    }
  };

  const colorClasses: Record<string, string> = {
    green: 'bg-green-500 hover:bg-green-400',
    red: 'bg-red-500 hover:bg-red-400',
    yellow: 'bg-yellow-400 hover:bg-yellow-300',
    blue: 'bg-blue-500 hover:bg-blue-400',
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-slate-900 rounded-full border-8 border-slate-800 shadow-2xl">
      <div className="absolute flex flex-col items-center justify-center w-24 h-24 bg-slate-800 rounded-full z-10 border-4 border-slate-700">
        <span className="text-white font-bold text-2xl">{score}</span>
        <span className="text-slate-400 text-[10px] uppercase">Score</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {COLORS.map(color => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              opacity: activeColor === color ? 1 : 0.6,
              scale: activeColor === color ? 1.05 : 1,
              boxShadow: activeColor === color ? `0 0 30px ${color}` : 'none'
            }}
            className={`w-32 h-32 rounded-tl-[100%] rounded-tr-[100%] rounded-bl-[100%] rounded-br-[100%] ${colorClasses[color]}
              ${color === 'green' ? 'rounded-br-none' : ''}
              ${color === 'red' ? 'rounded-bl-none' : ''}
              ${color === 'yellow' ? 'rounded-tr-none' : ''}
              ${color === 'blue' ? 'rounded-tl-none' : ''}
            `}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      {gameState !== 'playing' && gameState !== 'showing' && (
        <Button onClick={startGame} className="mt-4 bg-white text-slate-900 hover:bg-slate-200">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
    </div>
  );
}
