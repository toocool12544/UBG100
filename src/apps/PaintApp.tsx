import React, { useRef, useState, useEffect } from 'react';
import { Palette, RotateCcw, Download, Eraser, Pen } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ffffff', '#000000',
];

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = isErasing ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#0f172a' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    sound.playSoundEffect('powerdown');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    sound.playSoundEffect('coin');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'aurora-sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Pixel & Sketch Paint Studio</h1>
            <p className="text-xs text-slate-400">Draw, scribble, and export artwork</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Clear canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-500/25 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Save PNG</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseMove={draw}
          className="cursor-crosshair w-full h-full object-contain"
        />
      </div>

      {/* Palette & Brush Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsErasing(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                color === c && !isErasing ? 'scale-125 border-white ring-2 ring-sky-400' : 'border-black/40 hover:scale-110'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsErasing(!isErasing)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isErasing ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>

          <input
            type="range"
            min="1"
            max="24"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-24 accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
