import React from 'react';
import { AppDefinition } from '../types';
import { sound } from '../utils/soundEffects';

interface AppIconProps {
  app: AppDefinition;
  onClick: (appId: string) => void;
  isOpen?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onClick, isOpen = false }) => {
  const handleClick = () => {
    sound.playWindowOpen();
    onClick(app.id);
  };

  const renderIconGraphic = () => {
    switch (app.iconType) {
      case 'games-folder':
        return (
          <div className="grid grid-cols-2 gap-1.5 p-1 w-full h-full place-items-center">
            <div className="w-5 h-5 rounded-md bg-teal-500/90 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
              π
            </div>
            <div className="w-5 h-5 rounded-md bg-orange-500/90 flex items-center justify-center text-[10px] text-white shadow-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-md bg-amber-400/90 flex items-center justify-center text-slate-900 shadow-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-md bg-purple-500/80 flex items-center justify-center text-[10px] text-white shadow-sm font-black">
              +
            </div>
          </div>
        );

      case 'cinera':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        );

      case 'mp3':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <div className="absolute top-2 right-2 text-[10px] text-purple-200 font-bold">✨</div>
          </div>
        );

      case 'js':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-black text-black tracking-tighter select-none font-mono">
              JS
            </span>
          </div>
        );

      case 'bulb':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
            </svg>
          </div>
        );

      case 'camera':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10m7.5-3h-2.69l-.65-1.42A2 2 0 0 0 14.34 1H9.66a2 2 0 0 0-1.82 1.58L7.19 4H4.5A2.5 2.5 0 0 0 2 6.5v13A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4" />
            </svg>
          </div>
        );

      case 'calendar':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="w-full bg-red-500 py-1 flex items-center justify-center">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none">
                OCT
              </span>
              <span className="text-xl font-black text-slate-800 leading-none mt-0.5">
                10
              </span>
            </div>
          </div>
        );

      case 'themes':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="16" height="7" rx="2" />
              <path d="M18 5.5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6v4" />
              <path d="M14 15.5v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-5" />
            </svg>
          </div>
        );

      case 'gamepad':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m3-3c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5" />
            </svg>
          </div>
        );

      case 'clips':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-7 rounded-xl bg-red-600 border border-white/20 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        );

      case 'sparkle':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
            </svg>
          </div>
        );

      case 'chat':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        );

      case 'link':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        );

      case 'roblox':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rotate-12 rounded-sm flex items-center justify-center shadow-md">
              <div className="w-3.5 h-3.5 bg-neutral-900 rounded-[2px]" />
            </div>
          </div>
        );

      case 'terminal':
        return (
          <div className="w-full h-full flex items-center justify-center font-mono">
            <span className="text-emerald-400 font-bold text-lg tracking-tighter">
              &gt;_
            </span>
          </div>
        );

      case 'soundboard':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
        );

      case 'movies':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2.5" />
              <path d="M2 8h20" />
              <path d="M6 4v4" />
              <path d="M10 4v4" />
              <path d="M14 4v4" />
              <path d="M18 4v4" />
            </svg>
          </div>
        );

      case 'tiktok':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V8.34a8.2 8.2 0 0 0 4.91 1.64V6.69h-1z" />
            </svg>
          </div>
        );

      case 'paint':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
        );

      case 'inbox':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
        );

      case 'meet':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2.5">
            <div className="w-full h-3 bg-neutral-900 rounded mb-1.5 flex items-center justify-end px-1 border border-neutral-700">
              <span className="text-[8px] font-mono text-emerald-400 font-bold">1234</span>
            </div>
            <div className="grid grid-cols-3 gap-1 w-full">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-2 bg-neutral-700/80 rounded-[2px]" />
              ))}
            </div>
          </div>
        );

      case 'celeste':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2L7 10l-6 8h22L14 6z" />
            </svg>
          </div>
        );

      case 'code':
        return (
          <div className="w-full h-full flex items-center justify-center font-mono">
            <span className="text-2xl font-bold text-white tracking-tighter">&lt;&gt;</span>
          </div>
        );

      case 'anime':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-9 h-7 rounded-lg border-2 border-white flex items-center justify-center">
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white ml-0.5" />
            </div>
          </div>
        );

      case 'music-pink':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        );

      case 'notepad':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3">
            <div className="w-7 h-9 bg-white rounded-[3px] shadow-sm flex flex-col p-1 gap-1">
              <div className="w-full h-0.5 bg-amber-400 rounded-full" />
              <div className="w-3/4 h-0.5 bg-slate-300 rounded-full" />
              <div className="w-full h-0.5 bg-slate-300 rounded-full" />
              <div className="w-2/3 h-0.5 bg-slate-300 rounded-full" />
            </div>
          </div>
        );

      case 'solara-id':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
          </div>
        );

      case 'clock':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative">
              <div className="w-0.5 h-3 bg-white absolute top-1.5 left-[13px] rounded-full origin-bottom" />
              <div className="w-2.5 h-0.5 bg-white absolute top-[13px] left-[13px] rounded-full origin-left rotate-45" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute" />
            </div>
          </div>
        );

      case 'speed':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14l4-4" />
              <path d="M3.34 17a10 10 0 1 1 17.32 0" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
            {app.name.charAt(0)}
          </div>
        );
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center justify-start gap-2 p-1.5 rounded-2xl transition-all duration-200 hover:-translate-y-1.5 active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer w-20 sm:w-22"
      title={app.subtitle || app.name}
    >
      {/* Icon Squircle matching screenshot */}
      <div
        className={`w-15 h-15 sm:w-16 sm:h-16 rounded-[20px] bg-gradient-to-br ${app.gradient} p-0.5 shadow-lg group-hover:shadow-cyan-500/25 group-hover:shadow-xl transition-all duration-300 relative border border-white/20 app-icon-shine flex items-center justify-center`}
      >
        {renderIconGraphic()}

        {/* Running indicator dot */}
        {isOpen && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
        )}
      </div>

      {/* Label */}
      <span className="text-[12px] sm:text-[13px] font-medium text-white/95 tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate max-w-full px-0.5 group-hover:text-sky-200 transition-colors">
        {app.name}
      </span>
    </button>
  );
};
