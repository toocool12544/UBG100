import React, { useState } from 'react';
import { Gamepad2, ExternalLink, Globe, Sparkles, Plus, Trash2 } from 'lucide-react';

interface CustomGame {
  id: string;
  title: string;
  url: string;
}

export const GamesApp: React.FC = () => {
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string>('');
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);
  const [gameTitle, setGameTitle] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleLoadGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setActiveEmbedUrl(customUrl.trim());
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const newGame: CustomGame = {
      id: Date.now().toString(),
      title: gameTitle.trim() || 'Custom Game',
      url: customUrl.trim(),
    };
    setCustomGames((prev) => [...prev, newGame]);
    setActiveEmbedUrl(customUrl.trim());
    setCustomUrl('');
    setGameTitle('');
    setShowAddModal(false);
  };

  const handleRemoveGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomGames((prev) => prev.filter((g) => g.id !== id));
    if (activeEmbedUrl && customGames.find((g) => g.id === id)?.url === activeEmbedUrl) {
      setActiveEmbedUrl('');
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-100 bg-slate-950/40 p-4 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-sky-400 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-sky-500" />
            <span>Games Portal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All default games have been removed. Load or embed your own HTML5 games directly.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Game</span>
        </button>
      </div>

      {/* Add Custom Game Form */}
      {showAddModal && (
        <form
          onSubmit={handleSaveGame}
          className="p-4 mb-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col sm:flex-row gap-3 items-center"
        >
          <input
            type="text"
            placeholder="Game Title (e.g. Retro Arcade)"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="w-full sm:w-1/3 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-sky-400"
          />
          <input
            type="url"
            placeholder="Game URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-sky-400"
          />
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 font-bold text-xs text-slate-950 cursor-pointer"
            >
              Embed & Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Embedded Game Screen */}
      {activeEmbedUrl ? (
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded-xl text-xs text-slate-400">
            <span className="truncate max-w-md font-mono text-[11px]">{activeEmbedUrl}</span>
            <div className="flex items-center gap-2">
              <a
                href={activeEmbedUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
              <button
                onClick={() => setActiveEmbedUrl('')}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold"
              >
                Close Game
              </button>
            </div>
          </div>
          <div className="w-full h-[520px] rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-black">
            <iframe
              src={activeEmbedUrl}
              className="w-full h-full border-none"
              title="Custom Game"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : customGames.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mb-4">
            <Gamepad2 className="w-8 h-8 text-sky-400/50" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Games in Library</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            All default games have been removed from this app. You can load or embed any web game URL directly using the form below.
          </p>

          <form onSubmit={handleLoadGame} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input
              type="url"
              placeholder="Enter game URL (e.g. https://...)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-white focus:outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-slate-950 cursor-pointer shadow-lg"
            >
              Play Game
            </button>
          </form>
        </div>
      ) : (
        /* List of saved custom games */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {customGames.map((g) => (
            <div
              key={g.id}
              onClick={() => setActiveEmbedUrl(g.url)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/50 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-lg">
                  🎮
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{g.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{g.url}</div>
                </div>
              </div>
              <button
                onClick={(e) => handleRemoveGame(g.id, e)}
                className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
