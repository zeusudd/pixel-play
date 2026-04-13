import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function Snake() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const gridSize = 20;

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    setFood(newFood);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + gridSize) % gridSize,
        y: (prevSnake[0].y + direction.y + gridSize) % gridSize,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-xl text-white">
      <div className="flex justify-between w-full max-w-[400px] mb-2">
        <span className="text-xl font-bold">Score: {score}</span>
        {gameOver && <span className="text-red-500 font-bold">GAME OVER!</span>}
      </div>
      
      <div 
        className="relative bg-slate-800 border-4 border-slate-700 rounded-lg overflow-hidden"
        style={{ width: gridSize * 20, height: gridSize * 20 }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500 rounded-sm"
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
              zIndex: 10,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
            zIndex: 5,
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div />
        <Button size="sm" variant="secondary" onClick={() => setDirection({ x: 0, y: -1 })} disabled={direction.y !== 0}>↑</Button>
        <div />
        <Button size="sm" variant="secondary" onClick={() => setDirection({ x: -1, y: 0 })} disabled={direction.x !== 0}>←</Button>
        <Button size="sm" variant="secondary" onClick={() => setDirection({ x: 0, y: 1 })} disabled={direction.y !== 0}>↓</Button>
        <Button size="sm" variant="secondary" onClick={() => setDirection({ x: 1, y: 0 })} disabled={direction.x !== 0}>→</Button>
      </div>

      {gameOver && (
        <Button onClick={resetGame} className="mt-4 bg-green-600 hover:bg-green-700">
          Play Again
        </Button>
      )}
    </div>
  );
}
