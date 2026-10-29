import React, { useState, useEffect } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  EyeOff,
  Sparkles,
  Wifi,
  BatteryCharging,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { CLOAK_PRESETS } from '../data/appsData';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLock: () => void;
  openWindowsCount: number;
  activeThemeName: string;
  onOpenApp: (appId: string) => void;
  currentCloak: string;
  onSelectCloak: (cloakId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onLock,
  openWindowsCount,
  activeThemeName,
  onOpenApp,
  currentCloak,
  onSelectCloak,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCloakMenu, setShowCloakMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        setCurrentTime(
          now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        );
        setCurrentDate(
          now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        );
      } catch {
        setCurrentTime(now.toTimeString().slice(0, 5));
        setCurrentDate(now.toDateString().slice(0, 10));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      sound.playKeypadClick(600);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="relative z-30 w-full h-11 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 px-3 sm:px-5 flex items-center justify-between text-xs text-white/90 select-none">
      {/* Left: Brand + Quick Cloak + Open Windows */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onOpenApp('games')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Click to open Games"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-300 flex items-center justify-center shadow-[0_0_10px_#38bdf8] group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <span className="font-bold tracking-tight text-white hidden sm:inline">
            Aurora<span className="text-sky-400">OS</span>
          </span>
        </div>

        {/* Tab Cloaker Panic Button */}
        <div className="relative">
          <button
            onClick={() => setShowCloakMenu(!showCloakMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-[11px] font-medium text-slate-200 transition-colors cursor-pointer"
            title="Disguise Tab Title and Favicon (Stealth Mode)"
          >
            <EyeOff className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden md:inline">Cloak Tab</span>
          </button>

          {showCloakMenu && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Tab Disguise Presets
              </div>
              {CLOAK_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectCloak(p.id);
                    setShowCloakMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                    currentCloak === p.id ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  {currentCloak === p.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open Windows Indicator */}
        {openWindowsCount > 0 && (
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/20 text-[11px] text-sky-300">
            <Layers className="w-3 h-3" />
            <span>{openWindowsCount} active</span>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="relative max-w-xs sm:max-w-sm w-full mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games & apps..."
            className="w-full h-7 pl-8 pr-7 rounded-full bg-white/10 hover:bg-white/15 focus:bg-slate-900/90 border border-white/15 focus:border-sky-400 text-xs text-white placeholder-slate-400 transition-all focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right: System Status & Controls */}
      <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span title="Network Connected">
            <Wifi className="w-3.5 h-3.5" />
          </span>
          <span title="Battery 100%">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </div>

        {/* Audio Mute */}
        <button
          onClick={toggleMute}
          className="p-1 rounded-md hover:bg-white/10 transition-colors text-slate-300 hover:text-white cursor-pointer"
          title={isMuted ? 'Unmute System Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-1 rounded-md hover:bg-white/10 transition-colors text-slate-300 hover:text-white cursor-pointer hidden sm:block"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Clock & Date */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 font-mono text-[11px] text-slate-200">
          <span className="hidden sm:inline text-slate-400">{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
};
