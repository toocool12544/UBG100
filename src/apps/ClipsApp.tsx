import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, Flame, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ClipItem {
  id: string;
  title: string;
  creator: string;
  views: string;
  likes: number;
  comments: number;
  game: string;
  duration: string;
  color: string;
}

const CLIPS: ClipItem[] = [
  {
    id: '1',
    title: 'Insane 1v4 Clutched at 1 HP in Final Ring!',
    creator: 'PixelApex',
    views: '1.2M',
    likes: 84200,
    comments: 1420,
    game: 'Battle Royale',
    duration: '0:45',
    color: 'from-red-600 to-amber-700',
  },
  {
    id: '2',
    title: 'Speedrunner breaks 20-year physics barrier on world 8-4',
    creator: 'SubPixelSpeed',
    views: '840K',
    likes: 62100,
    comments: 980,
    game: 'Retro Speedruns',
    duration: '0:32',
    color: 'from-purple-600 to-indigo-800',
  },
  {
    id: '3',
    title: 'Roblox impossible obby jump that took 700 tries',
    creator: 'ObbyKing',
    views: '2.5M',
    likes: 194000,
    comments: 3100,
    game: 'Roblox Obby',
    duration: '0:28',
    color: 'from-cyan-600 to-blue-800',
  },
  {
    id: '4',
    title: 'Building a full scientific computer inside Redstone',
    creator: 'LogicMiner',
    views: '950K',
    likes: 88000,
    comments: 1650,
    game: 'Minecraft',
    duration: '0:58',
    color: 'from-emerald-600 to-teal-800',
  },
];

export const ClipsApp: React.FC = () => {
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [likesState, setLikesState] = useState<{ [id: string]: boolean }>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const clip = CLIPS[activeClipIndex];

  const toggleLike = (id: string) => {
    sound.playSoundEffect('coin');
    setLikesState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 p-3 text-slate-100 max-w-4xl mx-auto items-center justify-center">
      {/* Vertical Video Viewport */}
      <div className="relative w-full max-w-[320px] aspect-9/16 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between p-4 bg-slate-950">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${clip.color} opacity-60 pointer-events-none`}
        />

        {/* Top Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold flex items-center gap-1 border border-white/10">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{clip.game}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded">
            {clip.views} views
          </span>
        </div>

        {/* Center Play Button Graphic */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-10 self-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl"
        >
          <Play className="w-8 h-8 text-white fill-current ml-1" />
        </div>

        {/* Bottom Details & Engagement Sidebar */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="flex-1">
            <div className="text-xs font-bold text-sky-300 mb-0.5">@{clip.creator}</div>
            <p className="text-xs font-medium text-white line-clamp-2 leading-relaxed">
              {clip.title}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => toggleLike(clip.id)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`p-2.5 rounded-full ${
                  likesState[clip.id]
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/50 text-white hover:bg-black/70'
                } transition-colors`}
              >
                <Heart className={`w-5 h-5 ${likesState[clip.id] ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold mt-0.5">
                {clip.likes + (likesState[clip.id] ? 1 : 0)}
              </span>
            </button>

            <button className="flex flex-col items-center cursor-pointer">
              <div className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5">{clip.comments}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Up Next List */}
      <div className="flex-1 w-full max-w-sm flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
          Trending Gaming Clips Feed
        </h4>
        {CLIPS.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => {
              sound.playKeypadClick(500);
              setActiveClipIndex(idx);
            }}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              activeClipIndex === idx
                ? 'bg-red-500/20 border-red-500/40 text-white font-medium shadow-md'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-white line-clamp-1">{item.title}</div>
              <div className="text-[10px] text-slate-400">
                @{item.creator} • {item.game}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{item.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
