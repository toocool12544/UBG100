import React, { useState, useRef, useEffect } from 'react';
import {
  Gamepad2,
  Play,
  ArrowLeft,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
  Monitor,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface GameItem {
  id: string;
  title: string;
  url: string;
  badge: string;
  description: string;
  gradient: string;
  tags: string[];
}

const GAMES_LIST: GameItem[] = [
  {
    id: 'fiveplay',
    title: 'Fiveplay',
    url: 'https://fiveplay.lol',
    badge: 'Featured Game',
    description:
      'Massive unblocked gaming library loaded with trending arcade, action, and browser games directly on fiveplay.lol.',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    tags: ['Unblocked', 'HTML5', 'fiveplay.lol', 'In-App Play'],
  },
];

export const GamesApp: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const selectedGame = GAMES_LIST.find((g) => g.id === selectedGameId);

  // Sync fullscreen state with document fullscreen change events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  const handleOpenGame = (gameId: string) => {
    sound.playSoundEffect('levelup');
    setSelectedGameId(gameId);
    setIframeKey((k) => k + 1);
  };

  const handleBackToMenu = () => {
    sound.playKeypadClick(400);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
    setSelectedGameId(null);
  };

  const handleRefreshIframe = () => {
    sound.playKeypadClick(500);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = async () => {
    sound.playSoundEffect('coin');
    const container = gameContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement && !isFullscreen) {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
        // Fallback to in-app CSS full-viewport mode
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      } catch {
        // Ignore exit errors
      }
      setIsFullscreen(false);
    }
  };

  // IF A GAME IS SELECTED: RENDER IN-WEBSITE GAME SCREEN
  if (selectedGame) {
    return (
      <div
        ref={gameContainerRef}
        className={`flex flex-col text-slate-100 bg-slate-950 transition-all ${
          isFullscreen
            ? 'fixed inset-0 z-[9999] w-screen h-screen p-2 sm:p-4 bg-black'
            : 'h-full max-w-6xl mx-auto p-3 sm:p-5 overflow-y-auto'
        }`}
      >
        {/* Top Control Bar RIGHT ABOVE the game window */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-sky-500/25 shadow-xl mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/10"
              title="Return to Games Menu"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Games Menu</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                {selectedGame.title}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                Playing in AuroraOS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshIframe}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Reload Game Frame"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* In-Website Fullscreen Button (stricly inside website) */}
            <button
              onClick={handleToggleFullscreen}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:via-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer border border-white/20"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter In-Website Fullscreen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Fullscreen Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Game Iframe Window */}
        <div className="relative flex-1 w-full min-h-[500px] rounded-2xl border-2 border-sky-500/30 bg-black overflow-hidden shadow-2xl">
          <iframe
            key={iframeKey}
            src={selectedGame.url}
            className="w-full h-full min-h-[500px] border-none"
            title={selectedGame.title}
            allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; cross-origin-isolated; gamepad; compute-pressure; focus-without-user-activation"
          />
        </div>

        {/* Bottom Bar RIGHT BELOW the game window */}
        {!isFullscreen && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 mt-3 rounded-2xl bg-slate-900/90 border border-white/10 text-xs shadow-md shrink-0">
            <div className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Playing directly in-app on this website. Use Fullscreen Mode anytime for an expanded view.
              </span>
            </div>

            <button
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 hover:text-white font-bold text-xs whitespace-nowrap transition-all active:scale-95 cursor-pointer border border-sky-400/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand Fullscreen</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT VIEW: AURORA-STYLED GAMES MENU LOBBY
  return (
    <div className="flex flex-col h-full text-slate-100 bg-slate-950/60 p-4 sm:p-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Aurora-Styled Header Menu */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950 border border-sky-500/30 shadow-[0_0_50px_rgba(56,189,248,0.12)] mb-8 overflow-hidden backdrop-blur-2xl">
        {/* Dynamic Aurora Ambient Glow Orbs */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-gradient-to-bl from-sky-400/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-gradient-to-tr from-indigo-600/20 via-blue-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Luminous Aurora Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-300 text-[11px] font-black uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Aurora Gaming Vault • Unblocked Station</span>
            </div>

            {/* Aurora Styled Title */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-400/20 via-indigo-500/20 to-purple-500/20 border border-sky-400/40 p-0.5 flex items-center justify-center text-sky-300 shadow-xl shadow-sky-500/20 shrink-0">
                <Gamepad2 className="w-8 h-8 sm:w-9 sm:h-9 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(56,189,248,0.4)]">
                    Games
                  </span>
                </h1>
                <span className="text-xs sm:text-sm font-semibold text-sky-300/80 tracking-wide">
                  High-Speed Web Games & Emulation
                </span>
              </div>
            </div>

            {/* Perfect Aurora Styled Description */}
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl mb-4 font-normal">
              Explore Aurora's curated unblocked gaming library with zero installation and zero latency. Play full-featured HTML5 and arcade titles directly inside your browser with seamless in-website fullscreen.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Latency</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% In-Website</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>Fullscreen Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Catalog Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-500/15">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-sky-400" />
            <span>Available Games</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {GAMES_LIST.length} {GAMES_LIST.length === 1 ? 'Game Ready' : 'Games Ready'}
          </span>
        </div>

        {/* Games Grid (Fiveplay only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              onClick={() => handleOpenGame(game.id)}
              className="group relative rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-sky-500/20 hover:border-sky-400/50 p-5 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.gradient} p-0.5 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform`}
                  >
                    <Gamepad2 className="w-6 h-6" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{game.badge}</span>
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-sky-300 transition-colors mb-1.5 flex items-center gap-2">
                  <span>{game.title}</span>
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {game.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Action: Play directly inside the website */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenGame(game.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Game In-Website</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
