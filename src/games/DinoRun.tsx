import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DinoRun() {
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

    let dinoY = canvas.height - 40;
    let dinoVelocity = 0;
    const gravity = 0.6;
    const jump = -12;
    let isJumping = false;

    let obstacles: any[] = [];
    let frameCount = 0;
    let speed = 5;

    const handleInput = () => {
      if (!isJumping) {
        dinoVelocity = jump;
        isJumping = true;
      }
    };

    window.addEventListener('keydown', (e) => { 
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleInput(); 
      }
    });
    canvas.addEventListener('mousedown', handleInput);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 10);
      ctx.lineTo(canvas.width, canvas.height - 10);
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Dino
      dinoVelocity += gravity;
      dinoY += dinoVelocity;
      if (dinoY > canvas.height - 40) {
        dinoY = canvas.height - 40;
        dinoVelocity = 0;
        isJumping = false;
      }
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, dinoY, 30, 30);

      // Obstacles
      if (frameCount % 100 === 0) {
        obstacles.push({ x: canvas.width, w: 20, h: 20 + Math.random() * 30 });
      }

      ctx.fillStyle = '#ef4444';
      obstacles.forEach((o, i) => {
        o.x -= speed;
        ctx.fillRect(o.x, canvas.height - 10 - o.h, o.w, o.h);

        // Collision
        if (40 + 30 > o.x && 40 < o.x + o.w) {
          if (dinoY + 30 > canvas.height - 10 - o.h) {
            setGameState('ended');
          }
        }
      });

      obstacles = obstacles.filter(o => o.x > -20);
      
      speed += 0.001;
      setScore(s => s + 1);
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
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-2xl border text-slate-900">
      <div className="text-2xl font-bold text-slate-700">Score: {Math.floor(score / 10)}</div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="bg-white border-2 border-slate-200 rounded-lg shadow-inner cursor-pointer"
      />
      {gameState !== 'playing' && (
        <Button onClick={() => { setGameState('playing'); setScore(0); }} className="mt-4">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
      <p className="text-slate-500 text-sm">Press Space or Click to Jump</p>
    </div>
  );
}
