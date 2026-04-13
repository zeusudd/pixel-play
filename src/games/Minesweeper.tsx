import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [mineCount, setMineCount] = useState(10);

  const rows = 10;
  const cols = 10;

  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    // Place mines
    let placedMines = 0;
    while (placedMines < mineCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
  }, [mineCount]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || won || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      setGameOver(true);
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
    } else {
      const floodFill = (row: number, col: number) => {
        if (row < 0 || row >= rows || col < 0 || col >= cols || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborCount === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              floodFill(row + dr, col + dc);
            }
          }
        }
      };
      floodFill(r, c);
    }

    setGrid(newGrid);

    // Check win
    const unrevealedNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed);
    if (unrevealedNonMines.length === 0) setWon(true);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-100 rounded-2xl text-slate-900">
      <div className="flex justify-between w-full mb-2">
        <span className="font-bold">Mines: {mineCount}</span>
        {gameOver && <span className="text-red-600 font-bold">BOOM! Game Over</span>}
        {won && <span className="text-green-600 font-bold">VICTORY!</span>}
      </div>

      <div className="grid grid-cols-10 gap-1 bg-slate-300 p-1 rounded shadow-inner">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-sm transition-colors
              ${cell.isRevealed 
                ? 'bg-slate-50 text-slate-800' 
                : 'bg-slate-400 hover:bg-slate-350 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.4)]'}
              ${cell.isRevealed && cell.isMine ? 'bg-red-500' : ''}
            `}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
          >
            {cell.isFlagged ? '🚩' : cell.isRevealed ? (cell.isMine ? '💣' : (cell.neighborCount || '')) : ''}
          </button>
        )))}
      </div>

      <Button onClick={initGrid} className="mt-4">Reset Game</Button>
    </div>
  );
}
