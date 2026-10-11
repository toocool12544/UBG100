import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Sparkles, Disc } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
}

const PLAYLIST: Track[] = [
  { id: '1', title: 'Aurora Borealis Chill', artist: 'Solara Lofi', genre: 'Chillwave', duration: '3:24' },
  { id: '2', title: 'Neon Midnight Drive', artist: 'CyberWave 84', genre: 'Synthwave', duration: '2:56' },
  { id: '3', title: 'Pixel Quest 8-Bit', artist: 'Chiptune Hero', genre: 'Retro Arcade', duration: '2:15' },
  { id: '4', title: 'Late Night Study Session', artist: 'Rainy Cafe', genre: 'Lofi Hip Hop', duration: '3:45' },
  { id: '5', title: 'Sub-Zero Drift', artist: 'Arctic Pulse', genre: 'Ambient Beats', duration: '4:10' },
];

export const Mp3PlayerApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const synthRef = useRef<ReturnType<typeof sound.createSynthBeat> | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    synthRef.current = sound.createSynthBeat();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!synthRef.current) {
      synthRef.current = sound.createSynthBeat();
    }

    if (isPlaying) {
      synthRef.current?.stop();
      setIsPlaying(false);
    } else {
      synthRef.current?.start();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    sound.playKeypadClick(600);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const prevTrack = () => {
    sound.playKeypadClick(500);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.6));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 p-4 text-slate-100 max-w-4xl mx-auto items-center justify-center">
      {/* Vinyl & Visualizer Display */}
      <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900/60 to-slate-950 border border-purple-500/20 shadow-2xl">
        <div className="relative mb-6">
          <div
            className={`w-44 h-44 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-950 to-purple-600 p-2 shadow-2xl flex items-center justify-center border-4 border-slate-900 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-purple-400 flex items-center justify-center">
              <Disc className="w-8 h-8 text-purple-300" />
            </div>
          </div>
        </div>

        {/* Real-time Visualizer bars */}
        <div className="flex items-end justify-center gap-1.5 h-12 w-full mb-4 px-4">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 60, 85, 50].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-t-sm bg-gradient-to-t from-purple-600 to-cyan-400 transition-all duration-150"
              style={{
                height: isPlaying ? `${Math.max(15, (h * (0.4 + Math.random() * 0.6)))}%` : '15%',
              }}
            />
          ))}
        </div>

        <h3 className="text-lg font-bold text-white text-center truncate max-w-full">
          {currentTrack.title}
        </h3>
        <p className="text-xs text-purple-300/80 mb-4">{currentTrack.artist} • {currentTrack.genre}</p>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 mb-4 text-[10px] text-slate-400 font-mono">
          <span>0:{Math.floor(progress * 0.6).toString().padStart(2, '0')}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{currentTrack.duration}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={prevTrack}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer active:scale-95"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-purple-500/40 cursor-pointer active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <button
            onClick={nextTrack}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 w-full max-w-sm flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center justify-between">
          <span>Aurora Audio Playlist</span>
          <span className="text-[10px] text-purple-400 font-normal">Real Audio Synthesis</span>
        </div>
        {PLAYLIST.map((track, idx) => (
          <div
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setProgress(0);
              if (!isPlaying) togglePlay();
            }}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              currentTrackIndex === idx
                ? 'bg-purple-500/20 border-purple-500/40 text-white font-medium shadow-md shadow-purple-500/10'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}</span>
              <div>
                <div className="text-xs font-semibold">{track.title}</div>
                <div className="text-[10px] text-slate-400">{track.artist}</div>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
