import React, { useState } from 'react';
import { Film, Play, Search, Star, Maximize2, Shield } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MovieItem {
  id: string;
  title: string;
  year: string;
  rating: string;
  genre: string;
  poster: string;
  embedUrl: string;
}

const MOVIES_CATALOG: MovieItem[] = [
  {
    id: 'spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    year: '2023',
    rating: '8.7',
    genre: 'Animation / Action',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/cqGjhVJWtEg?autoplay=1',
  },
  {
    id: 'interstellar',
    title: 'Interstellar: Deep Space Odyssey',
    year: '2014',
    rating: '8.6',
    genre: 'Sci-Fi / Adventure',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E?autoplay=1',
  },
  {
    id: 'cyberpunk-edgerunners',
    title: 'Cyberpunk: Neon Horizon',
    year: '2024',
    rating: '8.9',
    genre: 'Anime / Action',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/JtqIas3bYhg?autoplay=1',
  },
  {
    id: 'matrix',
    title: 'The Matrix: Resurrections',
    year: '2021',
    rating: '8.1',
    genre: 'Sci-Fi / Action',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9ix7TUGVYIo?autoplay=1',
  },
];

export const CineraApp: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [search, setSearch] = useState('');

  const filtered = MOVIES_CATALOG.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white max-w-5xl mx-auto h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Cinera Streamer</h1>
            <p className="text-xs text-slate-400">Unblocked cinema streams, trailers & movies</p>
          </div>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search films & genres..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {selectedMovie ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedMovie(null)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              ← Back to Cinema Catalog
            </button>
            <span className="text-xs text-slate-400 font-mono">{selectedMovie.title}</span>
          </div>

          <div className="flex-1 min-h-[350px] w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
            <iframe
              src={selectedMovie.embedUrl}
              title={selectedMovie.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((movie) => (
            <div
              key={movie.id}
              onClick={() => {
                sound.playKeypadClick(500);
                setSelectedMovie(movie);
              }}
              className="group rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden hover:border-red-500/40 transition-all cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-300" />
                  <span>{movie.rating}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/50">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-sm text-white truncate">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{movie.genre}</span>
                  <span className="font-mono">{movie.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
