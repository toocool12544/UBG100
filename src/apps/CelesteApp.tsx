import React, { useState, useEffect, useRef } from 'react';
import { Mountain, RotateCcw, Trophy, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CelesteApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strawberries, setStrawberries] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(100);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isDead, setIsDead] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let px = 40;
    let py = 250;
    let vx = 0;
    let vy = 0;
    let onGround = false;
    let hasDash = true;
    let isDashing = false;
    let dashTimer = 0;

    const gravity = 0.45;
    const speed = 3.2;

    const keys: { [k: string]: boolean } = {};

    // Level Platforms
    const platforms = [
      { x: 0, y: 280, w: 120, h: 20 },
      { x: 160, y: 240, w: 80, h: 16 },
      { x: 280, y: 190, w: 90, h: 16 },
      { x: 180, y: 140, w: 70, h: 16 },
      { x: 60, y: 90, w: 80, h: 16 },
      { x: 220, y: 50, w: 140, h: 20 }, // Summit
    ];

    // Collectibles (Strawberries)
    const berries = [
      { x: 200, y: 210, collected: false },
      { x: 320, y: 160, collected: false },
      { x: 90, y: 60, collected: false },
    ];

    // Hazard Spikes
    const spikes = [
      { x: 130, y: 290, w: 25 },
      { x: 250, y: 290, w: 25 },
    ];

    let animId: number;
    let active = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if ((e.code === 'KeyZ' || e.code === 'KeyC' || e.code === 'KeyK') && hasDash && !isDashing) {
        // Air Dash!
        sound.playSoundEffect('laser');
        isDashing = true;
        hasDash = false;
        dashTimer = 10;
        const dirX = keys['ArrowRight'] || keys['KeyD'] ? 1 : keys['ArrowLeft'] || keys['KeyA'] ? -1 : 1;
        const dirY = keys['ArrowUp'] || keys['KeyW'] ? -1 : 0;
        vx = dirX * 7.5;
        vy = dirY * 7.5;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient Sky: Alpine dusk
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, '#0f172a');
      sky.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Handle input
      if (!isDashing) {
        if (keys['ArrowRight'] || keys['KeyD']) vx = speed;
        else if (keys['ArrowLeft'] || keys['KeyA']) vx = -speed;
        else vx *= 0.7;

        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && onGround) {
          vy = -8.2;
          onGround = false;
          sound.playSoundEffect('jump');
        }

        vy += gravity;
      } else {
        dashTimer--;
        if (dashTimer <= 0) {
          isDashing = false;
          vx *= 0.5;
          vy *= 0.5;
        }
      }

      px += vx;
      py += vy;

      // Platform collisions
      onGround = false;
      platforms.forEach((p) => {
        if (px + 14 > p.x && px - 14 < p.x + p.w) {
          if (py + 14 >= p.y && py - vy + 14 <= p.y + 4) {
            py = p.y - 14;
            vy = 0;
            onGround = true;
            hasDash = true; // refresh dash on ground!
          }
        }
      });

      // Bottom death
      if (py > canvas.height + 20) {
        sound.playSoundEffect('oof');
        px = 40;
        py = 250;
        vx = 0;
        vy = 0;
      }

      // Strawberries
      berries.forEach((b) => {
        if (!b.collected && Math.hypot(px - b.x, py - b.y) < 20) {
          b.collected = true;
          sound.playSoundEffect('coin');
          setStrawberries((prev) => prev + 1);
        }
      });

      // Check win at summit
      if (px > 240 && py <= 50) {
        sound.playSoundEffect('levelup');
        setHasWon(true);
      }

      // Draw Platforms
      platforms.forEach((p, idx) => {
        ctx.fillStyle = idx === platforms.length - 1 ? '#38bdf8' : '#334155';
        ctx.strokeStyle = idx === platforms.length - 1 ? '#0284c7' : '#475569';
        ctx.lineWidth = 2;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeRect(p.x, p.y, p.w, p.h);
      });

      // Draw Strawberries
      berries.forEach((b) => {
        if (!b.collected) {
          ctx.font = '16px sans-serif';
          ctx.fillText('🍓', b.x - 8, b.y + 6);
        }
      });

      // Draw Player (Madeline)
      ctx.save();
      ctx.translate(px, py);
      // Red Hair trail
      ctx.fillStyle = hasDash ? '#f43f5e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(-4, -6, 8, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-6, -4, 12, 14);
      // Face
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(-2, -6, 6, 6);
      ctx.restore();

      setAltitude(Math.floor(Math.max(100, 3000 - py * 10)));
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-slate-100">
      <div className="flex items-center justify-between w-96 mb-2">
        <h3 className="font-extrabold text-cyan-300 flex items-center gap-1.5 text-base">
          <Mountain className="w-5 h-5 text-sky-400" />
          <span>Celeste: Aurora Summit</span>
        </h3>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-rose-400 font-bold">🍓 {strawberries} / 3</span>
          <span className="text-sky-300">{altitude}m Altitude</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500/30 shadow-2xl">
        <canvas ref={canvasRef} width={380} height={320} className="bg-slate-950" />
        {hasWon && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-xl font-bold text-white mb-1">Mountain Conquered!</h4>
            <p className="text-xs text-sky-300 mb-4">You reached the Aurora Summit!</p>
            <button
              onClick={() => {
                setHasWon(false);
                setStrawberries(0);
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-mono">
        Arrow Keys/WASD to Move & Jump • Press <strong>Z / C / K</strong> to Air Dash!
      </p>
    </div>
  );
};
