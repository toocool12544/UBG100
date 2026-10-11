import React, { useState, useEffect } from 'react';
import {
  Film,
  Tv,
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Music,
  Sliders,
  CloudRain,
  Flame,
  Coffee,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

/* --- MOVIES APP --- */
export const MoviesApp: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const movies = [
    {
      title: 'Night of the Living Dead',
      year: '1968',
      genre: 'Horror / Cult Classic',
      rating: '8.8',
      desc: 'A group of strangers barricade themselves in a farmhouse while mysterious creatures surround them.',
    },
    {
      title: 'Steamboat Willie & Classic Toons',
      year: '1928',
      genre: 'Vintage Animation',
      rating: '9.2',
      desc: 'Historic early animated adventures featuring whimsical hand-drawn antics and synchronized tunes.',
    },
    {
      title: 'Voyage to the Planet of Prehistoric Women',
      year: '1968',
      genre: 'Retro Sci-Fi',
      rating: '8.0',
      desc: 'An expedition to Venus uncovers mysterious oceanic civilizations and prehistoric wonders.',
    },
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Film className="w-6 h-6 text-pink-400" />
        <h2 className="text-xl font-black text-white">Classic Cinema & Public Domain Lounge</h2>
      </div>

      <div className="relative rounded-2xl bg-slate-950 border border-white/10 p-6 flex flex-col justify-between aspect-video max-h-72 mb-4 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
            {movies[selectedMovie].genre}
          </span>
          <h3 className="text-2xl font-black text-white mt-2">{movies[selectedMovie].title}</h3>
          <p className="text-xs text-slate-300 max-w-md mt-1">{movies[selectedMovie].desc}</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              sound.playSoundEffect('levelup');
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isPlaying ? 'Buffering Stream...' : 'Play Feature'}</span>
          </button>
          <span className="text-xs text-amber-300 font-mono">★ {movies[selectedMovie].rating} / 10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {movies.map((m, idx) => (
          <div
            key={idx}
            onClick={() => {
              sound.playKeypadClick(500);
              setSelectedMovie(idx);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedMovie === idx
                ? 'bg-pink-500/20 border-pink-400 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-white mb-0.5">{m.title}</div>
            <div className="text-[10px] text-slate-400">{m.genre} • {m.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- TIKTOK REELS SIMULATOR --- */
export const TiktokApp: React.FC = () => {
  const [activeReel, setActiveReel] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  const reels = [
    { creator: '@GamerGod99', desc: 'When you find the unblocked games website in 5th period 💀', song: 'Original Sound - Aurora', likes: '1.4M' },
    { creator: '@SpeedyRunner', desc: 'World Record attempt on Celeste Mountain summit! Watch the air dash 🔥', song: 'Lofi Chiptune Remix', likes: '890K' },
    { creator: '@RedstoneKing', desc: 'I built an entire working scientific calculator in blocks!', song: '8-Bit Synth Anthem', likes: '2.1M' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-2 text-slate-100">
      <div className="relative w-full max-w-[280px] aspect-9/16 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black flex flex-col justify-between p-4">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/80 via-slate-950 to-pink-900/60 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex justify-center text-xs font-bold text-white/80 gap-3">
          <span className="text-white border-b-2 border-white pb-0.5">For You</span>
        </div>

        {/* Center Double-tap area */}
        <div
          onDoubleClick={() => {
            sound.playSoundEffect('coin');
            setLiked(!liked);
          }}
          className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
        >
          {liked && (
            <Heart className="w-16 h-16 text-rose-500 fill-current animate-ping" />
          )}
        </div>

        {/* Bottom Details + Sidebar */}
        <div className="relative z-10 flex items-end justify-between">
          <div className="max-w-[75%]">
            <div className="text-xs font-bold text-white">{reels[activeReel].creator}</div>
            <p className="text-[11px] text-slate-200 mt-1 leading-snug">{reels[activeReel].desc}</p>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span className="truncate">{reels[activeReel].song}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                sound.playSoundEffect('coin');
                setLiked(!liked);
              }}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className={`p-2.5 rounded-full ${liked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold mt-0.5">{reels[activeReel].likes}</span>
            </button>
            <button className="flex flex-col items-center cursor-pointer">
              <div className="p-2.5 rounded-full bg-white/10 text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5">8.4K</span>
            </button>
            <button
              onClick={() => {
                sound.playKeypadClick(500);
                setActiveReel((r) => (r + 1) % reels.length);
                setLiked(false);
              }}
              className="p-2 rounded-full bg-sky-500 text-slate-950 font-bold text-xs"
              title="Next Reel"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- ANIME APP --- */
export const AnimeApp: React.FC = () => {
  const [selectedAnime, setSelectedAnime] = useState<number>(0);

  const animeList = [
    { title: 'Aurora Horizon: Beyond the Sky', episodes: '24 Eps', score: '9.2', studio: 'Studio Wit', tags: 'Action, Sci-Fi' },
    { title: 'Sub-Zero Chaser: Neo Tokyo', episodes: '12 Eps', score: '8.9', studio: 'Mappa', tags: 'Cyberpunk, Thriller' },
    { title: 'Chronicles of the 8-Bit Hero', episodes: '13 Eps', score: '9.5', studio: 'Kyoto Animation', tags: 'Adventure, Fantasy' },
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Tv className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-black text-white">Anime Lounge & Trailer Portal</h2>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950 to-slate-900 border border-purple-500/20 p-6 flex flex-col justify-between aspect-video max-h-64 mb-4 overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-300">
            {animeList[selectedAnime].tags}
          </span>
          <h3 className="text-2xl font-black text-white mt-2">{animeList[selectedAnime].title}</h3>
          <p className="text-xs text-slate-300 mt-1">
            Studio: {animeList[selectedAnime].studio} • {animeList[selectedAnime].episodes}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => sound.playSoundEffect('levelup')}
            className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs cursor-pointer shadow-lg"
          >
            Watch Trailer
          </button>
          <span className="text-xs font-mono font-bold text-amber-400">★ {animeList[selectedAnime].score}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {animeList.map((a, idx) => (
          <div
            key={idx}
            onClick={() => {
              sound.playKeypadClick(500);
              setSelectedAnime(idx);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedAnime === idx
                ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-white">{a.title}</div>
            <div className="text-[10px] text-slate-400">{a.tags}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- MUSIC RADIO APP --- */
export const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rainVol, setRainVol] = useState<number>(40);
  const [lofiVol, setLofiVol] = useState<number>(80);

  const toggleMusic = () => {
    sound.playSoundEffect(isPlaying ? 'keypad' : 'levelup');
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto p-4 text-slate-100">
      <div className="w-full rounded-2xl bg-gradient-to-b from-pink-950/40 via-slate-900 to-slate-950 border border-pink-500/20 p-6 flex flex-col items-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
          <Music className={`w-10 h-10 text-pink-400 ${isPlaying ? 'animate-bounce' : ''}`} />
        </div>

        <h3 className="text-xl font-black text-white">Aurora Chill & Ambient Radio</h3>
        <p className="text-xs text-pink-300/80 mb-6">24/7 Lo-Fi Study & Focus Soundscape</p>

        <button
          onClick={toggleMusic}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer mb-6"
        >
          {isPlaying ? 'Pause Radio Stream' : 'Tune Into Radio'}
        </button>

        {/* Ambient Sound Sliders */}
        <div className="w-full space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Ambient Rain Generator</span>
            </span>
            <span className="font-mono text-slate-400">{rainVol}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={rainVol}
            onChange={(e) => setRainVol(parseInt(e.target.value, 10))}
            className="w-full accent-pink-500"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Lo-Fi Beats Volume</span>
            </span>
            <span className="font-mono text-slate-400">{lofiVol}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={lofiVol}
            onChange={(e) => setLofiVol(parseInt(e.target.value, 10))}
            className="w-full accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
};
