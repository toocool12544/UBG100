import React, { useState } from 'react';
import { Link2, ShieldAlert, EyeOff, Bookmark, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { CLOAK_PRESETS } from '../data/appsData';

interface LinksAppProps {
  currentCloak: string;
  onSelectCloak: (cloakId: string) => void;
}

interface SavedLink {
  id: string;
  name: string;
  url: string;
  category: string;
}

const DEFAULT_LINKS: SavedLink[] = [
  { id: '1', name: 'Google Classroom Portal', url: 'https://classroom.google.com', category: 'School' },
  { id: '2', name: 'Canvas Student LMS', url: 'https://canvas.instructure.com', category: 'School' },
  { id: '3', name: 'Wikipedia Science & Math', url: 'https://wikipedia.org', category: 'Reference' },
  { id: '4', name: 'GitHub Open Source Games', url: 'https://github.com', category: 'Development' },
  { id: '5', name: 'Desmos Graphing Calculator', url: 'https://desmos.com', category: 'Utility' },
];

export const LinksApp: React.FC<LinksAppProps> = ({ currentCloak, onSelectCloak }) => {
  const [links, setLinks] = useState<SavedLink[]>(DEFAULT_LINKS);
  const [newName, setNewName] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    sound.playSoundEffect('levelup');
    setLinks([
      ...links,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        url: newUrl.trim(),
        category: 'Custom',
      },
    ]);
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-cyan-300 flex items-center gap-2">
          <Link2 className="w-6 h-6 text-cyan-400" />
          <span>Stealth Links & Tab Cloak Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure stealth disguise presets and manage your unblocked bookmarks library.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Tab Cloaker Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm text-white">Tab Cloaking (Stealth Mode)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Instantly disguises your browser tab title and favicon as school apps so nobody notices unblocked games.
          </p>

          <div className="space-y-2 flex-1">
            {CLOAK_PRESETS.map((p) => {
              const isSelected = currentCloak === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playSoundEffect('coin');
                    onSelectCloak(p.id);
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/10'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">
                      {p.id === 'docs' ? '📄' : p.id === 'classroom' ? '🏫' : p.id === 'canvas' ? '🔴' : p.id === 'wikipedia' ? '🌐' : p.id === 'desmos' ? '📈' : '⚡'}
                    </span>
                    <span className="text-xs">{p.title}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[11px] text-cyan-200">
            💡 <strong>Panic Button:</strong> Click "Lock" in top bar or press Escape to quickly protect your screen!
          </div>
        </div>

        {/* Bookmarks Library */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Saved Unblocked Links</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Direct shortcuts to approved school resources and web games.
          </p>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px] mb-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs transition-colors group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{link.url}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            ))}
          </div>

          <form onSubmit={addLink} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Site Name"
                className="w-1/3 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
              />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              + Add Custom Bookmark
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
