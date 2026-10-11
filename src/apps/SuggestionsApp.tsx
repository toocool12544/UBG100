import React, { useState, useEffect } from 'react';
import { Lightbulb, ThumbsUp, Send, Plus, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'In Review' | 'Planned' | 'Added';
  author: string;
  date: string;
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    title: 'Add Minecraft Web Port / Eaglercraft link',
    description: 'Would love an unblocked browser voxel world so we can build houses in free period!',
    votes: 42,
    status: 'Planned',
    author: 'SteveCraft99',
    date: 'Oct 8',
  },
  {
    id: '2',
    title: 'Slope 3D Runner & Tunnel Rush',
    description: 'Fast ball rolling physics game with neon wireframe tracks.',
    votes: 38,
    status: 'Planned',
    author: 'VortexSpeed',
    date: 'Oct 9',
  },
  {
    id: '3',
    title: 'More retro soundboard effects (Vine Boom & bruh)',
    description: 'Soundboard is awesome, please add more meme sounds and anime sound effects.',
    votes: 29,
    status: 'Added',
    author: 'MemeLord',
    date: 'Oct 10',
  },
  {
    id: '4',
    title: 'Google Classroom Disguise mode (Tab Cloak)',
    description: 'Make the tab look like Google Classroom or Canvas with 1 click.',
    votes: 56,
    status: 'Added',
    author: 'StealthPro',
    date: 'Oct 10',
  },
];

export const SuggestionsApp: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    try {
      const saved = safeStorage.getItem('aurora_suggestions');
      return saved ? JSON.parse(saved) : DEFAULT_SUGGESTIONS;
    } catch {
      return DEFAULT_SUGGESTIONS;
    }
  });
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    safeStorage.setItem('aurora_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleVote = (id: string) => {
    sound.playSoundEffect('coin');
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playSoundEffect('levelup');
    const newSug: Suggestion = {
      id: Date.now().toString(),
      title: title.trim(),
      description: desc.trim() || 'New requested unblocked feature for AuroraOS.',
      votes: 1,
      status: 'In Review',
      author: 'You',
      date: 'Just now',
    };

    setSuggestions([newSug, ...suggestions]);
    setTitle('');
    setDesc('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <span>Aurora Community Suggestions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Request unblocked games, proxy mirrors, cheats, and portal features. Upvote what you want next!
          </p>
        </div>
      </div>

      {/* Main Grid: Form + List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Submit Form */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 h-fit">
          <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Submit Request</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Game or Feature Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Retro Space Invaders"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Details / Notes
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Why should this be added to AuroraOS?"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-400/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Suggestion</span>
            </button>
            {submitted && (
              <div className="text-[11px] text-emerald-400 font-medium text-center flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Submitted successfully!</span>
              </div>
            )}
          </form>
        </div>

        {/* Suggestions List */}
        <div className="md:col-span-2 space-y-3 overflow-y-auto max-h-[500px]">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Added'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'Planned'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.author} • {item.date}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Upvote Button */}
              <button
                onClick={() => handleVote(item.id)}
                className="flex flex-col items-center justify-center min-w-12 py-2 px-1 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer active:scale-95 group"
                title="Upvote this request"
              >
                <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold font-mono mt-1">{item.votes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
