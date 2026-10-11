import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, ExternalLink, Plus, Flame, Gamepad2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

type GameType = '2048' | 'flappy' | 'snake' | 'dino' | 'cookie' | 'pong' | 'embed';

export const GamesApp: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>('2048');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string>('');

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Game Selection Bar */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-900/80 border-b border-white/10 overflow-x-auto select-none">
        {[
          { id: '2048', label: '2048 Puzzle', icon: '🔢' },
          { id: 'flappy', label: 'Flappy Bird', icon: '🐦' },
          { id: 'snake', label: 'Snake Classic', icon: '🐍' },
          { id: 'dino', label: 'Dino Runner', icon: '🦖' },
          { id: 'cookie', label: 'Cookie Clicker', icon: '🍪' },
          { id: 'pong', label: 'Retro Pong', icon: '🏓' },
          { id: 'embed', label: 'Custom Web Game', icon: '🌐' },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => {
              sound.playKeypadClick(500);
              setSelectedGame(g.id as GameType);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGame === g.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>{g.icon}</span>
            <span>{g.label}</span>
          </button>
        ))}
      </div>

      {/* Main Game Screen */}
      <div className="flex-1 p-3 sm:p-5 overflow-auto flex items-center justify-center bg-slate-950/40">
        {selectedGame === '2048' && <Game2048 />}
        {selectedGame === 'flappy' && <FlappyBirdGame />}
        {selectedGame === 'snake' && <SnakeGame />}
        {selectedGame === 'dino' && <DinoGame />}
        {selectedGame === 'cookie' && <CookieClickerGame />}
        {selectedGame === 'pong' && <PongGame />}
        {selectedGame === 'embed' && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Embed Any Unblocked Game URL</h3>
            <p className="text-xs text-slate-400">
              Paste any safe HTML5 or iframe game URL to play directly inside AuroraOS.
            </p>
            <div className="flex w-full gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/game.html"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={() => setActiveEmbedUrl(customUrl)}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 font-bold text-white text-sm cursor-pointer shadow-md"
              >
                Load Game
              </button>
            </div>
            {activeEmbedUrl && (
              <div className="w-full h-96 rounded-xl border border-white/20 overflow-hidden shadow-2xl mt-4">
                <iframe src={activeEmbedUrl} className="w-full h-full border-none" title="Custom Game" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* --- 2048 GAME COMPONENT --- */
const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(safeStorage.getItem('aurora_2048_best') || '0', 10);
  });
  const [gameOver, setGameOver] = useState<boolean>(false);

  const initGame = () => {
    let newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const addRandomTile = (currentGrid: number[][]) => {
    const emptyCells: { r: number; c: number }[] = [];
    currentGrid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) emptyCells.push({ r, c });
      });
    });
    if (emptyCells.length === 0) return currentGrid;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const clone = currentGrid.map((row) => [...row]);
    clone[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return clone;
  };

  const slideAndMergeRow = (row: number[]): { newRow: number[]; gained: number } => {
    const filtered = row.filter((val) => val !== 0);
    let gained = 0;
    const result: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        result.push(merged);
        gained += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }
    while (result.length < 4) result.push(0);
    return { newRow: result, gained };
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    let rotated = grid.map((r) => [...r]);
    let moved = false;
    let gainedTotal = 0;

    if (direction === 'left') {
      rotated = rotated.map((row) => {
        const { newRow, gained } = slideAndMergeRow(row);
        gainedTotal += gained;
        if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true;
        return newRow;
      });
    } else if (direction === 'right') {
      rotated = rotated.map((row) => {
        const reversed = [...row].reverse();
        const { newRow, gained } = slideAndMergeRow(reversed);
        gainedTotal += gained;
        const finalRow = newRow.reverse();
        if (JSON.stringify(finalRow) !== JSON.stringify(row)) moved = true;
        return finalRow;
      });
    } else if (direction === 'up') {
      // transpose
      for (let c = 0; c < 4; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const { newRow, gained } = slideAndMergeRow(col);
        gainedTotal += gained;
        for (let r = 0; r < 4; r++) {
          if (rotated[r][c] !== newRow[r]) moved = true;
          rotated[r][c] = newRow[r];
        }
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
        const { newRow, gained } = slideAndMergeRow(col);
        gainedTotal += gained;
        const reversed = newRow.reverse();
        for (let r = 0; r < 4; r++) {
          if (rotated[r][c] !== reversed[r]) moved = true;
          rotated[r][c] = reversed[r];
        }
      }
    }

    if (moved) {
      sound.playKeypadClick(500 + gainedTotal * 2);
      const withNew = addRandomTile(rotated);
      setGrid(withNew);
      const newScore = score + gainedTotal;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        safeStorage.setItem('aurora_2048_best', newScore.toString());
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, score, bestScore, gameOver]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-100 border border-slate-700';
      case 4: return 'bg-cyan-900/80 text-cyan-200 border border-cyan-700';
      case 8: return 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30';
      case 16: return 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30';
      case 32: return 'bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/30';
      case 64: return 'bg-violet-600 text-white font-extrabold shadow-md shadow-violet-600/40';
      case 128: return 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40';
      case 256: return 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/50';
      case 512: return 'bg-orange-500 text-white font-black shadow-lg shadow-orange-500/50';
      case 1024: return 'bg-rose-500 text-white font-black shadow-xl shadow-rose-500/50';
      case 2048: return 'bg-emerald-400 text-slate-950 font-black shadow-2xl shadow-emerald-400/60 scale-105';
      default: return 'bg-slate-900/60 text-transparent border border-white/5';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Score Header */}
      <div className="flex items-center justify-between w-72 sm:w-80 mb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            <span>2048</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">AURORA</span>
          </h2>
          <p className="text-[11px] text-slate-400">Use Arrow keys or WASD</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="text-sm font-bold text-sky-300 font-mono">{score}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Best</span>
            <span className="text-sm font-bold text-amber-300 font-mono">{bestScore}</span>
          </div>
          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="w-72 h-72 sm:w-80 sm:h-80 p-2.5 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl grid grid-cols-4 gap-2">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-100 ${getTileColor(
                val
              )}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}
      </div>

      {/* Mobile Touch Arrows */}
      <div className="grid grid-cols-3 gap-1.5 mt-4 sm:hidden">
        <div />
        <button
          onClick={() => move('up')}
          className="p-3 bg-white/10 rounded-xl text-lg font-bold"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => move('left')}
          className="p-3 bg-white/10 rounded-xl text-lg font-bold"
        >
          ◀
        </button>
        <button
          onClick={() => move('down')}
          className="p-3 bg-white/10 rounded-xl text-lg font-bold"
        >
          ▼
        </button>
        <button
          onClick={() => move('right')}
          className="p-3 bg-white/10 rounded-xl text-lg font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

