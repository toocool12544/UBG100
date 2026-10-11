import React, { useState } from 'react';
import { Palette, Check, Sparkles, Image, Sliders } from 'lucide-react';
import { THEMES_LIST } from '../data/appsData';
import { ThemeId } from '../types';
import { sound } from '../utils/soundEffects';

interface ThemesAppProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  customWallpaper: string;
  onSetCustomWallpaper: (url: string) => void;
}

export const ThemesApp: React.FC<ThemesAppProps> = ({
  currentTheme,
  onSelectTheme,
  customWallpaper,
  onSetCustomWallpaper,
}) => {
  const [urlInput, setUrlInput] = useState<string>(customWallpaper);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSoundEffect('levelup');
    onSetCustomWallpaper(urlInput.trim());
  };

  const handleResetWallpaper = () => {
    sound.playKeypadClick(400);
    setUrlInput('');
    onSetCustomWallpaper('');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-purple-400" />
          <span>Aurora Theme & Aesthetic Studio</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize the blue aurora waves, color grading, and desktop wallpaper.
        </p>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {THEMES_LIST.map((th) => {
          const isSelected = currentTheme === th.id;
          return (
            <div
              key={th.id}
              onClick={() => {
                sound.playSoundEffect('coin');
                onSelectTheme(th.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-purple-400 bg-purple-500/20 shadow-xl shadow-purple-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Preview Gradient Swatch */}
              <div
                className={`w-full h-20 rounded-xl bg-gradient-to-r ${th.gradient} mb-3 border border-white/20 shadow-inner flex items-center justify-center relative overflow-hidden`}
              >
                <div
                  className="w-16 h-16 rounded-full blur-xl opacity-60"
                  style={{ backgroundColor: th.accent }}
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              <h4 className="font-bold text-sm text-white mb-1 flex items-center justify-between">
                <span>{th.name}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: th.accent, boxShadow: `0 0 8px ${th.glowColor}` }}
                />
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{th.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Custom Wallpaper Section */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
          <Image className="w-4 h-4 text-sky-400" />
          <span>Custom Desktop Wallpaper URL</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Paste any image URL (e.g. Unsplash or personal wallpaper) to override the desktop backdrop.
        </p>
        <form onSubmit={handleApplyUrl} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 font-bold text-xs text-white cursor-pointer shadow-md"
          >
            Apply Wallpaper
          </button>
          {customWallpaper && (
            <button
              type="button"
              onClick={handleResetWallpaper}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-300 cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
