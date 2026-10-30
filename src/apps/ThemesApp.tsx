import React, { useState } from 'react';
import { ThemeId, ThemeConfig } from '../types';
import { THEMES_LIST } from '../data/appsData';
import { Sparkles, Image, Check, RefreshCw } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ThemesAppProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  customWallpaper: string;
  onSetCustomWallpaper: (url: string) => void;
}

export const ThemesApp: React.FC<ThemesAppProps> = ({
  currentTheme,
  onSelectTheme,
  customWallpaper,
  onSetCustomWallpaper,
}) => {
  const [wallpaperInput, setWallpaperInput] = useState(customWallpaper);

  const handleApplyWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSoundEffect('levelup');
    onSetCustomWallpaper(wallpaperInput.trim());
  };

  const handleClearWallpaper = () => {
    sound.playSoundEffect('powerdown');
    setWallpaperInput('');
    onSetCustomWallpaper('');
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto overflow-y-auto h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Aurora Themes & Personalization</h1>
          <p className="text-xs text-slate-400">Choose a shimmering aurora shader or set custom wallpaper</p>
        </div>
      </div>

      {/* Preset Themes Grid */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Color Presets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {THEMES_LIST.map((theme) => {
          const isSelected = currentTheme === theme.id && !customWallpaper;
          return (
            <button
              key={theme.id}
              onClick={() => {
                sound.playKeypadClick(400);
                onSelectTheme(theme.id);
                onSetCustomWallpaper('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white">{theme.name}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{theme.desc}</p>
              <div
                className="w-full h-8 rounded-xl bg-gradient-to-r shadow-inner border border-white/10"
                style={{
                  background: `linear-gradient(to right, ${theme.accent}, ${theme.glowColor})`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Custom Wallpaper Section */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Custom Background Wallpaper</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">Paste any direct image URL (PNG, JPG, WebP, GIF) to set as desktop wallpaper.</p>

        <form onSubmit={handleApplyWallpaper} className="flex gap-2">
          <input
            type="url"
            value={wallpaperInput}
            onChange={(e) => setWallpaperInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-sky-400 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-all active:scale-95"
          >
            Apply
          </button>
          {customWallpaper && (
            <button
              type="button"
              onClick={handleClearWallpaper}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs cursor-pointer border border-rose-500/30"
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
