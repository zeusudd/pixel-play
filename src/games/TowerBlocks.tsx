import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TowerBlocks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockHeight = 30;
    let blocks = [{ x: 100, w: 200, y: canvas.height - blockHeight }];
    let currentBlock = { x: 0, w: 200, dx: 4 };
    let cameraY = 0;

    const handleInput = () => {
      const lastBlock = blocks[blocks.length - 1];
      const overlapStart = Math.max(currentBlock.x, lastBlock.x);
      const overlapEnd = Math.min(currentBlock.x + currentBlock.w, lastBlock.x + lastBlock.w);
      const overlapWidth = overlapEnd - overlapStart;

      if (overlapWidth <= 0) {
        setGameState('ended');
        return;
      }

      blocks.push({ x: overlapStart, w: overlapWidth, y: canvas.height - (blocks.length + 1) * blockHeight });
      currentBlock = { x: 0, w: overlapWidth, dx: 4 + blocks.length * 0.2 };
      setScore(s => s + 1);
      
      if (blocks.length > 5) {
        cameraY = (blocks.length - 5) * blockHeight;
      }
    };

    canvas.addEventListener('mousedown', handleInput);
    window.addEventListener('keydown', (e) => { 
      if (e.code === 'Space') {
        e.preventDefault();
        handleInput(); 
      }
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(0, cameraY);

      // Draw background
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, -cameraY, canvas.width, canvas.height);

      // Draw blocks
      blocks.forEach((b, i) => {
        ctx.fillStyle = `hsl(${i * 20}, 70%, 50%)`;
        ctx.fillRect(b.x, b.y, b.w, blockHeight);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(b.x, b.y, b.w, blockHeight);
      });

      // Draw current block
      ctx.fillStyle = `hsl(${blocks.length * 20}, 70%, 50%)`;
      const currentY = canvas.height - (blocks.length + 1) * blockHeight;
      ctx.fillRect(currentBlock.x, currentY, currentBlock.w, blockHeight);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(currentBlock.x, currentY, currentBlock.w, blockHeight);

      // Move current block
      currentBlock.x += currentBlock.dx;
      if (currentBlock.x < 0 || currentBlock.x + currentBlock.w > canvas.width) {
        currentBlock.dx = -currentBlock.dx;
      }

      ctx.restore();
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener('mousedown', handleInput);
      window.removeEventListener('keydown', handleInput);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-100 rounded-2xl border text-slate-900">
      <div className="text-2xl font-bold text-slate-700">Blocks: {score}</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="bg-white border-2 border-slate-200 rounded-lg shadow-lg cursor-pointer"
      />
      {gameState !== 'playing' && (
        <Button onClick={() => { setGameState('playing'); setScore(0); }} className="mt-4">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
      <p className="text-slate-500 text-sm">Press Space or Click to Drop Block</p>
    </div>
  );
}
