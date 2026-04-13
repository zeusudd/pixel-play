import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const WORDS = ['REACT', 'VITE', 'PIXEL', 'GAMES', 'SNAKE', 'LEVEL', 'SCORE', 'BOARD', 'TILES', 'BLOCK'];

export default function Wordle() {
  const [target, setTarget] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  const initGame = useCallback(() => {
    setTarget(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const onKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'Enter') {
      if (currentGuess.length !== 5) return;
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');
      if (currentGuess === target) setGameState('won');
      else if (newGuesses.length >= 6) setGameState('lost');
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, guesses, target, gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  const getLetterStatus = (guess: string, index: number) => {
    const letter = guess[index];
    if (target[index] === letter) return 'bg-green-500 text-white';
    if (target.includes(letter)) return 'bg-yellow-500 text-white';
    return 'bg-slate-400 text-white';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl border text-slate-900">
      <div className="grid grid-rows-6 gap-2">
        {[...Array(6)].map((_, i) => {
          const guess = guesses[i] || (i === guesses.length ? currentGuess : '');
          return (
            <div key={i} className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold rounded
                    ${guesses[i] ? getLetterStatus(guesses[i], j) : (guess[j] ? 'border-slate-400' : 'border-slate-200')}
                  `}
                >
                  {guess[j] || ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {gameState !== 'playing' && (
        <div className="flex flex-col items-center gap-4">
          <p className={`text-xl font-bold ${gameState === 'won' ? 'text-green-600' : 'text-red-600'}`}>
            {gameState === 'won' ? 'Splendid!' : `The word was ${target}`}
          </p>
          <Button onClick={initGame}>New Game</Button>
        </div>
      )}
    </div>
  );
}
