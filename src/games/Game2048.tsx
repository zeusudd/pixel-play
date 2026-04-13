import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

type Grid = (number | null)[][];

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(Array(4).fill(null).map(() => Array(4).fill(null)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const addRandomTile = useCallback((currentGrid: Grid) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === null) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initGame = useCallback(() => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(null));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let moved = false;
    let newScore = score;
    let newGrid = grid.map(row => [...row]);

    const rotate = (g: Grid) => g[0].map((_, i) => g.map(row => row[i]).reverse());
    
    // Normalize to "left" move
    let rotations = 0;
    if (direction === 'up') rotations = 3;
    if (direction === 'right') rotations = 2;
    if (direction === 'down') rotations = 1;

    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    // Slide and merge left
    for (let r = 0; r < 4; r++) {
      let row = newGrid[r].filter(val => val !== null) as number[];
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      const newRow = [...row, ...Array(4 - row.length).fill(null)];
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) moved = true;
      newGrid[r] = newRow;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) {
      const gridWithNewTile = addRandomTile(newGrid);
      setGrid(gridWithNewTile);
      setScore(newScore);
      
      // Check game over
      if (gridWithNewTile.flat().every(cell => cell !== null)) {
        // Check if any merges possible
        let canMove = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if ((r < 3 && gridWithNewTile[r][c] === gridWithNewTile[r+1][c]) ||
                (c < 3 && gridWithNewTile[r][c] === gridWithNewTile[r][c+1])) {
              canMove = true;
              break;
            }
          }
        }
        if (!canMove) setGameOver(true);
      }
    }
  }, [grid, score, gameOver, addRandomTile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number | null) => {
    if (!val) return 'bg-slate-200';
    const colors: Record<number, string> = {
      2: 'bg-amber-50 text-slate-800',
      4: 'bg-amber-100 text-slate-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-400 text-white text-2xl',
      256: 'bg-yellow-500 text-white text-2xl',
      512: 'bg-yellow-600 text-white text-2xl',
      1024: 'bg-yellow-700 text-white text-xl',
      2048: 'bg-yellow-800 text-white text-xl',
    };
    return colors[val] || 'bg-slate-900 text-white';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-slate-50 rounded-2xl text-slate-900">
      <div className="flex justify-between w-full max-w-[320px]">
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-slate-700">2048</span>
        </div>
        <div className="bg-slate-200 px-4 py-2 rounded-lg text-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Score</div>
          <div className="text-xl font-bold text-slate-700">{score}</div>
        </div>
      </div>

      <div className="relative bg-slate-300 p-2 rounded-xl grid grid-cols-4 gap-2 w-[320px] h-[320px]">
        {grid.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className="w-full h-full bg-slate-200/50 rounded-lg" />
        )))}
        <div className="absolute inset-0 p-2 grid grid-cols-4 gap-2">
          {grid.map((row, r) => row.map((cell, c) => (
            cell && (
              <motion.div
                key={`${r}-${c}-${cell}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-full h-full rounded-lg flex items-center justify-center text-3xl font-bold shadow-sm ${getTileColor(cell)}`}
              >
                {cell}
              </motion.div>
            )
          )))}
        </div>
        {gameOver && (
          <div className="absolute inset-0 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center text-white p-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <Button onClick={initGame} className="bg-orange-500 hover:bg-orange-600">Try Again</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <div />
        <Button size="sm" variant="outline" onClick={() => move('up')}>↑</Button>
        <div />
        <Button size="sm" variant="outline" onClick={() => move('left')}>←</Button>
        <Button size="sm" variant="outline" onClick={() => move('down')}>↓</Button>
        <Button size="sm" variant="outline" onClick={() => move('right')}>→</Button>
      </div>
    </div>
  );
}
