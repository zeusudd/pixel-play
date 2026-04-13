import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function FlappyBird() {
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

    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    const gravity = 0.25;
    const jump = -5;
    const birdSize = 20;

    let pipes: any[] = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    let frameCount = 0;

    const handleInput = () => {
      birdVelocity = jump;
    };

    window.addEventListener('keydown', (e) => { 
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleInput(); 
      }
    });
    canvas.addEventListener('mousedown', handleInput);

    const draw = () => {
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bird
      birdVelocity += gravity;
      birdY += birdVelocity;
      ctx.fillStyle = '#facc15';
      ctx.fillRect(50, birdY, birdSize, birdSize);

      // Pipes
      if (frameCount % 100 === 0) {
        const h = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, h });
      }

      ctx.fillStyle = '#22c55e';
      pipes.forEach((p, i) => {
        p.x -= 2;
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.h);
        // Bottom pipe
        ctx.fillRect(p.x, p.h + pipeGap, pipeWidth, canvas.height - p.h - pipeGap);

        // Collision
        if (50 + birdSize > p.x && 50 < p.x + pipeWidth) {
          if (birdY < p.h || birdY + birdSize > p.h + pipeGap) {
            setGameState('ended');
          }
        }

        if (p.x === 50) setScore(s => s + 1);
      });

      pipes = pipes.filter(p => p.x > -pipeWidth);

      if (birdY > canvas.height || birdY < 0) setGameState('ended');

      frameCount++;
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('mousedown', handleInput);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-sky-50 rounded-2xl border text-sky-900">
      <div className="text-2xl font-bold text-sky-900">Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="bg-sky-400 rounded-lg shadow-lg cursor-pointer"
      />
      {gameState !== 'playing' && (
        <Button onClick={() => { setGameState('playing'); setScore(0); }} className="mt-4">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
      <p className="text-sky-600 text-sm">Press Space or Click to Jump</p>
    </div>
  );
}
