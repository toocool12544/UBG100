import React, { useState, useEffect, useMemo } from 'react';
import { LockScreen } from './components/LockScreen';
import { ParticleConstellation } from './components/ParticleConstellation';
import { TopBar } from './components/TopBar';
import { AppIcon } from './components/AppIcon';
import { WindowFrame } from './components/WindowFrame';
import { APPS_CATALOG, THEMES_LIST, CLOAK_PRESETS } from './data/appsData';
import { ThemeId, WindowState, AppDefinition } from './types';
import { sound } from './utils/soundEffects';
import { safeStorage } from './utils/storage';

// Apps imports
import { GamesApp } from './apps/GamesApp';
import { APApp } from './apps/APApp';
import { CineraApp } from './apps/CineraApp';
import { Mp3PlayerApp } from './apps/Mp3PlayerApp';
import { JsExecutorApp } from './apps/JsExecutorApp';
import { SuggestionsApp } from './apps/SuggestionsApp';
import { CameraApp } from './apps/CameraApp';
import { CalendarApp } from './apps/CalendarApp';
import { ThemesApp } from './apps/ThemesApp';
import { SettingsApp } from './apps/SettingsApp';
import { RetroApp } from './apps/RetroApp';
import { ClipsApp } from './apps/ClipsApp';
import { GlobalChatApp } from './apps/GlobalChatApp';
import { LinksApp } from './apps/LinksApp';
import { RobloxApp } from './apps/RobloxApp';
import { TerminalApp } from './apps/TerminalApp';
import { SoundboardApp } from './apps/SoundboardApp';
import { PaintApp } from './apps/PaintApp';
import { CelesteApp } from './apps/CelesteApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { MeetApp, InboxApp, NotepadApp } from './apps/StealthApps';
import { MoviesApp, TiktokApp, AnimeApp, MusicApp } from './apps/EntertainmentApps';
import { VoiceApp, ClockApp } from './apps/UtilityApps';
import { sessionManager } from './utils/sessionManager';

