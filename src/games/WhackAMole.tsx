import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
  };

  const whack = (index: number) => {
    if (gameState !== 'playing' || index !== activeMole) return;
    setScore(s => s + 1);
    setActiveMole(null);
  };

  const spawnMole = useCallback(() => {
    if (gameState !== 'playing') return;
    const nextMole = Math.floor(Math.random() * 9);
    setActiveMole(nextMole);
    const delay = Math.max(400, 1000 - Math.floor(score / 5) * 100);
    moleTimerRef.current = setTimeout(() => {
      setActiveMole(null);
      spawnMole();
    }, delay);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState === 'playing') {
      spawnMole();
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('ended');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      setActiveMole(null);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    };
  }, [gameState, spawnMole]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-amber-50 rounded-2xl border-4 border-amber-200 text-amber-900">
      <div className="flex justify-between w-full max-w-[300px] text-xl font-bold text-amber-900">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-amber-200 p-4 rounded-xl shadow-inner">
        {Array(9).fill(null).map((_, i) => (
          <div key={i} className="relative w-20 h-20 bg-amber-900/20 rounded-full overflow-hidden border-b-4 border-amber-900/40">
            {activeMole === i && (
              <button
                onClick={() => whack(i)}
                className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce"
              >
                🐹
              </button>
            )}
          </div>
        ))}
      </div>

      {gameState !== 'playing' && (
        <div className="flex flex-col items-center gap-4">
          {gameState === 'ended' && <p className="text-2xl font-bold text-amber-900">Final Score: {score}</p>}
          <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-xl">
            {gameState === 'idle' ? 'Start Game' : 'Play Again'}
          </Button>
        </div>
      )}
    </div>
  );
}
