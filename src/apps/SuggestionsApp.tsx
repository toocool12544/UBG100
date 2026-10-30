import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, Plus, Send, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Suggestion {
  id: string;
  title: string;
  votes: number;
  author: string;
  category: 'game' | 'feature' | 'stealth';
}

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: '1', title: 'Add Minecraft Eaglercraft 1.8 unblocked', votes: 42, author: 'Alex_99', category: 'game' },
  { id: '2', title: 'Google Classroom tab disguise with realistic assignments', votes: 38, author: 'GhostPlayer', category: 'stealth' },
  { id: '3', title: 'Subway Surfers Miami edition', votes: 29, author: 'SkyRunner', category: 'game' },
  { id: '4', title: 'Add panic button hotkey (double tap Escape to lock)', votes: 24, author: 'StealthPro', category: 'feature' },
];

export const SuggestionsApp: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [titleInput, setTitleInput] = useState('');
  const [category, setCategory] = useState<'game' | 'feature' | 'stealth'>('game');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleVote = (id: string) => {
    sound.playSoundEffect('coin');
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + (votedIds.has(id) ? -1 : 1) } : s))
    );
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    sound.playSoundEffect('levelup');
    const newSug: Suggestion = {
      id: Date.now().toString(),
      title: titleInput.trim(),
      votes: 1,
      author: 'You',
      category,
    };
    setSuggestions([newSug, ...suggestions]);
    setTitleInput('');
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col overflow-y-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Community Suggestions & Requests</h1>
          <p className="text-xs text-slate-400">Vote on new games, stealth mirrors, and features</p>
        </div>
      </div>

      {/* Submit Suggestion Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Suggest a game, mirror, or stealth tool..."
          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            {(['game', 'feature', 'stealth'] as const).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold cursor-pointer ${
                  category === cat
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Request</span>
          </button>
        </div>
      </form>

      {/* Suggestions List */}
      <div className="space-y-2.5">
        {suggestions.map((item) => {
          const hasVoted = votedIds.has(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center justify-between gap-4"
            >
              <div>
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] uppercase font-bold text-slate-400">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-white mt-1">{item.title}</h3>
                <span className="text-[11px] text-slate-500">Suggested by {item.author}</span>
              </div>

              <button
                onClick={() => handleVote(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  hasVoted
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{item.votes}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
