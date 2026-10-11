import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Trophy,
  Award,
  Zap,
  Mic,
  Square,
  Play,
  RotateCcw,
  Clock,
  Gauge,
  Sparkles,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

/* --- SOLARA ID APP --- */
export const SolaraIdApp: React.FC = () => {
  const [username, setUsername] = useState<string>(() => {
    return safeStorage.getItem('aurora_username') || 'AuroraGamer#1234';
  });
  const [avatar, setAvatar] = useState<string>('👾');

  const avatars = ['👾', '🐱‍👤', '🚀', '⚡', '🐉', '🎮', '👑', '🔥'];

  const achievements = [
    { title: 'Passcode Master', desc: 'Unlocked AuroraOS with PIN 1234', unlocked: true, icon: '🔑' },
    { title: '2048 Architect', desc: 'Reached 1024+ in sliding tile puzzle', unlocked: true, icon: '🔢' },
    { title: 'Stealth Ninja', desc: 'Switched tab cloak to Google Classroom', unlocked: true, icon: '🕶️' },
    { title: 'Retro Champion', desc: 'Scored 100+ points in Breakout', unlocked: false, icon: '🕹️' },
    { title: 'Hacker Elite', desc: 'Executed Matrix digital rain command', unlocked: true, icon: '💻' },
  ];

  const handleSave = () => {
    sound.playSoundEffect('levelup');
    safeStorage.setItem('aurora_username', username);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/20 shadow-2xl mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-blue-600/30 border-2 border-blue-400 flex items-center justify-center text-5xl shadow-xl shadow-blue-500/20">
          {avatar}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-2xl font-black text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-blue-400 font-mono"
            />
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold w-fit mx-auto sm:mx-0">
              Level 14 Veteran
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">Solara Gamer Identity & Stats Hub</p>

          {/* XP Progress Bar */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>XP: 7,420 / 10,000</span>
              <span className="text-blue-300">74%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[74%]" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-lg"
        >
          Save Profile
        </button>
      </div>

      {/* Choose Avatar */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Choose Avatar Icon
        </h4>
        <div className="flex gap-2">
          {avatars.map((av) => (
            <button
              key={av}
              onClick={() => {
                sound.playKeypadClick(600);
                setAvatar(av);
              }}
              className={`w-11 h-11 rounded-2xl border text-xl flex items-center justify-center cursor-pointer transition-all ${
                avatar === av ? 'border-blue-400 bg-blue-500/30 scale-110 shadow-lg' : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Unlocked Badges & Achievements
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((a, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-center gap-3 ${
              a.unlocked
                ? 'bg-blue-500/10 border-blue-500/30 text-white'
                : 'bg-white/5 border-white/5 opacity-50'
            }`}
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <div className="text-xs font-bold">{a.title}</div>
              <div className="text-[10px] text-slate-400">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

/* --- FAST.COM SPEED TEST APP --- */
export const FastComApp: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const startTest = () => {
    sound.playSoundEffect('laser');
    setIsTesting(true);
    setIsFinished(false);
    setSpeed(0);

    let current = 0;
    const target = 184 + Math.floor(Math.random() * 40);
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 2;
      if (current >= target) {
        clearInterval(interval);
        setSpeed(target);
        setIsTesting(false);
        setIsFinished(true);
        sound.playSoundEffect('levelup');
      } else {
        setSpeed(current);
      }
    }, 60);
  };

  useEffect(() => {
    startTest();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto p-4 text-slate-100">
      <div className="w-full rounded-3xl bg-slate-950 border border-white/10 p-8 flex flex-col items-center text-center shadow-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Aurora Speed Engine
        </span>

        <div className="my-6">
          <div className="text-7xl sm:text-8xl font-black font-mono text-white tracking-tight flex items-baseline justify-center gap-2">
            <span>{speed}</span>
            <span className="text-2xl sm:text-3xl font-normal text-rose-400 font-sans">Mbps</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-white/10 text-center mb-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Latency</div>
            <div className="text-sm font-mono font-bold text-emerald-400">12 ms</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Upload</div>
            <div className="text-sm font-mono font-bold text-sky-400">92 Mbps</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Bufferbloat</div>
            <div className="text-sm font-mono font-bold text-amber-400">A+ Grade</div>
          </div>
        </div>

        <button
          onClick={startTest}
          disabled={isTesting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-500/30 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Testing Speed...' : 'Test Again'}</span>
        </button>
      </div>
    </div>
  );
};
