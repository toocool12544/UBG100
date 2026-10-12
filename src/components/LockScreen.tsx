import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Delete, RotateCcw, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || isUnlocked) return;
      sound.playKeypadClick(500 + pin.length * 80);
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        const correctPin = safeStorage.getItem('aurora_custom_passcode') || '1234';
        if (newPin === correctPin) {
          sound.playSuccess();
          setIsUnlocked(true);
          setTimeout(() => {
            onUnlock();
          }, 450);
        } else {
          sound.playError();
          setError(true);
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    },
    [pin, isUnlocked, onUnlock]
  );

  const handleDelete = useCallback(() => {
    if (pin.length === 0) return;
    sound.playKeypadClick(400);
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, [pin.length]);

  const handleClear = useCallback(() => {
    sound.playKeypadClick(350);
    setPin('');
    setError(false);
  }, []);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter' && pin === '1234') {
        handleDigit('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDelete, handleClear, pin]);

  const timeString = (() => {
    try {
      return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return currentTime.toTimeString().slice(0, 5);
    }
  })();

  const dateString = (() => {
    try {
      return currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return currentTime.toDateString();
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden bg-slate-950">
      {/* Background Aurora Lighting Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-500/20 blur-[130px] animate-aurora-1" />
        <div className="absolute top-[30%] -right-[15%] w-[65vw] h-[65vw] rounded-full bg-blue-600/25 blur-[140px] animate-aurora-2" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/20 blur-[120px] animate-aurora-3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]" />
      </div>

      {/* Top Header: Clock & Date */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2 sm:mt-6 animate-in fade-in duration-500">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 backdrop-blur-md mb-3 text-sky-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AuroraOS Security Enclave</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-mono">
          {timeString}
        </h1>
        <p className="text-base sm:text-lg font-medium text-sky-200/80 mt-1 drop-shadow-sm">
          {dateString}
        </p>
      </div>

      {/* Center Lock / Keypad Card */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Lock status icon */}
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-600/30 border border-sky-400/30 backdrop-blur-xl flex items-center justify-center shadow-lg shadow-sky-500/10">
            {isUnlocked ? (
              <Unlock className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7 text-sky-300" />
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white tracking-wide mb-1">
          {isUnlocked ? 'Passcode Accepted' : 'Enter Passcode'}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {error ? (
            <span className="text-rose-400 font-medium">Incorrect Passcode</span>
          ) : (
            'Type on keyboard or use keypad'
          )}
        </p>

        {/* 4 PIN Dots */}
        <div className={`flex items-center gap-4 mb-7 ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  isFilled
                    ? isUnlocked
                      ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_12px_#34d399]'
                      : 'bg-sky-400 border-sky-400 scale-110 shadow-[0_0_12px_#38bdf8]'
                    : error
                    ? 'border-rose-400/80 bg-rose-500/20'
                    : 'border-white/30 bg-white/5'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad Grid (3 x 4) */}
        <div className="grid grid-cols-3 gap-3.5 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-sky-500/30 border border-white/10 hover:border-sky-400/40 backdrop-blur-md text-white text-xl font-bold transition-all duration-150 flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Bottom row: Clear, 0, Backspace */}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-slate-300 text-xs font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Clear (Esc)"
          >
            <RotateCcw className="w-5 h-5 text-slate-300" />
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-sky-500/30 border border-white/10 hover:border-sky-400/40 backdrop-blur-md text-white text-xl font-bold transition-all duration-150 flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-slate-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Delete (Backspace)"
          >
            <Delete className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-center text-xs text-slate-500 flex items-center gap-3">
        <span>Press ESC to Clear</span>
        <span>•</span>
        <span>Fast Keyboard Input Enabled</span>
      </div>
    </div>
  );
};
