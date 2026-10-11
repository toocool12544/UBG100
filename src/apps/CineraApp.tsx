import React, { useState } from 'react';
import { Film, Play, ExternalLink, Plus, Trash2, Video } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MovieItem {
  id: string;
  title: string;
  genre: string;
  url: string;
}

export const CineraApp: React.FC = () => {
  const [catalog, setCatalog] = useState<MovieItem[]>([]);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string>('');
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [streamInput, setStreamInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handlePlayDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamInput.trim()) return;
    sound.playSoundEffect('levelup');
    setActiveStreamUrl(streamInput.trim());
    setActiveTitle(titleInput.trim() || 'Custom Stream');
  };

  const handleSaveToCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamInput.trim()) return;

    sound.playSoundEffect('levelup');
    const newEntry: MovieItem = {
      id: Date.now().toString(),
      title: titleInput.trim() || 'Custom Stream',
      genre: 'Web Video',
      url: streamInput.trim(),
    };

    setCatalog((prev) => [...prev, newEntry]);
    setActiveStreamUrl(streamInput.trim());
    setActiveTitle(titleInput.trim() || 'Custom Stream');
    setStreamInput('');
    setTitleInput('');
    setShowAddForm(false);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(400);
    setCatalog((prev) => prev.filter((item) => item.id !== id));
    if (catalog.find((item) => item.id === id)?.url === activeStreamUrl) {
      setActiveStreamUrl('');
      setActiveTitle('');
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-100 max-w-5xl mx-auto p-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-400 flex items-center gap-2">
            <Film className="w-6 h-6 text-rose-500" />
            <span>Cinera Cinema</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All default titles have been removed. Load or stream any video URL directly.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Stream</span>
        </button>
      </div>

      {/* Add Custom Stream Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveToCatalog}
          className="p-4 mb-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row gap-3 items-center"
        >
          <input
            type="text"
            placeholder="Title (e.g. Action Stream)"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="w-full sm:w-1/3 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-rose-400"
          />
          <input
            type="url"
            placeholder="Stream or Embed URL (https://...)"
            value={streamInput}
            onChange={(e) => setStreamInput(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-rose-400"
          />
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold text-xs text-white cursor-pointer"
            >
              Save & Play
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Active Video Player Screen */}
      {activeStreamUrl ? (
        <div className="flex-1 flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded-xl text-xs text-slate-300 border border-white/10">
            <span className="font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-400" />
              {activeTitle}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={activeStreamUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 text-slate-400"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
              <button
                onClick={() => {
                  setActiveStreamUrl('');
                  setActiveTitle('');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
          <div className="w-full h-[480px] rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-black">
            <iframe
              src={activeStreamUrl}
              className="w-full h-full border-none"
              title={activeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : catalog.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl mb-4">
            <Video className="w-8 h-8 text-rose-400/50" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Movies or Streams in Cinera</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            All default cineras have been removed. You can stream or embed any video URL directly using the form below.
          </p>

          <form onSubmit={handlePlayDirect} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input
              type="url"
              placeholder="Enter video or stream URL (https://...)"
              value={streamInput}
              onChange={(e) => setStreamInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-white focus:outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 font-bold text-xs text-white cursor-pointer shadow-lg"
            >
              Play Video
            </button>
          </form>
        </div>
      ) : (
        /* Saved Custom Streams */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {catalog.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveStreamUrl(item.url);
                setActiveTitle(item.title);
              }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.url}</div>
                </div>
              </div>
              <button
                onClick={(e) => handleRemove(item.id, e)}
                className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
