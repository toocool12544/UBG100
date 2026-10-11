import React, { useState } from 'react';
import { Film, Play, Star, Clock, Info, Search, Sparkles } from 'lucide-react';

interface MovieItem {
  id: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  duration: string;
  description: string;
  badge: string;
  trailerId: string;
}

const CINEMA_CATALOG: MovieItem[] = [
  {
    id: 'cyber-2099',
    title: 'Neon Odyssey 2099',
    year: '2026',
    genre: 'Sci-Fi / Cyberpunk',
    rating: '9.4',
    duration: '2h 15m',
    description: 'In a rain-slicked mega-city powered by aurora reactors, an unblocked hacker uncovers a system anomaly that threatens reality.',
    badge: 'Trending Now',
    trailerId: 'dQw4w9WgXcQ',
  },
  {
    id: 'speed-runner',
    title: 'Sub-Pixel: The World Record',
    year: '2025',
    genre: 'Documentary / Gaming',
    rating: '9.8',
    duration: '1h 48m',
    description: 'The definitive history of speedrunners finding game-breaking glitches to beat legendary platformers in milliseconds.',
    badge: 'Staff Pick',
    trailerId: 'dQw4w9WgXcQ',
  },
  {
    id: 'celeste-summit',
    title: 'Summit of the Mountain',
    year: '2024',
    genre: 'Adventure / Animation',
    rating: '9.6',
    duration: '1h 52m',
    description: 'An introspective ascent through hazardous frozen ruins, fraught with dangerous winds and inner phantoms.',
    badge: 'Top Rated',
    trailerId: 'dQw4w9WgXcQ',
  },
  {
    id: 'retro-arcade',
    title: 'Insert Coin: 1984',
    year: '2023',
    genre: 'Retro / Thriller',
    rating: '9.1',
    duration: '2h 04m',
    description: 'A mysterious neon arcade cabinet appears at a local mall that never runs out of quarters—and traps players in its 8-bit universe.',
    badge: 'Cult Classic',
    trailerId: 'dQw4w9WgXcQ',
  },
];

export const CineraApp: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieItem>(CINEMA_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('All');

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Hero Featured Header */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/60 border border-white/10 mb-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedMovie.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {selectedMovie.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" /> {selectedMovie.rating}
            </span>
            <span>·</span>
            <span>{selectedMovie.year}</span>
            <span>·</span>
            <span>{selectedMovie.duration}</span>
            <span>·</span>
            <span>{selectedMovie.genre}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-5 leading-relaxed">
            {selectedMovie.description}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Stream</span>
            </button>
            <button
              onClick={() => alert(`Saved ${selectedMovie.title} to watchlist`)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              + Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
            <div className="p-3 bg-slate-950 flex justify-between items-center border-b border-white/10">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-500" />
                {selectedMovie.title} — Streaming Player
              </span>
              <button
                onClick={() => setIsPlaying(false)}
                className="text-slate-400 hover:text-white text-sm px-3 py-1 rounded bg-white/10 cursor-pointer"
              >
                Close Player
              </button>
            </div>
            <div className="relative aspect-video bg-black flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mb-4 animate-pulse">
                <Play className="w-8 h-8 text-rose-400 ml-1 fill-current" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Cinera Aurora High-Speed Stream</h4>
              <p className="text-xs text-slate-400 max-w-md">
                Stream buffer initialized. Unblocked fast CDN active with 0 buffering lag. Enjoy the show!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Film Catalog Cards */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
        Featured Releases & Cinema
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CINEMA_CATALOG.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMovie(m)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedMovie.id === m.id
                ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-rose-300">
                {m.genre.split('/')[0]}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">★ {m.rating}</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">{m.title}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{m.description}</p>
            <div className="text-[10px] text-slate-500">{m.duration} • {m.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
