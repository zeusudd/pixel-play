import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

const COLS = 10;
const ROWS = 20;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS: Record<string, string> = {
  I: 'bg-cyan-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500',
  O: 'bg-yellow-500',
  S: 'bg-green-500',
  T: 'bg-purple-500',
  Z: 'bg-red-500',
};

export default function Tetris() {
  const [grid, setGrid] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [activePiece, setActivePiece] = useState<{ shape: number[][], x: number, y: number, type: string } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const spawnPiece = useCallback(() => {
    const types = Object.keys(SHAPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const shape = SHAPES[type as keyof typeof SHAPES];
    const newPiece = { shape, x: Math.floor(COLS / 2) - 1, y: 0, type };
    
    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, grid)) {
      setGameOver(true);
      return null;
    }
    return newPiece;
  }, [grid]);

  const checkCollision = (shape: number[][], x: number, y: number, currentGrid: (string | null)[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentGrid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) => {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  };

  const moveDown = useCallback(() => {
    if (!activePiece || gameOver) return;

    if (!checkCollision(activePiece.shape, activePiece.x, activePiece.y + 1, grid)) {
      setActivePiece({ ...activePiece, y: activePiece.y + 1 });
    } else {
      // Lock piece
      const newGrid = grid.map(row => [...row]);
      activePiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            const gy = activePiece.y + r;
            const gx = activePiece.x + c;
            if (gy >= 0) newGrid[gy][gx] = activePiece.type;
          }
        });
      });

      // Clear lines
      let linesCleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newGrid[r].every(cell => cell !== null)) {
          newGrid.splice(r, 1);
          newGrid.unshift(Array(COLS).fill(null));
          linesCleared++;
          r++;
        }
      }

      if (linesCleared > 0) setScore(s => s + [0, 100, 300, 500, 800][linesCleared]);
      
      setGrid(newGrid);
      const next = spawnPiece();
      setActivePiece(next);
    }
  }, [activePiece, grid, gameOver, spawnPiece]);

  useEffect(() => {
    if (!activePiece && !gameOver) {
      setActivePiece(spawnPiece());
    }
  }, [activePiece, gameOver, spawnPiece]);

  useEffect(() => {
    if (!gameOver && activePiece) {
      gameLoopRef.current = setInterval(moveDown, 800);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [moveDown, gameOver, activePiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePiece || gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        if (!checkCollision(activePiece.shape, activePiece.x - 1, activePiece.y, grid)) {
          setActivePiece({ ...activePiece, x: activePiece.x - 1 });
        }
      } else if (e.key === 'ArrowRight') {
        if (!checkCollision(activePiece.shape, activePiece.x + 1, activePiece.y, grid)) {
          setActivePiece({ ...activePiece, x: activePiece.x + 1 });
        }
      } else if (e.key === 'ArrowDown') {
        moveDown();
      } else if (e.key === 'ArrowUp') {
        const rotated = rotate(activePiece.shape);
        if (!checkCollision(rotated, activePiece.x, activePiece.y, grid)) {
          setActivePiece({ ...activePiece, shape: rotated });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePiece, grid, gameOver, moveDown]);

  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setActivePiece(null);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border-4 border-slate-800">
      <div className="flex justify-between w-full max-w-[200px] text-white font-bold">
        <span>Score: {score}</span>
        {gameOver && <span className="text-red-500">OVER</span>}
      </div>

      <div className="relative bg-slate-950 border-2 border-slate-800 grid grid-cols-10 gap-[1px] p-[1px]">
        {grid.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className={`w-5 h-5 rounded-sm ${cell ? COLORS[cell] : 'bg-slate-900/50'}`} />
        )))}
        
        {activePiece && activePiece.shape.map((row, r) => row.map((cell, c) => {
          if (!cell) return null;
          const gy = activePiece.y + r;
          const gx = activePiece.x + c;
          if (gy < 0) return null;
          return (
            <div 
              key={`active-${r}-${c}`} 
              className={`absolute w-5 h-5 rounded-sm ${COLORS[activePiece.type]}`}
              style={{ left: gx * 21 + 1, top: gy * 21 + 1 }}
            />
          );
        }))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <div />
        <Button size="sm" variant="secondary" onClick={() => {
          const rotated = rotate(activePiece!.shape);
          if (!checkCollision(rotated, activePiece!.x, activePiece!.y, grid)) setActivePiece({ ...activePiece!, shape: rotated });
        }}>↻</Button>
        <div />
        <Button size="sm" variant="secondary" onClick={() => {
          if (!checkCollision(activePiece!.shape, activePiece!.x - 1, activePiece!.y, grid)) setActivePiece({ ...activePiece!, x: activePiece!.x - 1 });
        }}>←</Button>
        <Button size="sm" variant="secondary" onClick={moveDown}>↓</Button>
        <Button size="sm" variant="secondary" onClick={() => {
          if (!checkCollision(activePiece!.shape, activePiece!.x + 1, activePiece!.y, grid)) setActivePiece({ ...activePiece!, x: activePiece!.x + 1 });
        }}>→</Button>
      </div>

      {gameOver && <Button onClick={resetGame} className="mt-2">Restart</Button>}
    </div>
  );
}
