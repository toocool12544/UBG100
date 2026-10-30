import React, { useState, useEffect } from 'react';
import { Mic, Clock, Play, Pause, RotateCcw, Volume2, Shield } from 'lucide-react';
import { sound } from '../utils/soundEffects';

// 1. VoiceApp
export const VoiceApp: React.FC = () => {
  const [pitch, setPitch] = useState(1);
  const [isRecording, setIsRecording] = useState(false);

  const handleTestVoice = () => {
    sound.playSoundEffect('levelup');
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Audio Pitch Shifter & Voice FX</h1>
          <p className="text-xs text-slate-400">Modulate vocal frequency, helium effect & robot filters</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-300 mx-auto">
          <Mic className="w-8 h-8" />
        </div>

        <div className="max-w-xs mx-auto space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Pitch Scale</span>
            <span>{pitch.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
        </div>

        <button
          onClick={handleTestVoice}
          className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-transform cursor-pointer shadow-lg shadow-teal-500/20"
        >
          Test Frequency Tone
        </button>
      </div>
    </div>
  );
};

// 2. ClockApp
export const ClockApp: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatStopwatch = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/20 flex items-center justify-center text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Digital Clock & Stopwatch</h1>
          <p className="text-xs text-slate-400">Precision period timer, class bells & stopwatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* World Time */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current Time</span>
          <div className="text-4xl font-black font-mono text-white tracking-widest">{timeStr}</div>
          <span className="text-xs text-slate-500">{now.toDateString()}</span>
        </div>

        {/* Stopwatch */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-3">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Stopwatch</span>
          <div className="text-4xl font-black font-mono text-cyan-400 tracking-widest">
            {formatStopwatch(seconds)}
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => {
                sound.playKeypadClick(400);
                setIsRunning(!isRunning);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer active:scale-95"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                sound.playKeypadClick(300);
                setIsRunning(false);
                setSeconds(0);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
