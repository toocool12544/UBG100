import React, { useState } from 'react';
import { Code2, Plus, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface CustomAppEntry {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}

export const AppCreatorApp: React.FC = () => {
  const [customApps, setCustomApps] = useState<CustomAppEntry[]>(() => {
    try {
      const saved = safeStorage.getItem('aurora_custom_apps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [icon, setIcon] = useState<string>('🎮');
  const [success, setSuccess] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    sound.playSoundEffect('levelup');
    const newEntry: CustomAppEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim() || '🚀',
      category: 'Custom',
    };

    const updated = [...customApps, newEntry];
    setCustomApps(updated);
    safeStorage.setItem('aurora_custom_apps', JSON.stringify(updated));
    setName('');
    setUrl('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const removeApp = (id: string) => {
    sound.playKeypadClick(400);
    const updated = customApps.filter((a) => a.id !== id);
    setCustomApps(updated);
    safeStorage.setItem('aurora_custom_apps', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-teal-300 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-teal-400" />
          <span>App & Game Launcher Creator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Add your own unblocked web games, tools, or proxy links into AuroraOS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Creator Form */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Create New Web App</span>
          </h3>
          <form onSubmit={createApp} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                App Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Slope Unblocked"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Game / Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/game"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Icon Emoji / Symbol
              </label>
              <div className="flex gap-2">
                {['🎮', '🕹️', '🚀', '🔥', '💎', '⭐'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setIcon(em)}
                    className={`w-9 h-9 rounded-xl border text-sm flex items-center justify-center cursor-pointer ${
                      icon === em ? 'border-teal-400 bg-teal-500/20' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register App</span>
            </button>
            {success && (
              <div className="text-[11px] text-emerald-400 font-medium text-center flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>App created successfully!</span>
              </div>
            )}
          </form>
        </div>

        {/* Created Apps List & Iframe Preview */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <h3 className="font-bold text-sm text-white mb-3">
            Custom Installed Apps ({customApps.length})
          </h3>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px]">
            {customApps.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-10">
                No custom apps created yet. Create one on the left!
              </div>
            ) : (
              customApps.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{a.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{a.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px] font-mono">
                        {a.url}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewUrl(a.url)}
                      className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs hover:bg-teal-500 hover:text-slate-950 transition-colors cursor-pointer"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => removeApp(a.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 px-1.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {previewUrl && (
            <div className="mt-3 p-2 bg-slate-950 rounded-xl border border-white/15">
              <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400">
                <span>Embedded View</span>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="text-rose-400 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <iframe src={previewUrl} className="w-full h-40 rounded border-none" title="App Preview" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
