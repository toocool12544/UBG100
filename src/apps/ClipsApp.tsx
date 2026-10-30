import React, { useState } from 'react';
import { Film, Play, Eye, Flame, Share2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Clip {
  id: string;
  title: string;
  game: string;
  views: string;
  duration: string;
  embedUrl: string;
}

const CLIPS: Clip[] = [
  { id: '1', title: 'INSANE 360 Trickshot Clutch (1v5)', game: 'Valorant', views: '1.2M', duration: '0:45', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
  { id: '2', title: 'Minecraft Speedrun World Record Pace (Dragon Kill)', game: 'Minecraft', views: '840K', duration: '1:12', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
  { id: '3', title: 'Subway Surfers Infinite Score Glitch Revealed', game: 'Subway Surfers', views: '650K', duration: '0:38', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
  { id: '4', title: 'Roblox Obby World Record Speedrun Skip', game: 'Roblox', views: '420K', duration: '0:50', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
];

export const ClipsApp: React.FC = () => {
  const [activeClip, setActiveClip] = useState<Clip>(CLIPS[0]);

  return (
    <div className="p-6 text-white max-w-5xl mx-auto h-full flex flex-col overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Clips & Gaming Highlights</h1>
          <p className="text-xs text-slate-400">Trending viral gaming clutches, trickshots & shorts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Main Player */}
        <div className="md:col-span-2 flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={activeClip.embedUrl}
              title={activeClip.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="autoplay; fullscreen"
            />
          </div>
          <div className="p-4">
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase">
              {activeClip.game}
            </span>
            <h2 className="text-lg font-black text-white mt-1">{activeClip.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {activeClip.views} views</span>
              <span>•</span>
              <span>{activeClip.duration}</span>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="space-y-2 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">More Viral Clips</h3>
          {CLIPS.map((clip) => (
            <div
              key={clip.id}
              onClick={() => {
                sound.playKeypadClick(400);
                setActiveClip(clip);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                activeClip.id === clip.id
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/20'
              }`}
            >
              <span className="text-[10px] text-red-400 font-bold uppercase">{clip.game}</span>
              <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{clip.title}</h4>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">{clip.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
