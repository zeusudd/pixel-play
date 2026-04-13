import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export default function Sudoku() {
  const [grid, setGrid] = useState<(number | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialGrid, setInitialGrid] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);

  const generatePuzzle = useCallback(() => {
    // Simple static puzzle for now (can be improved with a generator)
    const puzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];
    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => row.map(cell => cell !== null)));
  }, []);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c]) return;
    setSelected({ r, c });
  };

  const handleNumberInput = (num: number | null) => {
    if (!selected) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[selected.r][selected.c] = num;
    setGrid(newGrid);
  };

  const isValid = (r: number, c: number, val: number) => {
    // Check row
    for (let i = 0; i < 9; i++) if (i !== c && grid[r][i] === val) return false;
    // Check col
    for (let i = 0; i < 9; i++) if (i !== r && grid[i][c] === val) return false;
    // Check box
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    for (let i = boxR; i < boxR + 3; i++) {
      for (let j = boxC; j < boxC + 3; j++) {
        if (i !== r && j !== c && grid[i][j] === val) return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border text-slate-900">
      <div className="grid grid-cols-9 border-2 border-slate-800">
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg border cursor-pointer transition-colors
              ${(c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-r-slate-800' : 'border-slate-200'}
              ${(r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-b-slate-800' : 'border-slate-200'}
              ${selected?.r === r && selected?.c === c ? 'bg-blue-100' : 'hover:bg-slate-50'}
              ${initialGrid[r][c] ? 'font-bold text-slate-900' : 'text-blue-600'}
              ${cell && !isValid(r, c, cell) ? 'bg-red-100' : ''}
            `}
            onClick={() => handleCellClick(r, c)}
          >
            {cell}
          </div>
        )))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            variant="outline"
            size="sm"
            onClick={() => handleNumberInput(num)}
            className="w-10 h-10"
          >
            {num}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNumberInput(null)}
          className="w-10 h-10 text-xs"
        >
          Clear
        </Button>
      </div>

      <Button onClick={generatePuzzle} variant="secondary">New Game</Button>
    </div>
  );
}