export default function App() {
  // Lock screen is active first thing upon entering website (passcode 1234)
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isKickedOut, setIsKickedOut] = useState<boolean>(() => sessionManager.isUserKicked());
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin') ||
      window.location.hash.startsWith('#/admin')
    );
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    return (safeStorage.getItem('aurora_theme') as ThemeId) || 'aurora-blue';
  });
  const [customWallpaper, setCustomWallpaper] = useState<string>(() => {
    return safeStorage.getItem('aurora_wallpaper') || '';
  });
  const [currentCloak, setCurrentCloak] = useState<string>('default');

  // Open windows state
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // Initialize Real-time Session Tracking & Kick listener
  useEffect(() => {
    sessionManager.init();

    const handleForceLogout = () => {
      setIsKickedOut(true);
      setTimeout(() => {
        try {
          window.location.replace('https://google.com');
        } catch {
          window.location.href = 'https://google.com';
        }
      }, 400);
    };

    const handleRouteChange = () => {
      setIsAdminRoute(
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin') ||
        window.location.hash.startsWith('#/admin')
      );
    };

    window.addEventListener('aurora:force_logout', handleForceLogout);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('aurora:force_logout', handleForceLogout);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      sessionManager.destroy();
    };
  }, []);

  // Tab cloaking effect
  useEffect(() => {
    const cloak = CLOAK_PRESETS.find((c) => c.id === currentCloak);
    if (cloak) {
      document.title = cloak.title;
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon) {
        if (cloak.id === 'docs') {
          favicon.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
        } else if (cloak.id === 'classroom') {
          favicon.href = 'https://ssl.gstatic.com/classroom/favicon.png';
        } else if (cloak.id === 'canvas') {
          favicon.href = 'https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico';
        } else if (cloak.id === 'wikipedia') {
          favicon.href = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
        } else {
          favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338bdf8'><circle cx='12' cy='12' r='10'/></svg>";
        }
      }
    }
  }, [currentCloak]);

  // Handle open app
  const openApp = (appId: string) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.appId === appId);
      if (exists) {
        return prev.map((w) =>
          w.appId === appId ? { ...w, isMinimized: false, zIndex: prev.length + 10 } : w
        );
      }
      return [
        ...prev,
        {
          appId,
          isMinimized: false,
          isMaximized: false,
          zIndex: prev.length + 10,
        },
      ];
    });
    setActiveWindowId(appId);
  };

  const closeWindow = (appId: string) => {
    setWindows((prev) => prev.filter((w) => w.appId !== appId));
    if (activeWindowId === appId) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (appId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, isMinimized: true } : w))
    );
  };

  const toggleMaximizeWindow = (appId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.appId === appId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusWindow = (appId: string) => {
    setActiveWindowId(appId);
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => (w.appId === appId ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    safeStorage.setItem('aurora_theme', themeId);
  };

  const handleSetCustomWallpaper = (url: string) => {
    setCustomWallpaper(url);
    safeStorage.setItem('aurora_wallpaper', url);
  };

  // Keyboard panic button (Escape to close active window or lock)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (windows.length > 0) {
          // close topmost window
          const topmost = windows[windows.length - 1];
          if (topmost) closeWindow(topmost.appId);
        } else if (!isLocked) {
          setIsLocked(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, isLocked]);

  // Current theme config
  const themeConfig = useMemo(() => {
    return THEMES_LIST.find((t) => t.id === currentTheme) || THEMES_LIST[0];
  }, [currentTheme]);

  // Filter apps matching search
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return APPS_CATALOG;
    const q = searchQuery.toLowerCase();
    return APPS_CATALOG.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        (app.subtitle && app.subtitle.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // App content renderer for active windows
  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'ap':
        return <APApp />;
      case 'games':
        return <GamesApp />;
      case 'cinera':
        return <CineraApp />;
      case 'mp3-player':
        return <Mp3PlayerApp />;
      case 'js-executor':
        return <JsExecutorApp />;
      case 'suggestions':
        return <SuggestionsApp />;
      case 'camera':
        return <CameraApp />;
      case 'calendar':
        return <CalendarApp />;
      case 'themes':
        return (
          <ThemesApp
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            customWallpaper={customWallpaper}
            onSetCustomWallpaper={handleSetCustomWallpaper}
          />
        );
      case 'settings':
        return (
          <SettingsApp
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            customWallpaper={customWallpaper}
            onSetCustomWallpaper={handleSetCustomWallpaper}
            currentCloak={currentCloak}
            onSelectCloak={setCurrentCloak}
            onLockScreen={() => setIsLocked(true)}
          />
        );
      case 'retro':
        return <RetroApp />;
      case 'clips':
        return <ClipsApp />;
      case 'global-chat':
        return <GlobalChatApp />;
      case 'links':
        return <LinksApp currentCloak={currentCloak} onSelectCloak={setCurrentCloak} />;
      case 'roblox':
        return <RobloxApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'soundboard':
        return <SoundboardApp />;
      case 'movies':
        return <MoviesApp />;
      case 'tiktok':
        return <TiktokApp />;
      case 'paint':
        return <PaintApp />;
      case 'inbox':
        return <InboxApp />;
      case 'meet':
        return <MeetApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'celeste':
        return <CelesteApp />;
      case 'anime':
        return <AnimeApp />;
      case 'music':
        return <MusicApp />;
      case 'notepad':
        return <NotepadApp />;
      case 'voice':
        return <VoiceApp />;
      case 'clock':
        return <ClockApp />;
      default:
        return <GamesApp />;
    }
  };

  // 4. User Reaction: completely block page layout when FORCE_LOGOUT is received
  if (isKickedOut) {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black text-red-500 flex flex-col items-center justify-center p-6 text-center font-mono select-none">
        <div className="max-w-md p-8 border-2 border-red-500 rounded-2xl bg-red-950/30 shadow-[0_0_60px_rgba(239,68,68,0.6)]">
          <div className="text-5xl mb-4 animate-bounce">⛔</div>
          <h1 className="text-2xl font-black text-white tracking-widest mb-2">FORCE LOGOUT</h1>
          <p className="text-sm text-red-300 mb-6 leading-relaxed">
            Your session has been terminated by the administrator. Layout completely blocked.
          </p>
          <div className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider animate-pulse">
            REDIRECTING TO GOOGLE...
          </div>
        </div>
      </div>
    );
  }

  // 2. Admin Dashboard: Private /admin route
  if (isAdminRoute) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col select-none">
        <ParticleConstellation />
        <div className="h-10 bg-slate-900/90 border-b border-red-500/20 px-4 flex items-center justify-between text-xs backdrop-blur-xl">
          <span className="font-mono text-red-400 font-bold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>PRIVATE ROUTE: /admin (Session Management)</span>
          </span>
          <button
            onClick={() => {
              window.location.hash = '';
              setIsAdminRoute(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Exit /admin
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <APApp />
        </div>
      </div>
    );
  }

  // If locked, render LockScreen with particle constellation background!
  if (isLocked) {
    return (
      <>
        <ParticleConstellation />
        <LockScreen onUnlock={() => setIsLocked(false)} />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col overflow-x-hidden select-none bg-slate-950/80 ${
        customWallpaper ? 'bg-cover bg-center' : ''
      }`}
      style={{
        backgroundImage: customWallpaper ? `url("${customWallpaper}")` : undefined,
      }}
    >
      {/* Full-screen animated particle constellation & starfield canvas (z-index: -1) */}
      <ParticleConstellation />

      {/* Dynamic Aurora Waves Backdrop */}
      {!customWallpaper && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Base gradient with transparency so stars & constellations shine through */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${themeConfig.gradient} opacity-80 transition-all duration-700`}
          />

          {/* Animated Aurora Light Waves */}
          <div
            className="absolute -top-[25%] -left-[15%] w-[85vw] h-[85vw] rounded-full blur-[150px] animate-aurora-1 opacity-70"
            style={{ backgroundColor: themeConfig.accent }}
          />
          <div
            className="absolute top-[20%] -right-[20%] w-[75vw] h-[75vw] rounded-full bg-blue-600/35 blur-[160px] animate-aurora-2 opacity-60"
          />
          <div
            className="absolute -bottom-[20%] left-[15%] w-[80vw] h-[80vw] rounded-full bg-indigo-500/30 blur-[140px] animate-aurora-3 opacity-50"
          />

          {/* Sunset glow sphere matching screenshot's warm dusk light */}
          {currentTheme === 'aurora-solar' && (
            <div className="absolute bottom-16 right-[22%] w-64 h-64 rounded-full bg-amber-500/40 blur-[90px] pointer-events-none" />
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
      )}

      {/* Top Status Bar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLock={() => setIsLocked(true)}
        openWindowsCount={windows.length}
        activeThemeName={themeConfig.name}
        onOpenApp={openApp}
        currentCloak={currentCloak}
        onSelectCloak={setCurrentCloak}
      />

      {/* Main Launchpad Grid */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-6 max-w-7xl mx-auto w-full">
        {/* App Icons Grid */}
        <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-7 gap-x-2 sm:gap-x-4 place-items-center my-auto transition-all duration-300">
          {filteredApps.map((app) => {
            const isOpen = windows.some((w) => w.appId === app.id);
            return (
              <AppIcon
                key={app.id}
                app={app}
                onClick={openApp}
                isOpen={isOpen}
              />
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm font-semibold">No apps match "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-sky-400 underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}
      </main>

      {/* Windows Layer */}
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const app = APPS_CATALOG.find((a) => a.id === win.appId);
        if (!app) return null;

        return (
          <WindowFrame
            key={win.appId}
            app={app}
            isMaximized={win.isMaximized}
            onClose={() => closeWindow(win.appId)}
            onMinimize={() => minimizeWindow(win.appId)}
            onToggleMaximize={() => toggleMaximizeWindow(win.appId)}
            zIndex={win.zIndex}
            onFocus={() => focusWindow(win.appId)}
          >
            {renderAppContent(win.appId)}
          </WindowFrame>
        );
      })}

      {/* Bottom Floating Taskbar / Running Apps Dock */}
      {windows.length > 0 && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-2xl bg-slate-950/75 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-2">
          {windows.map((win) => {
            const app = APPS_CATALOG.find((a) => a.id === win.appId);
            if (!app) return null;
            const isFront = activeWindowId === win.appId && !win.isMinimized;

            return (
              <button
                key={win.appId}
                onClick={() => {
                  sound.playKeypadClick(500);
                  if (win.isMinimized) {
                    setWindows((prev) =>
                      prev.map((w) => (w.appId === win.appId ? { ...w, isMinimized: false } : w))
                    );
                  }
                  focusWindow(win.appId);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isFront
                    ? 'bg-sky-500/30 border border-sky-400 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
