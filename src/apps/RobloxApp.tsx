import React, { useState } from 'react';
import { Play, Volume2, Shield, Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const RobloxApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'obby' | 'sounds'>('obby');
  const [obbyScore, setObbyScore] = useState<number>(0);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isFallen, setIsFallen] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  // 7 Platforms: true = safe, false = red lava trap!
  const platforms = [
    { id: 0, safe: true, label: 'Start Checkpoint' },
    { id: 1, safe: true, label: 'Platform 1' },
    { id: 2, safe: false, label: 'Red Lava Block!' },
    { id: 3, safe: true, label: 'Platform 2' },
    { id: 4, safe: true, label: 'Platform 3' },
    { id: 5, safe: false, label: 'Neon Void!' },
    { id: 6, safe: true, label: 'Golden Summit Portal' },
  ];

  const jumpPlatform = (targetIdx: number) => {
    sound.playSoundEffect('jump');
    setPlayerStep(targetIdx);

    if (!platforms[targetIdx].safe) {
      sound.playSoundEffect('oof');
      setIsFallen(true);
    } else if (targetIdx === 6) {
      sound.playSoundEffect('levelup');
      setHasWon(true);
      setObbyScore((s) => s + 100);
    } else {
      sound.playSoundEffect('coin');
      setObbyScore((s) => s + 10);
    }
  };

  const restartObby = () => {
    setPlayerStep(0);
    setIsFallen(false);
    setHasWon(false);
  };

  const ROBLOX_SOUNDS = [
    { id: 'oof', name: 'Classic OOF Death', tag: 'Roblox 2006' },
    { id: 'laser', name: 'Laser Blaster', tag: 'Sci-Fi' },
    { id: 'airhorn', name: 'Speedrun Airhorn', tag: 'Meme' },
    { id: 'levelup', name: 'Badge Awarded Chime', tag: 'Trophy' },
    { id: 'vineboom', name: 'Boom Bass Drop', tag: 'SFX' },
    { id: 'metalpipe', name: 'Sword Clash Metal', tag: 'Combat' },
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      {/* Top Switcher */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center">
            <div className="w-5 h-5 bg-white rotate-12 rounded-[2px] flex items-center justify-center">
              <div className="w-2 h-2 bg-neutral-900" />
            </div>
          </div>
          <div>
            <h2 className="font-black text-white text-base">Roblox Hub & Obby Simulator</h2>
            <p className="text-xs text-slate-400">Playable 2D obstacle course + classic sound fx</p>
          </div>
        </div>

        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('obby')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'obby' ? 'bg-sky-500 text-white' : 'text-slate-400'
            }`}
          >
            Obby Parkour
          </button>
          <button
            onClick={() => setActiveTab('sounds')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sounds' ? 'bg-sky-500 text-white' : 'text-slate-400'
            }`}
          >
            Soundboard
          </button>
        </div>
      </div>

      {/* Obby Platformer Tab */}
      {activeTab === 'obby' && (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center justify-between w-full max-w-md mb-3 font-mono text-xs text-sky-300">
            <span>Stage: {playerStep} / 6</span>
            <span>Robux / Score: {obbyScore} 🪙</span>
          </div>

          <div className="relative w-full max-w-md h-64 bg-neutral-950 border-2 border-white/15 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-950/60 to-neutral-950 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-center text-xs text-slate-400">
              <span>Start</span>
              <span className="text-amber-400 font-bold">Summit Portal 🏆</span>
            </div>

            {/* Platform Path */}
            <div className="relative z-10 flex items-center justify-between gap-2 my-auto">
              {platforms.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => jumpPlatform(idx)}
                  disabled={isFallen || hasWon}
                  className={`h-16 flex-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    playerStep === idx
                      ? 'border-sky-400 bg-sky-500/30 scale-105 shadow-lg shadow-sky-500/20'
                      : p.safe
                      ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'
                      : 'border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 animate-pulse'
                  }`}
                >
                  <span className="text-base">{playerStep === idx ? '🏃' : p.safe ? '🟦' : '🟥'}</span>
                  <span className="text-[9px] font-bold text-slate-300 mt-1">{p.id}</span>
                </button>
              ))}
            </div>

            {/* Result Dialog */}
            {isFallen && (
              <div className="relative z-20 p-2 rounded-xl bg-rose-950/90 border border-rose-500 text-center">
                <span className="text-rose-300 font-bold text-xs block mb-1">
                  OOF! You touched lava!
                </span>
                <button
                  onClick={restartObby}
                  className="px-3 py-1 rounded bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  Respawn
                </button>
              </div>
            )}

            {hasWon && (
              <div className="relative z-20 p-2 rounded-xl bg-emerald-950/90 border border-emerald-400 text-center">
                <span className="text-emerald-300 font-bold text-xs block mb-1">
                  Obby Completed! +100 Points! 🏆
                </span>
                <button
                  onClick={restartObby}
                  className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Click platforms to leap forward! Avoid red blocks or you will OOF!
          </p>
        </div>
      )}

      {/* Sounds Tab */}
      {activeTab === 'sounds' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          {ROBLOX_SOUNDS.map((s) => (
            <button
              key={s.id}
              onClick={() => sound.playSoundEffect(s.id)}
              className="p-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-sky-400/50 hover:bg-white/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 shadow-lg group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 group-hover:bg-sky-500 text-sky-300 group-hover:text-white flex items-center justify-center mb-2 transition-colors">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-white">{s.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{s.tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
