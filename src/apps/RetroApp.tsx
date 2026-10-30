import React, { useState } from 'react';
import { Gamepad2, Play, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface RetroGame {
  id: string;
  title: string;
  system: string;
  year: string;
  color: string;
  embedUrl: string;
}

const RETRO_GAMES: RetroGame[] = [
  {
    id: 'pacman',
    title: 'Pac-Man Arcade',
    system: 'Arcade',
    year: '1980',
    color: 'from-amber-400 to-yellow-600',
    embedUrl: 'https://freepacman.org/',
  },
  {
    id: 'tetris',
    title: 'Classic Tetris 1989',
    system: 'NES',
    year: '1989',
    color: 'from-purple-500 to-indigo-600',
    embedUrl: 'https://tetris.com/play-tetris',
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders DX',
    system: 'Arcade',
    year: '1978',
    color: 'from-emerald-400 to-teal-600',
    embedUrl: 'https://www.retrogames.cc/embed/41724-space-invaders.html',
  },
  {
    id: 'super-mario',
    title: 'Super Mario Bros',
    system: 'NES',
    year: '1985',
    color: 'from-red-500 to-rose-600',
    embedUrl: 'https://supermario-game.com/',
  },
];

export const RetroApp: React.FC = () => {
  const [activeGame, setActiveGame] = useState<RetroGame | null>(null);

  return (
    <div className="p-6 text-white max-w-5xl mx-auto h-full flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-fuchsia-600/30 border border-fuchsia-400/40 flex items-center justify-center text-fuchsia-300">
          <Gamepad2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Retro Arcade Classics</h1>
          <p className="text-xs text-slate-400">Play NES, Arcade & 16-bit retro games directly in browser</p>
        </div>
      </div>

      {activeGame ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold cursor-pointer"
            >
              ← Back to Arcade Hall
            </button>
            <span className="text-xs text-slate-400 font-mono">{activeGame.title} ({activeGame.system})</span>
          </div>

          <div className="flex-1 min-h-[400px] w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
            <iframe
              src={activeGame.embedUrl}
              title={activeGame.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {RETRO_GAMES.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                sound.playSoundEffect('levelup');
                setActiveGame(game);
              }}
              className="p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-fuchsia-500/50 transition-all cursor-pointer shadow-lg hover:-translate-y-1 group flex flex-col justify-between h-48"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold font-mono text-fuchsia-300">
                  {game.system}
                </span>
                <span className="text-xs text-slate-500 font-mono">{game.year}</span>
              </div>

              <div>
                <h3 className="font-black text-lg text-white group-hover:text-fuchsia-300 transition-colors">
                  {game.title}
                </h3>
              </div>

              <div className="w-full py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-center font-bold text-xs uppercase tracking-wider shadow-md shadow-fuchsia-600/30">
                Play Arcade
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
