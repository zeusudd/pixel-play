import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const WORDS = ['REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'TAILWIND', 'ARCADE', 'GAMING', 'PIXEL', 'PROGRAMMING', 'DEVELOPER', 'BROWSER'];

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 6;

  const initGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessed([]);
    setMistakes(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleGuess = (letter: string) => {
    if (guessed.includes(letter) || mistakes >= maxMistakes) return;
    setGuessed([...guessed, letter]);
    if (!word.includes(letter)) {
      setMistakes(m => m + 1);
    }
  };

  const isWon = word.split('').every(l => guessed.includes(l));
  const isLost = mistakes >= maxMistakes;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-2xl border text-slate-900">
      <div className="relative w-48 h-48 border-b-4 border-slate-800">
        {/* Gallows */}
        <div className="absolute bottom-0 left-4 w-2 h-48 bg-slate-800" />
        <div className="absolute top-0 left-4 w-32 h-2 bg-slate-800" />
        <div className="absolute top-0 right-12 w-1 h-8 bg-slate-800" />
        
        {/* Man */}
        {mistakes > 0 && <div className="absolute top-8 right-9 w-8 h-8 rounded-full border-4 border-slate-800" />}
        {mistakes > 1 && <div className="absolute top-16 right-12 w-1 h-16 bg-slate-800" />}
        {mistakes > 2 && <div className="absolute top-20 right-12 w-10 h-1 bg-slate-800 origin-left rotate-[30deg]" />}
        {mistakes > 3 && <div className="absolute top-20 right-2 w-10 h-1 bg-slate-800 origin-right -rotate-[30deg]" />}
        {mistakes > 4 && <div className="absolute top-32 right-12 w-1 h-12 bg-slate-800 origin-top rotate-[30deg]" />}
        {mistakes > 5 && <div className="absolute top-32 right-12 w-1 h-12 bg-slate-800 origin-top -rotate-[30deg]" />}
      </div>

      <div className="flex gap-2 text-3xl font-mono tracking-widest">
        {word.split('').map((letter, i) => (
          <span key={i} className="border-b-2 border-slate-300 w-8 text-center">
            {guessed.includes(letter) ? letter : ''}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 max-w-md">
        {alphabet.map(letter => (
          <Button
            key={letter}
            size="sm"
            variant={guessed.includes(letter) ? (word.includes(letter) ? 'default' : 'destructive') : 'outline'}
            disabled={guessed.includes(letter) || isWon || isLost}
            onClick={() => handleGuess(letter)}
            className="w-8 h-8 sm:w-10 sm:h-10 p-0"
          >
            {letter}
          </Button>
        ))}
      </div>

      {(isWon || isLost) && (
        <div className="flex flex-col items-center gap-4">
          <p className={`text-2xl font-bold ${isWon ? 'text-green-600' : 'text-red-600'}`}>
            {isWon ? 'You Won!' : `Game Over! The word was ${word}`}
          </p>
          <Button onClick={initGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
