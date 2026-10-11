import React, { useState } from 'react';
import { Volume2, Sparkles, Flame, Search } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface SoundItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  color: string;
}

const SOUNDS: SoundItem[] = [
  { id: 'airhorn', name: 'Air Horn', emoji: '📯', category: 'Viral', color: 'from-amber-500 to-red-600' },
  { id: 'vineboom', name: 'Vine Boom', emoji: '💥', category: 'Bass', color: 'from-purple-600 to-indigo-900' },
  { id: 'bruh', name: 'Bruh Moment', emoji: '🗿', category: 'Vocal', color: 'from-stone-600 to-stone-800' },
  { id: 'discord', name: 'Discord Ping', emoji: '🔔', category: 'Notification', color: 'from-indigo-500 to-blue-700' },
  { id: 'metalpipe', name: 'Metal Pipe Drop', emoji: '🔩', category: 'Chaos', color: 'from-slate-500 to-zinc-700' },
  { id: 'oof', name: 'Roblox OOF', emoji: '🧱', category: 'Gaming', color: 'from-rose-500 to-red-700' },
  { id: 'levelup', name: 'Level Up Fanfare', emoji: '✨', category: 'Jingle', color: 'from-emerald-500 to-teal-700' },
  { id: 'laser', name: 'Sci-Fi Laser', emoji: '⚡', category: 'Action', color: 'from-cyan-400 to-blue-600' },
  { id: 'coin', name: 'Retro Coin', emoji: '🪙', category: '8-Bit', color: 'from-yellow-400 to-amber-600' },
  { id: 'jump', name: 'Spring Jump', emoji: '🍄', category: '8-Bit', color: 'from-orange-500 to-amber-600' },
  { id: 'explosion', name: 'Deep Detonation', emoji: '💣', category: 'Bass', color: 'from-red-600 to-rose-900' },
  { id: 'keypad', name: 'Tactile Click', emoji: '⌨️', category: 'UI', color: 'from-teal-500 to-emerald-700' },
];

export const SoundboardApp: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  const playEffect = (id: string) => {
    setActiveSound(id);
    sound.playSoundEffect(id);
    setTimeout(() => setActiveSound(null), 300);
  };

  const filteredSounds = SOUNDS.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-orange-400 flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-amber-500" />
            <span>Meme & Gaming Soundboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% Client-side Web Audio synthesis with instant zero-latency playback.
          </p>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter sound effects..."
          className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-56"
        />
      </div>

      {/* Grid of Sound Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 flex-1 overflow-y-auto">
        {filteredSounds.map((s) => {
          const isActive = activeSound === s.id;
          return (
            <button
              key={s.id}
              onClick={() => playEffect(s.id)}
              className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg active:scale-95 group relative overflow-hidden ${
                isActive
                  ? 'border-amber-400 bg-amber-500/30 scale-95 shadow-amber-500/30'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/40'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-md mb-2 group-hover:scale-110 transition-transform`}
              >
                <span>{s.emoji}</span>
              </div>
              <span className="font-bold text-xs text-white group-hover:text-amber-200 transition-colors">
                {s.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {s.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
