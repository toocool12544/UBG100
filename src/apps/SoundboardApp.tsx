import React, { useState } from 'react';
import { Volume2, Plus, Trash2, VolumeX } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface SoundItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  color: string;
  freq?: number;
}

export const SoundboardApp: React.FC = () => {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmoji, setNewEmoji] = useState<string>('🔔');
  const [newCategory, setNewCategory] = useState<string>('Custom');

  const playEffect = (item: SoundItem) => {
    setActiveSound(item.id);
    if (item.freq) {
      sound.playKeypadClick(item.freq);
    } else {
      sound.playKeypadClick(520);
    }
    setTimeout(() => setActiveSound(null), 300);
  };

  const handleAddSound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: SoundItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji.trim() || '🔊',
      category: newCategory.trim() || 'Custom',
      color: 'from-amber-500 to-orange-600',
      freq: 400 + Math.floor(Math.random() * 600),
    };

    setSounds((prev) => [...prev, newItem]);
    setNewName('');
    setShowAdd(false);
    sound.playSoundEffect('levelup');
  };

  const handleRemoveSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(400);
    setSounds((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSounds = sounds.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-orange-400 flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-amber-500" />
            <span>Meme & Gaming Soundboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% Client-side Web Audio synthesis with instant zero-latency playback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sounds.length > 0 && (
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter sounds..."
              className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-48"
            />
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sound</span>
          </button>
        </div>
      </div>

      {/* Add Sound Form Modal / Inline */}
      {showAdd && (
        <form
          onSubmit={handleAddSound}
          className="p-4 mb-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex flex-wrap gap-3 items-center"
        >
          <input
            type="text"
            placeholder="Sound name (e.g., Victory Chime)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400 flex-1 min-w-[180px]"
          />
          <input
            type="text"
            placeholder="Emoji (e.g. 🔔)"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="w-16 px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-center text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-slate-950 cursor-pointer"
          >
            Save Sound
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Grid or Empty State */}
      {sounds.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-4">
            <VolumeX className="w-8 h-8 text-amber-400/50" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Sounds in Soundboard</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            All default soundboards have been removed. You can create custom synth sound effects by clicking "Add Sound" above.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Sound</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto pr-1">
          {filteredSounds.map((s) => {
            const isActive = activeSound === s.id;
            return (
              <div
                key={s.id}
                onClick={() => playEffect(s)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 select-none group ${
                  isActive
                    ? 'scale-95 bg-amber-500/30 border-amber-400 shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={(e) => handleRemoveSound(s.id, e)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="text-3xl filter drop-shadow">{s.emoji}</div>
                <div className="text-xs font-bold text-white text-center truncate max-w-full">
                  {s.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-white/5">
                  {s.category}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
