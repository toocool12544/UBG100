import React, { useState } from 'react';
import { ThemeId } from '../types';
import { CLOAK_PRESETS } from '../data/appsData';
import {
  Settings,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Lock,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface SettingsAppProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  customWallpaper: string;
  onSetCustomWallpaper: (url: string) => void;
  currentCloak: string;
  onSelectCloak: (id: string) => void;
  onLockScreen: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentCloak,
  onSelectCloak,
  onLockScreen,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState('');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim().length >= 4) {
      safeStorage.setItem('aurora_custom_passcode', passcodeInput.trim());
      sound.playSuccess();
      setPasscodeMsg('Passcode updated successfully!');
      setPasscodeInput('');
      setTimeout(() => setPasscodeMsg(''), 3000);
    } else {
      sound.playError();
      setPasscodeMsg('Passcode must be at least 4 characters');
    }
  };

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto overflow-y-auto h-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/20 flex items-center justify-center text-sky-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">System Settings</h1>
          <p className="text-xs text-slate-400">Stealth cloaking, security passcodes, and audio settings</p>
        </div>
      </div>

      {/* Tab Cloaking Section */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <EyeOff className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Stealth Tab Cloak</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Instantly disguise this browser tab title and favicon as school or productivity tools.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CLOAK_PRESETS.map((cloak) => {
            const isSelected = currentCloak === cloak.id;
            return (
              <button
                key={cloak.id}
                onClick={() => {
                  sound.playKeypadClick(400);
                  onSelectCloak(cloak.id);
                }}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold'
                    : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/25'
                }`}
              >
                <div className="font-semibold text-white capitalize">{cloak.id} Cloak</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{cloak.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Lock Passcode */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Security Passcode</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Change the system lock screen and AP admin passcode (default is 1234).
        </p>

        <form onSubmit={handleChangePasscode} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            placeholder="New passcode (e.g. 5678)"
            className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/15 focus:border-amber-400 text-xs text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-all active:scale-95"
          >
            Update
          </button>
        </form>
        {passcodeMsg && (
          <p className="mt-2 text-xs text-emerald-400 font-semibold">{passcodeMsg}</p>
        )}
      </div>

      {/* Audio & Quick Controls */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white mb-0.5">System Sound Effects</h2>
          <p className="text-xs text-slate-400">Audio clicks, window sound fx, and game feedback</p>
        </div>

        <button
          onClick={handleToggleMute}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isMuted
              ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
              : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'Muted' : 'Sound Effects Active'}</span>
        </button>
      </div>
    </div>
  );
};