/* --- FLAPPY BIRD COMPONENT --- */
const FlappyBirdGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(safeStorage.getItem('aurora_flappy_high') || '0', 10);
  });
  const [isDead, setIsDead] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let birdY = 160;
    let birdV = 0;
    const gravity = 0.38;
    const jump = -6.5;
    let pipes: { x: number; topH: number; bottomY: number; passed: boolean }[] = [];
    let frame = 0;
    let currentScore = 0;
    let animationId: number;
    let active = true;

    const flap = () => {
      if (isDead) return;
      birdV = jump;
      sound.playSoundEffect('jump');
    };

    const handleCanvasClick = () => {
      if (!isPlaying || isDead) {
        // restart
        birdY = 160;
        birdV = 0;
        pipes = [];
        currentScore = 0;
        setScore(0);
        setIsDead(false);
        setIsPlaying(true);
      } else {
        flap();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleCanvasClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleCanvasClick);

    const loop = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aurora Dusk Background
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0c1b33');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying && !isDead) {
        birdV += gravity;
        birdY += birdV;

        // Spawn pipes
        if (frame % 90 === 0) {
          const gap = 110;
          const topH = Math.floor(Math.random() * (canvas.height - gap - 60)) + 30;
          pipes.push({
            x: canvas.width,
            topH,
            bottomY: topH + gap,
            passed: false,
          });
        }

        // Update pipes
        pipes.forEach((p) => {
          p.x -= 2.2;
          if (!p.passed && p.x + 40 < 50) {
            p.passed = true;
            currentScore++;
            setScore(currentScore);
            sound.playSoundEffect('coin');
            if (currentScore > highScore) {
              setHighScore(currentScore);
              safeStorage.setItem('aurora_flappy_high', currentScore.toString());
            }
          }
        });
        pipes = pipes.filter((p) => p.x > -60);

        // Check collision
        if (birdY < 0 || birdY > canvas.height - 20) {
          setIsDead(true);
          sound.playSoundEffect('oof');
        }

        pipes.forEach((p) => {
          if (50 + 16 > p.x && 50 - 16 < p.x + 40) {
            if (birdY - 12 < p.topH || birdY + 12 > p.bottomY) {
              setIsDead(true);
              sound.playSoundEffect('oof');
            }
          }
        });

        frame++;
      }

      // Draw pipes
      pipes.forEach((p) => {
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 3;
        // Top pipe
        ctx.fillRect(p.x, 0, 40, p.topH);
        ctx.strokeRect(p.x, 0, 40, p.topH);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottomY, 40, canvas.height - p.bottomY);
        ctx.strokeRect(p.x, p.bottomY, 40, canvas.height - p.bottomY);
      });

      // Draw Bird
      ctx.save();
      ctx.translate(50, birdY);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      // Eye & beak
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(7, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(20, 2);
      ctx.lineTo(12, 6);
      ctx.fill();
      ctx.restore();

      // UI Overlays
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or Tap to Play', canvas.width / 2, canvas.height / 2);
      } else if (isDead) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Score: ${currentScore}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Tap to Try Again', canvas.width / 2, canvas.height / 2 + 35);
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      active = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlaying, isDead, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-80 mb-2">
        <span className="font-bold text-white flex items-center gap-1.5">
          <span>Flappy Aurora</span>
        </span>
        <div className="flex gap-3 text-xs font-mono">
          <span className="text-sky-300">Score: {score}</span>
          <span className="text-amber-300">Best: {highScore}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={400}
        className="rounded-2xl border border-white/20 shadow-2xl cursor-pointer"
      />
      <p className="text-[11px] text-slate-400 mt-2">Tap screen or press SPACE to flap</p>
    </div>
  );
};

