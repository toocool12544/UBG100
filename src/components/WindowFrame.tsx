import React from 'react';
import { X, Minus, Square, ExternalLink } from 'lucide-react';
import { AppDefinition } from '../types';
import { sound } from '../utils/soundEffects';

interface WindowFrameProps {
  app: AppDefinition;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  zIndex: number;
  onFocus: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  app,
  isMaximized,
  onClose,
  onMinimize,
  onToggleMaximize,
  zIndex,
  onFocus,
  children,
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(350);
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(400);
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(500);
    onToggleMaximize();
  };

  return (
    <div
      onClick={onFocus}
      style={{ zIndex }}
      className={`fixed transition-all duration-200 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-white/20 backdrop-blur-2xl bg-slate-950/85 text-slate-100 ${
        isMaximized
          ? 'inset-2 sm:inset-4 top-13 rounded-xl'
          : 'top-16 bottom-6 left-2 right-2 sm:left-12 sm:right-12 md:left-24 md:right-24 max-w-5xl mx-auto h-[82vh]'
      }`}
    >
      {/* Title Bar */}
      <div className="h-10 bg-slate-900/90 border-b border-white/10 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing">
        {/* macOS style traffic light buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group cursor-pointer"
            title="Close"
          >
            <X className="w-2.5 h-2.5 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleMinimize}
            className="w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors flex items-center justify-center group cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors flex items-center justify-center group cursor-pointer"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Center: Window Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${app.gradient} flex items-center justify-center text-[10px]`}>
            <span>⚡</span>
          </div>
          <span>{app.name}</span>
          {app.subtitle && (
            <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
              — {app.subtitle}
            </span>
          )}
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="text-xs px-2 py-0.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* Main Application Window Canvas */}
      <div className="flex-1 overflow-auto bg-slate-900/60 p-1 sm:p-2">
        {children}
      </div>
    </div>
  );
};
