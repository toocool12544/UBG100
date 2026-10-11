import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Flame } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const RetroApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let paddleW = 75;
    let paddleX = (canvas.width - paddleW) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let dx = 2.8;
    let dy = -2.8;
    const ballRadius = 6;

    // Bricks
    const rowCount = 4;
    const colCount = 6;
    const brickW = 46;
    const brickH = 14;
    const brickPadding = 6;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 14;

    const bricks: { x: number; y: number; status: number; color: string }[][] = [];
    const colors = ['#f43f5e', '#fb923c', '#facc15', '#38bdf8'];
    for (let c = 0; c < colCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r] };
      }
    }

    let currentLives = 3;
    let currentScore = 0;
    let animId: number;
    let active = true;

    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = Math.max(0, Math.min(canvas.width - paddleW, relativeX - paddleW / 2));
      }
    };

    canvas.addEventListener('mousemove', mouseMoveHandler);

    const collisionDetection = () => {
      for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + brickW &&
              ballY > b.y &&
              ballY < b.y + brickH
            ) {
              dy = -dy;
              b.status = 0;
              currentScore += 10;
              setScore(currentScore);
              sound.playSoundEffect('coin');
            }
          }
        }
      }
    };

    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickW + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickH + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = bricks[c][r].color;
            ctx.shadowColor = bricks[c][r].color;
            ctx.shadowBlur = 8;
            ctx.fillRect(brickX, brickY, brickW, brickH);
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Draw Paddle
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.fillRect(paddleX, canvas.height - 14, paddleW, 10);
      ctx.shadowBlur = 0;

      collisionDetection();

      if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
        sound.playKeypadClick(700);
      }
      if (ballY + dy < ballRadius) {
        dy = -dy;
        sound.playKeypadClick(700);
      } else if (ballY + dy > canvas.height - ballRadius - 14) {
        if (ballX > paddleX && ballX < paddleX + paddleW) {
          dy = -dy;
          sound.playSoundEffect('laser');
        } else if (ballY + dy > canvas.height - ballRadius) {
          currentLives--;
          setLives(currentLives);
          sound.playSoundEffect('oof');
          if (currentLives <= 0) {
            setIsGameOver(true);
            return;
          } else {
            ballX = canvas.width / 2;
            ballY = canvas.height - 30;
            dx = 2.8;
            dy = -2.8;
            paddleX = (canvas.width - paddleW) / 2;
          }
        }
      }

      ballX += dx;
      ballY += dy;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-slate-100">
      <div className="flex items-center justify-between w-80 mb-3">
        <h3 className="font-extrabold text-pink-400 flex items-center gap-1.5 text-base">
          <Gamepad2 className="w-5 h-5 text-fuchsia-400" />
          <span>Breakout Arcade 1984</span>
        </h3>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-amber-300">Score: {score}</span>
          <span className="text-rose-400">Lives: {'❤️'.repeat(lives)}</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-fuchsia-500/30 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={330}
          height={380}
          className="cursor-crosshair bg-slate-950"
        />
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-rose-500 mb-2 font-mono">GAME OVER</span>
            <span className="text-xs text-white mb-4">Final Score: {score}</span>
            <button
              onClick={() => {
                setIsGameOver(false);
                setScore(0);
                setLives(3);
                setGameStarted(!gameStarted);
              }}
              className="px-4 py-2 rounded-xl bg-fuchsia-500 text-white font-bold text-xs cursor-pointer shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Move mouse horizontally to steer paddle</p>
    </div>
  );
};