/* --- SNAKE GAME COMPONENT --- */
const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const gridSize = 20;

  const restart = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDir({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setFood({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dir.y !== 1) {
        setDir({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dir.y !== 1) {
        setDir({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dir.x !== 1) {
        setDir({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dir.x !== -1) {
        setDir({ x: 1, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

        // Wall collision wrap
        if (head.x < 0) head.x = gridSize - 1;
        if (head.x >= gridSize) head.x = 0;
        if (head.y < 0) head.y = gridSize - 1;
        if (head.y >= gridSize) head.y = 0;

        // Self collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          sound.playSoundEffect('oof');
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          sound.playSoundEffect('coin');
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [dir, food, isGameOver, isPaused]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-72 mb-2">
        <h3 className="font-bold text-white">Snake Neon</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 text-sm">Score: {score}</span>
          <button
            onClick={restart}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="relative bg-slate-950 border-2 border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 280, height: 280 }}
      >
        {/* Snake render */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            className={`absolute rounded-sm ${
              idx === 0
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'bg-emerald-600/90'
            }`}
            style={{
              left: seg.x * 14,
              top: seg.y * 14,
              width: 13,
              height: 13,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e] animate-pulse"
          style={{
            left: food.x * 14 + 1,
            top: food.y * 14 + 1,
            width: 12,
            height: 12,
          }}
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center">
            <span className="text-rose-400 font-bold text-lg mb-2">Game Over</span>
            <button
              onClick={restart}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-2">Arrow keys or WASD to turn</p>
    </div>
  );
};

/* --- DINO RUNNER COMPONENT --- */
const DinoGame: React.FC = () => {
  const [dinoY, setDinoY] = useState<number>(0);
  const [cactusX, setCactusX] = useState<number>(320);
  const [score, setScore] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isDead, setIsDead] = useState<boolean>(false);

  const jump = () => {
    if (isJumping || isDead) return;
    setIsJumping(true);
    sound.playSoundEffect('jump');
    let h = 0;
    const up = setInterval(() => {
      h += 6;
      setDinoY(h);
      if (h >= 65) {
        clearInterval(up);
        const down = setInterval(() => {
          h -= 6;
          setDinoY(h);
          if (h <= 0) {
            clearInterval(down);
            setDinoY(0);
            setIsJumping(false);
          }
        }, 22);
      }
    }, 22);
  };

  useEffect(() => {
    if (isDead) return;
    const interval = setInterval(() => {
      setCactusX((prev) => {
        if (prev <= -20) {
          setScore((s) => s + 1);
          return 340;
        }
        // Collision check
        if (prev > 20 && prev < 55 && dinoY < 35) {
          sound.playSoundEffect('oof');
          setIsDead(true);
        }
        return prev - 5;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [dinoY, isDead]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-80 mb-2 font-mono text-xs text-sky-300">
        <span>T-Rex Desert Sprint</span>
        <span>Score: {score}</span>
      </div>

      <div
        onClick={isDead ? () => { setIsDead(false); setScore(0); setCactusX(320); } : jump}
        className="w-80 h-44 bg-slate-900 border border-white/20 rounded-2xl relative overflow-hidden cursor-pointer shadow-xl select-none"
      >
        {/* Ground */}
        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-slate-600" />

        {/* Dino */}
        <div
          className="absolute left-6 text-2xl transition-transform"
          style={{ bottom: 16 + dinoY }}
        >
          🦖
        </div>

        {/* Cactus */}
        <div
          className="absolute text-xl"
          style={{ bottom: 16, left: cactusX }}
        >
          🌵
        </div>

        {isDead && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <span className="text-rose-400 font-bold mb-1">Crashed!</span>
            <span className="text-xs text-white">Tap to restart</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Click or press Space to jump</p>
    </div>
  );
};

/* --- COOKIE CLICKER DELUXE --- */
const CookieClickerGame: React.FC = () => {
  const [cookies, setCookies] = useState<number>(0);
  const [cps, setCps] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);
  const [buildings, setBuildings] = useState<{ id: string; name: string; cost: number; cps: number; count: number }[]>([
    { id: 'cursor', name: 'Auto Cursor', cost: 15, cps: 1, count: 0 },
    { id: 'grandma', name: 'Baker Grandma', cost: 100, cps: 5, count: 0 },
    { id: 'bakery', name: 'Aurora Bakery', cost: 1100, cps: 32, count: 0 },
    { id: 'factory', name: 'Cookie Mine', cost: 12000, cps: 260, count: 0 },
  ]);

  const clickCookie = () => {
    sound.playSoundEffect('coin');
    setCookies((c) => c + clickPower);
  };

  const buyBuilding = (id: string) => {
    const b = buildings.find((x) => x.id === id);
    if (!b || cookies < b.cost) return;

    sound.playSoundEffect('levelup');
    setCookies((c) => c - b.cost);
    setCps((current) => current + b.cps);
    setBuildings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, count: item.count + 1, cost: Math.floor(item.cost * 1.15) }
          : item
      )
    );
  };

  useEffect(() => {
    if (cps === 0) return;
    const interval = setInterval(() => {
      setCookies((c) => c + cps / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [cps]);

  return (
    <div className="w-full max-w-xl flex flex-col sm:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-black text-amber-300 font-mono">
          {Math.floor(cookies).toLocaleString()} Cookies
        </h3>
        <p className="text-xs text-slate-400 mb-4">{cps} per second</p>
        <button
          onClick={clickCookie}
          className="text-8xl hover:scale-110 active:scale-95 transition-transform duration-100 cursor-pointer drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)]"
        >
          🍪
        </button>
      </div>

      <div className="flex-1 w-full space-y-2 max-h-72 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Store Upgrades
        </div>
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => buyBuilding(b.id)}
            disabled={cookies < b.cost}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
              cookies >= b.cost
                ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                : 'bg-white/5 border-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="text-xs font-bold">{b.name} ({b.count})</div>
              <div className="text-[10px] text-slate-400">+{b.cps} cps each</div>
            </div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {b.cost} 🍪
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* --- RETRO PONG --- */
const PongGame: React.FC = () => {
  const [playerY, setPlayerY] = useState<number>(80);
  const [cpuY, setCpuY] = useState<number>(80);
  const [ball, setBall] = useState<{ x: number; y: number; vx: number; vy: number }>({
    x: 150,
    y: 100,
    vx: 3,
    vy: 2,
  });
  const [score, setScore] = useState<{ player: number; cpu: number }>({ player: 0, cpu: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBall((prev) => {
        let { x, y, vx, vy } = prev;
        x += vx;
        y += vy;

        // Bounce top/bottom
        if (y <= 0 || y >= 190) {
          vy = -vy;
          sound.playKeypadClick(700);
        }

        // Paddle hit player (left)
        if (x <= 15 && y >= playerY && y <= playerY + 45) {
          vx = Math.abs(vx) * 1.05;
          sound.playSoundEffect('laser');
        }

        // Paddle hit CPU (right)
        if (x >= 285 && y >= cpuY && y <= cpuY + 45) {
          vx = -Math.abs(vx) * 1.05;
          sound.playSoundEffect('laser');
        }

        // Score
        if (x < 0) {
          setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
          sound.playSoundEffect('oof');
          return { x: 150, y: 100, vx: 3, vy: 2 };
        }
        if (x > 300) {
          setScore((s) => ({ ...s, player: s.player + 1 }));
          sound.playSoundEffect('levelup');
          return { x: 150, y: 100, vx: -3, vy: 2 };
        }

        // CPU tracking
        setCpuY((c) => c + (y - (c + 20)) * 0.08);

        return { x, y, vx, vy };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [playerY, cpuY]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-72 mb-2 font-mono text-sm text-sky-300">
        <span>You: {score.player}</span>
        <span>CPU: {score.cpu}</span>
      </div>
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPlayerY(Math.max(0, Math.min(155, e.clientY - rect.top - 20)));
        }}
        className="w-[300px] h-[200px] bg-slate-950 border border-white/20 rounded-2xl relative overflow-hidden shadow-2xl cursor-none"
      >
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-r border-dashed border-white/20" />
        {/* Player paddle */}
        <div
          className="absolute left-2 w-2.5 h-11 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]"
          style={{ top: playerY }}
        />
        {/* CPU paddle */}
        <div
          className="absolute right-2 w-2.5 h-11 bg-rose-400 rounded-sm shadow-[0_0_8px_#fb7185]"
          style={{ top: cpuY }}
        />
        {/* Ball */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_8px_white]"
          style={{ left: ball.x, top: ball.y }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Move mouse up/down to control paddle</p>
    </div>
  );
};
