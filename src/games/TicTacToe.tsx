import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner 
    ? `Winner: ${winner}` 
    : board.every(s => s) 
      ? "Draw!" 
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-900">
      <div className="text-2xl font-bold text-slate-800">{status}</div>
      
      <div className="grid grid-cols-3 gap-3">
        {board.map((square, i) => (
          <button
            key={i}
            className={`w-20 h-20 text-4xl font-black rounded-xl transition-all duration-200 flex items-center justify-center
              ${!square && !winner ? 'hover:bg-slate-50 bg-slate-100' : 'bg-white border-2 border-slate-100'}
              ${square === 'X' ? 'text-blue-600' : 'text-rose-600'}
            `}
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>

      <Button onClick={resetGame} variant="outline" className="mt-4">
        Reset Game
      </Button>
    </div>
  );
}
