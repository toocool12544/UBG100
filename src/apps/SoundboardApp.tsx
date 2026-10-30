import React, { useState } from 'react';
import { Volume2, Sparkles, Zap, Flame, Radio } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface SoundItem {
  id: string;
  name: string;
  color: string;
  frequency: number;
}

const SOUNDS: SoundItem[] = [
  { id: 'coin', name: 'Mario Coin', color: 'bg-amber-500/20 text-amber-300 border-amber-400/30', frequency: 987 },
  { id: 'jump', name: 'Retro Jump', color: 'bg-sky-500/20 text-sky-300 border-sky-400/30', frequency: 440 },
  { id: 'laser', name: 'Sci-Fi Laser', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30', frequency: 1200 },
  { id: 'powerup', name: 'Level Up', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30', frequency: 523 },
  { id: 'powerdown', name: 'OOF / Game Over', color: 'bg-rose-500/20 text-rose-300 border-rose-400/30', frequency: 180 },
  { id: 'horn', name: 'Air Horn Stun', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30', frequency: 650 },
  { id: 'anvil', name: 'Minecraft Anvil', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30', frequency: 320 },
  { id: 'sheesh', name: 'Vine Boom', color: 'bg-red-500/20 text-red-300 border-red-400/30', frequency: 90 },
];

export const SoundboardApp: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlaySound = (soundItem: SoundItem) => {
    sound.playSoundEffect(soundItem.id as any);
    setPlayingId(soundItem.id);
    setTimeout(() => setPlayingId(null), 400);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Meme Soundboard FX Deck</h1>
          <p className="text-xs text-slate-400">Instant audio triggers, arcade tones & vine booms</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            onClick={() => handlePlaySound(s)}
            className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-150 active:scale-90 cursor-pointer shadow-lg ${s.color} ${
              playingId === s.id ? 'scale-95 ring-2 ring-white/50 brightness-125' : 'hover:-translate-y-1'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Volume2 className={`w-6 h-6 ${playingId === s.id ? 'animate-ping' : ''}`} />
            </div>
            <span className="font-bold text-xs text-center">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
