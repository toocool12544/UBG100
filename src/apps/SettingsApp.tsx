import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Shield,
  Volume2,
  Info,
  Check,
  Image,
} from 'lucide-react';
import { THEMES_LIST, CLOAK_PRESETS } from '../data/appsData';
import { ThemeId } from '../types';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface SettingsAppProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  customWallpaper: string;
  onSetCustomWallpaper: (url: string) => void;
  currentCloak: string;
  onSelectCloak: (cloakId: string) => void;
  onLockScreen?: () => void;
}

type TabType = 'appearance' | 'stealth' | 'sound' | 'about';

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentTheme,
  onSelectTheme,
  customWallpaper,
  onSetCustomWallpaper,
  currentCloak,
  onSelectCloak,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(customWallpaper);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return safeStorage.getItem('aurora_sound_enabled') !== 'false';
  });

  const handleSaveWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSoundEffect('levelup');
    onSetCustomWallpaper(wallpaperUrl.trim());
  };

  const handleResetWallpaper = () => {
    sound.playKeypadClick(400);
    setWallpaperUrl('');
    onSetCustomWallpaper('');
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    safeStorage.setItem('aurora_sound_enabled', next ? 'true' : 'false');
    if (next) {
      sound.playSoundEffect('coin');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'stealth', label: 'Stealth & Cloak', icon: <Shield className="w-4 h-4" /> },
    { id: 'sound', label: 'Audio & FX', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'about', label: 'About System', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full max-w-5xl mx-auto p-4 gap-4 text-slate-100 select-none">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-60 flex md:flex-col gap-1 p-2 rounded-2xl bg-slate-900/80 border border-sky-500/20 backdrop-blur-md overflow-x-auto">
        <div className="hidden md:flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-sky-500/15">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-white">Settings</div>
            <div className="text-[10px] text-sky-300/70">AuroraOS Preferences</div>
          </div>
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playKeypadClick(500);
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 rounded-3xl bg-slate-900/80 border border-sky-500/20 shadow-2xl p-5 sm:p-6 backdrop-blur-xl overflow-y-auto">
        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Palette className="w-5 h-5 text-sky-400" />
                <span>Theme & Visual Style</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose an ambient Aurora wave color scheme or customize your desktop background.
              </p>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES_LIST.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      sound.playSoundEffect('coin');
                      onSelectTheme(theme.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span className="text-xs font-bold text-white">{theme.name}</span>
                      </div>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{theme.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Custom Wallpaper */}
            <div className="pt-4 border-t border-sky-500/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <Image className="w-4 h-4" />
                <span>Custom Wallpaper URL</span>
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Paste any direct image URL (Unsplash, Imgur, Discord CDN) to override the animated aurora.
              </p>
              <form onSubmit={handleSaveWallpaper} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={wallpaperUrl}
                  onChange={(e) => setWallpaperUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-slate-950 cursor-pointer shadow-md"
                >
                  Apply
                </button>
                {customWallpaper && (
                  <button
                    type="button"
                    onClick={handleResetWallpaper}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 cursor-pointer"
                  >
                    Restore Aurora
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* STEALTH & CLOAKING TAB */}
        {activeTab === 'stealth' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Tab Cloaking & Stealth Disguise</span>
              </h3>
              <p className="text-xs text-slate-400">
                Disguise this browser tab title and favicon to appear as an educational or productive app.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CLOAK_PRESETS.map((cloak) => {
                const isSelected = currentCloak === cloak.id;
                const label =
                  cloak.id === 'default'
                    ? 'AuroraOS (Default)'
                    : cloak.id === 'docs'
                    ? 'Google Docs'
                    : cloak.id === 'classroom'
                    ? 'Google Classroom'
                    : cloak.id === 'canvas'
                    ? 'Canvas LMS'
                    : cloak.id === 'wikipedia'
                    ? 'Wikipedia'
                    : cloak.id === 'desmos'
                    ? 'Desmos Calculator'
                    : cloak.id.charAt(0).toUpperCase() + cloak.id.slice(1);
                return (
                  <div
                    key={cloak.id}
                    onClick={() => {
                      sound.playSoundEffect('levelup');
                      onSelectCloak(cloak.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
                        {cloak.title}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">Panic Redirection Tip:</span>
              Pressing the Panic Key or closing this portal instantly directs attention away. The current active cloak automatically reflects in your browser title bar and tab icon.
            </div>
          </div>
        )}

        {/* SOUND TAB */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Volume2 className="w-5 h-5 text-sky-400" />
                <span>Audio & Web Synthesizer</span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure client-side sound effects, keypad feedback, and synthesizer chords.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">System Sound Effects</div>
                <div className="text-[11px] text-slate-400">Enable synthesized clicks, unlocks, and audio feedback</div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    soundEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                Test Audio Effects
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Click', fn: () => sound.playKeypadClick(550) },
                  { label: 'Level Up', fn: () => sound.playSoundEffect('levelup') },
                  { label: 'Coin Fanfare', fn: () => sound.playSoundEffect('coin') },
                  { label: 'Laser', fn: () => sound.playSoundEffect('laser') },
                  { label: 'Window Beep', fn: () => sound.playWindowOpen() },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.fn}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    🔊 {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* ABOUT SYSTEM TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Info className="w-5 h-5 text-sky-400" />
                <span>About AuroraOS</span>
              </h3>
              <p className="text-xs text-slate-400">
                System build information, environment specifications, and storage management.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">System Version</span>
                <span className="font-mono font-bold text-sky-300">v2.4.0 (Blue Aurora LTS)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Kernel Architecture</span>
                <span className="font-mono text-slate-200">React 19 / Vite Static Engine</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Hosting Mode</span>
                <span className="font-mono text-emerald-400">Client-Side Autonomous</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Storage Driver</span>
                <span className="font-mono text-slate-200">safeStorage / Sandbox Guard</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
