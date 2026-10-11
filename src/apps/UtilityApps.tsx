import React, { useState, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Clock,
  Download,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

/* --- VOICE RECORDER & PITCH SHIFTER --- */
export const VoiceApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [filter, setFilter] = useState<string>('normal');
  const [hasRecording, setHasRecording] = useState<boolean>(false);

  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => setRecordTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    sound.playSoundEffect(isRecording ? 'keypad' : 'laser');
    if (!isRecording) {
      setRecordTime(0);
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setHasRecording(true);
    }
  };

  const playBack = () => {
    sound.playSoundEffect(filter === 'robot' ? 'laser' : filter === 'chipmunk' ? 'coin' : 'bruh');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto p-4 text-slate-100">
      <div className="w-full rounded-3xl bg-slate-900 border border-white/10 p-6 flex flex-col items-center shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-1">Voice Recorder & FX Pitch Shifter</h3>
        <p className="text-xs text-slate-400 mb-6">Capture audio notes and apply fun robotic voice filters.</p>

        {/* Record Button */}
        <div className="relative mb-6">
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl ${
              isRecording
                ? 'bg-rose-500 scale-110 shadow-rose-500/50 animate-pulse'
                : 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/30 text-slate-950'
            }`}
          >
            {isRecording ? <Square className="w-8 h-8 text-white fill-current" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>

        <div className="text-2xl font-mono font-bold text-white mb-6">
          00:{recordTime.toString().padStart(2, '0')}
        </div>

        {/* Voice Filters */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'normal', name: 'Normal' },
            { id: 'robot', name: '🤖 Robot' },
            { id: 'chipmunk', name: '🐿️ Chipmunk' },
            { id: 'deep', name: '👹 Demon Bass' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                sound.playKeypadClick(500);
                setFilter(f.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                filter === f.id ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {hasRecording && (
          <div className="flex gap-3">
            <button
              onClick={playBack}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Filtered Audio</span>
            </button>
            <button
              onClick={() => {
                sound.playSoundEffect('levelup');
                alert('Audio sample ready for download');
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Download Audio"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- CLOCK & TIMERS APP --- */
export const ClockApp: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [tab, setTab] = useState<'clock' | 'stopwatch' | 'bell'>('clock');
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let swInterval: number;
    if (isRunning) {
      swInterval = window.setInterval(() => setStopwatchMs((ms) => ms + 10), 10);
    }
    return () => clearInterval(swInterval);
  }, [isRunning]);

  const formatStopwatch = () => {
    const totalSec = Math.floor(stopwatchMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const ms = Math.floor((stopwatchMs % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto p-4 text-slate-100">
      {/* Switcher */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 mb-6">
        {['clock', 'stopwatch', 'bell'].map((t) => (
          <button
            key={t}
            onClick={() => {
              sound.playKeypadClick(500);
              setTab(t as 'clock' | 'stopwatch' | 'bell');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              tab === t ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'clock' && (
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tight drop-shadow-lg mb-2">
            {time.toLocaleTimeString()}
          </div>
          <div className="text-sm font-medium text-sky-300">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}

      {tab === 'stopwatch' && (
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-mono font-black text-white mb-6">
            {formatStopwatch()}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playKeypadClick(600);
                setIsRunning(!isRunning);
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                sound.playKeypadClick(400);
                setIsRunning(false);
                setStopwatchMs(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {tab === 'bell' && (
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-5 border border-white/10 text-center">
          <h4 className="font-bold text-sm text-white mb-1">School Period Countdown</h4>
          <p className="text-xs text-slate-400 mb-4">Current: Period 3 (Math & Computing)</p>
          <div className="text-4xl font-mono font-black text-amber-300 mb-4">
            18m 42s left
          </div>
          <button
            onClick={() => sound.playSoundEffect('levelup')}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Test Bell Chime
          </button>
        </div>
      )}
    </div>
  );
};


