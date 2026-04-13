import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>(null);

  const initGame = () => {
    setGameState('playing');
    setScore(0);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks: any[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              setScore(s => {
                const newScore = s + 1;
                if (newScore === brickRowCount * brickColumnCount) {
                  setGameState('won');
                }
                return newScore;
              });
            }
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setGameState('lost');
          return;
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
      else if (leftPressed && paddleX > 0) paddleX -= 7;

      x += dx;
      y += dy;
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-2xl border text-slate-900">
      <div className="flex justify-between w-full max-w-[480px] mb-2 font-bold text-slate-700">
        <span>Score: {score}</span>
        {gameState === 'won' && <span className="text-green-600">VICTORY!</span>}
        {gameState === 'lost' && <span className="text-red-600">GAME OVER</span>}
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="bg-white border-2 border-slate-200 rounded-lg shadow-inner"
      />

      {gameState !== 'playing' && (
        <Button onClick={initGame} className="mt-4">
          {gameState === 'idle' ? 'Start Game' : 'Play Again'}
        </Button>
      )}
    </div>
  );
}
