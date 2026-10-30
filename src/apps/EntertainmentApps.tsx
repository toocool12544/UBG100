import React, { useState } from 'react';
import { Film, Video, Tv, Music as MusicIcon, Play, Flame, Star, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

// 1. MoviesApp
export const MoviesApp: React.FC = () => {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Cinema Lounge & Movies</h1>
          <p className="text-xs text-slate-400">Top rated releases, trailers and blockbuster screenings</p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-black border border-white/10 overflow-hidden relative min-h-[340px] shadow-2xl">
        <iframe
          src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=0"
          title="Lofi Girl Radio"
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

// 2. TiktokApp
export const TiktokApp: React.FC = () => {
  return (
    <div className="p-6 text-white max-w-md mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Shorts & Reels Lounge</h1>
          <p className="text-xs text-slate-400">Infinite scroll vertical video clips</p>
        </div>
      </div>

      <div className="flex-1 rounded-3xl bg-black border border-white/15 overflow-hidden relative min-h-[420px] shadow-2xl">
        <iframe
          src="https://www.youtube-nocookie.com/embed/L_LUpnjgPso?autoplay=0"
          title="Shorts"
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

// 3. AnimeApp
export const AnimeApp: React.FC = () => {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
          <Tv className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Anime & Otaku Screening Hub</h1>
          <p className="text-xs text-slate-400">Stream popular anime intros, soundtracks & episodes</p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-black border border-white/10 overflow-hidden relative min-h-[340px] shadow-2xl">
        <iframe
          src="https://www.youtube-nocookie.com/embed/JtqIas3bYhg?autoplay=0"
          title="Anime Stream"
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

// 4. MusicApp
export const MusicApp: React.FC = () => {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400">
          <MusicIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Lofi & Synthwave Station</h1>
          <p className="text-xs text-slate-400">24/7 relaxing beats to study/game to</p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-black border border-white/10 overflow-hidden relative min-h-[340px] shadow-2xl">
        <iframe
          src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1"
          title="Lofi Radio Stream"
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};
