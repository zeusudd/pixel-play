import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const requestRef = useRef<number>(null);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddleWidth = 10;
    const paddleHeight = 80;
    let playerY = (canvas.height - paddleHeight) / 2;
    let aiY = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballDX = 4;
    let ballDY = 4;
    const ballSize = 8;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerY = e.clientY - rect.top - paddleHeight / 2;
      if (playerY < 0) playerY = 0;
      if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Draw paddles
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fill();

      // Ball movement
      ballX += ballDX;
      ballY += ballDY;

      // Wall collision
      if (ballY < ballSize || ballY > canvas.height - ballSize) ballDY = -ballDY;

      // Paddle collision
      if (ballX < 20 + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballDX = Math.abs(ballDX) * 1.1;
        ballDY += (ballY - (playerY + paddleHeight / 2)) * 0.2;
      }
      if (ballX > canvas.width - 20 - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
        ballDX = -Math.abs(ballDX) * 1.1;
        ballDY += (ballY - (aiY + paddleHeight / 2)) * 0.2;
      }

      // AI movement
      const aiCenter = aiY + paddleHeight / 2;
      if (aiCenter < ballY - 10) aiY += 3.5;
      else if (aiCenter > ballY + 10) aiY -= 3.5;

      // Scoring
      if (ballX < 0) {
        setScores(s => ({ ...s, ai: s.ai + 1 }));
        resetBall();
      } else if (ballX > canvas.width) {
        setScores(s => ({ ...s, player: s.player + 1 }));
        resetBall();
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballDX = (Math.random() > 0.5 ? 1 : -1) * 4;
      ballDY = (Math.random() > 0.5 ? 1 : -1) * 4;
    };

    draw();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border-4 border-slate-800">
      <div className="flex justify-between w-full max-w-[600px] text-4xl font-mono text-slate-400 mb-2">
        <span>{scores.player}</span>
        <span>{scores.ai}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="bg-slate-950 rounded-lg cursor-none"
      />

      {gameState !== 'playing' && (
        <Button onClick={() => setGameState('playing')} className="mt-4 bg-white text-slate-900 hover:bg-slate-200">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
      <p className="text-slate-500 text-sm">Move your mouse to control the left paddle</p>
    </div>
  );
}
