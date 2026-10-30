import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Disc3,
  ListMusic,
  Radio,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  genre: string;
}

const TRACKS: Track[] = [
  {
    id: 'lofi-midnight',
    title: 'Midnight Chill (Aurora Beats)',
    artist: 'Lofi Cyberpunk',
    duration: '2:45',
    genre: 'Lofi Hip Hop',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
  },
  {
    id: 'synthwave-drive',
    title: 'Neon Horizon 1984',
    artist: 'Synthwave Pulse',
    duration: '3:18',
    genre: 'Synthwave',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80',
  },
  {
    id: 'arcade-memories',
    title: '8-Bit Nostalgia Dreams',
    artist: 'Chiptune Lab',
    duration: '2:12',
    genre: 'Chiptune',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
  },
];

export const Mp3PlayerApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const track = TRACKS[currentTrackIndex];

  const handleTogglePlay = () => {
    sound.playKeypadClick(400);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    sound.playSoundEffect('coin');
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    sound.playSoundEffect('coin');
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">MP3 & Audio Player</h1>
          <p className="text-xs text-slate-400">Synthwave, lofi radio & background focus tracks</p>
        </div>
      </div>

      {/* Main Track Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl">
        <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-white/20 shadow-xl shrink-0 group">
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <Disc3 className={`w-16 h-16 text-indigo-300 opacity-80 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
            {track.genre}
          </span>
          <h2 className="text-2xl font-black text-white">{track.title}</h2>
          <p className="text-sm text-slate-400">{track.artist}</p>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end gap-1.5 h-8 pt-2 justify-center sm:justify-start">
            {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85].map((val, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all duration-300"
                style={{
                  height: isPlaying ? `${(val * (i % 2 === 0 ? 0.9 : 1.2)) % 32}px` : '4px',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Player Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Volume2 className="w-4 h-4" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
