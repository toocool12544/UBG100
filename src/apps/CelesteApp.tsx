import React, { useState, useEffect, useRef } from 'react';
import { Mountain, Play, RotateCcw, Trophy, ArrowUp } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CelesteApp: React.FC = () => {
  const [altitude, setAltitude] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [isClimbing, setIsClimbing] = useState(false);
  const [bestAltitude, setBestAltitude] = useState(0);
  const [dashAvailable, setDashAvailable] = useState(true);

  const handleClimb = () => {
    sound.playSoundEffect('jump');
    if (stamina <= 0) {
      sound.playSoundEffect('powerdown');
      setIsClimbing(false);
      return;
    }
    const gain = Math.floor(Math.random() * 40) + 20;
    setAltitude((prev) => {
      const next = prev + gain;
      if (next > bestAltitude) setBestAltitude(next);
      return next;
    });
    setStamina((prev) => Math.max(0, prev - 15));
  };

  const handleDash = () => {
    if (!dashAvailable) return;
    sound.playSoundEffect('levelup');
    setDashAvailable(false);
    setAltitude((prev) => prev + 120);
    setTimeout(() => setDashAvailable(true), 2000);
  };

  const handleRest = () => {
    sound.playSoundEffect('coin');
    setStamina((prev) => Math.min(100, prev + 35));
  };

  const handleReset = () => {
    sound.playSoundEffect('powerdown');
    setAltitude(0);
    setStamina(100);
    setDashAvailable(true);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Celeste: Mountain Summit Jumper</h1>
            <p className="text-xs text-slate-400">Scale the windy peaks • Manage stamina and dash jump</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Restart climb"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Summit Display */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-sky-950/60 border border-sky-400/20 shadow-2xl text-center space-y-4">
        <div className="flex items-center justify-center gap-4 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-300">
            Altitude: {altitude}m
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Best: {bestAltitude}m</span>
          </span>
        </div>

        {/* Stamina Bar */}
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Stamina</span>
            <span>{stamina}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                stamina > 30 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-rose-500'
              }`}
              style={{ width: `${stamina}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleClimb}
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
          >
            Jump & Climb (+20m)
          </button>
          <button
            onClick={handleDash}
            disabled={!dashAvailable}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/25 active:scale-95 cursor-pointer"
          >
            {dashAvailable ? 'Super Dash (+120m)' : 'Dash Recharging...'}
          </button>
          <button
            onClick={handleRest}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            Rest on Ledge (+35%)
          </button>
        </div>
      </div>
    </div>
  );
};
