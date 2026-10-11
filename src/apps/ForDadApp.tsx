import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Heart, Play, Pause, RefreshCw } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import monkeyImage from '../assets/monkey.jpg';

export const ForDadApp: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [reactionText, setReactionText] = useState<string>('OO OO AA AA! 🐒🍌');
  const [clickCount, setClickCount] = useState<number>(0);
  const loopRef = useRef<ReturnType<typeof sound.createMonkeyLoop> | null>(null);

  useEffect(() => {
    // When you enter it: automatically play monkey audio!
    loopRef.current = sound.createMonkeyLoop();
    loopRef.current.start();
    setIsPlayingAudio(true);

    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
      }
    };
  }, []);

  const toggleMonkeyAudio = () => {
    if (!loopRef.current) {
      loopRef.current = sound.createMonkeyLoop();
    }

    if (isPlayingAudio) {
      loopRef.current.stop();
      setIsPlayingAudio(false);
    } else {
      loopRef.current.start();
      setIsPlayingAudio(true);
    }
  };

  const triggerWhoop = () => {
    sound.playMonkeyWhoop();
    setClickCount((c) => c + 1);
    setReactionText('HOO HOO HOO! 🍌');
  };

  const triggerScreech = () => {
    sound.playMonkeyScreech();
    setClickCount((c) => c + 1);
    setReactionText('EEEE-AA-AA-AA! 🌴');
  };

  const triggerLaugh = () => {
    sound.playMonkeyWhoop();
    setTimeout(() => sound.playMonkeyScreech(), 350);
    setClickCount((c) => c + 1);
    setReactionText('RETURN TO MONKE DAD! 🦍👑');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 items-center justify-center select-none overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl p-6 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative jungle glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4 shadow-sm animate-pulse">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Special Delivery: For Dad</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </div>

        {/* Funny Monkey Picture */}
        <div className="relative group my-2">
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-amber-400/50 shadow-2xl shadow-amber-500/20 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <img
              src={monkeyImage}
              alt="Hilarious Grinning Monkey with Sunglasses"
              className="w-full h-full object-cover"
              onClick={triggerLaugh}
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg whitespace-nowrap">
            🏆 #1 Dad in the Jungle
          </div>
        </div>

        {/* Audio status indicator & reaction text */}
        <div className="mt-6 mb-4">
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-wide drop-shadow">
            {reactionText}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isPlayingAudio ? '🔊 Monkey audio actively screeching!' : '🔇 Monkey audio paused'}
          </p>
        </div>

        {/* Audio Control Bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={toggleMonkeyAudio}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 shadow-lg ${
              isPlayingAudio
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Pause Monkey Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Resume Monkey Screeches</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Monkey Soundboard Buttons */}
        <div className="w-full border-t border-white/10 pt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Tap to Make Monkey Noises
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            <button
              onClick={triggerWhoop}
              className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-slate-200 hover:text-amber-300 transition-all cursor-pointer active:scale-95"
            >
              🍌 Chimp Whoop
            </button>
            <button
              onClick={triggerScreech}
              className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-slate-200 hover:text-amber-300 transition-all cursor-pointer active:scale-95"
            >
              🌴 Wild Screech
            </button>
            <button
              onClick={triggerLaugh}
              className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-slate-200 hover:text-amber-300 transition-all cursor-pointer active:scale-95"
            >
              🦍 Jungle Party
            </button>
          </div>
        </div>

        {clickCount > 0 && (
          <div className="mt-4 text-[10px] text-slate-500 font-mono">
            Dad has received {clickCount} monkey screech{clickCount === 1 ? '' : 'es'}! 🐒
          </div>
        )}
      </div>
    </div>
  );
};
