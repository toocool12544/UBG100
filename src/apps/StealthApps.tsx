import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  Users,
  MessageSquare,
  FileText,
  Mail,
  Gift,
  Lock,
  Download,
  Check,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

/* --- FAKE MEET SIMULATOR --- */
export const MeetApp: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);

  const participants = [
    { name: 'Prof. Henderson (Host)', color: 'from-blue-600 to-indigo-800', speaking: true, role: 'Teacher' },
    { name: 'Alex M. (You)', color: 'from-emerald-500 to-teal-700', speaking: false, role: 'Student' },
    { name: 'Sarah Chen', color: 'from-purple-600 to-pink-700', speaking: false, role: 'Student' },
    { name: 'Marcus Brody', color: 'from-amber-600 to-orange-800', speaking: false, role: 'Student' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-2 sm:p-4 rounded-xl">
      {/* Top Meeting Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">AP Physics & Advanced Calculus Study Hall</span>
          <span className="text-slate-400 hidden sm:inline">• meet.google.com/xyz-qwe-abc</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
            REC ● 01:24:18
          </span>
        </div>
      </div>

      {/* Video Grid 2x2 */}
      <div className="flex-1 grid grid-cols-2 gap-3 py-3 min-h-[280px]">
        {participants.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-2xl bg-gradient-to-br ${p.color} border relative overflow-hidden flex flex-col items-center justify-center shadow-xl ${
              p.speaking ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-white/10'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black text-white shadow-inner mb-2">
              {p.name[0]}
            </div>
            <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
              <span>{p.name}</span>
              {p.speaking && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
        <button
          onClick={() => {
            sound.playKeypadClick(400);
            setIsMuted(!isMuted);
          }}
          className={`p-3 rounded-full cursor-pointer transition-all ${
            isMuted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-white/10 text-white'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            sound.playKeypadClick(400);
            setIsVideoOn(!isVideoOn);
          }}
          className={`p-3 rounded-full cursor-pointer transition-all ${
            !isVideoOn ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-white/10 text-white'
          }`}
          title={isVideoOn ? 'Turn off video' : 'Turn on video'}
        >
          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            sound.playSoundEffect('levelup');
            setIsHandRaised(!isHandRaised);
          }}
          className={`px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all ${
            isHandRaised ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white'
          }`}
        >
          ✋ {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        </button>

        <button
          onClick={() => sound.playSoundEffect('oof')}
          className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-lg"
          title="Leave Call"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* --- INBOX APP --- */
export const InboxApp: React.FC = () => {
  const [selectedMail, setSelectedMail] = useState<number>(0);

  const mails = [
    {
      id: 1,
      sender: 'AuroraOS System',
      subject: 'Welcome to AuroraOS 2026 Edition',
      time: '10:00 AM',
      body: 'Your unblocked web environment is fully operational! Remember the master PIN passcode is 1234. Use the Cloak Tab feature anytime to disguise the tab header as Google Classroom or Google Docs.',
    },
    {
      id: 2,
      sender: 'Secret Dispatch',
      subject: 'Easter Egg Code: 1337',
      time: 'Yesterday',
      body: 'Type 1337= in the Calculator app to trigger developer mode. Also try typing "matrix" or "hack" in the Terminal app for realistic hacker effects!',
    },
    {
      id: 3,
      sender: 'Game Vault Admin',
      subject: '7 Playable HTML5 Cabinets Ready',
      time: 'Oct 9',
      body: 'All classic cabinets (2048, Flappy Bird, Snake Neon, T-Rex Dino Sprint, Cookie Clicker, Retro Pong, and Celeste Summit) are loaded and ready to play.',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 text-slate-100 max-w-4xl mx-auto">
      {/* Mail List */}
      <div className="w-full sm:w-72 bg-slate-900/90 border-r border-white/10 p-3 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-sky-400" />
          <span>Covert Messages (3)</span>
        </div>
        {mails.map((m, idx) => (
          <div
            key={m.id}
            onClick={() => {
              sound.playKeypadClick(500);
              setSelectedMail(idx);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedMail === idx
                ? 'bg-sky-500/20 border-sky-400 text-white'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
            }`}
          >
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-xs font-bold text-white">{m.sender}</span>
              <span className="text-[10px] text-slate-400">{m.time}</span>
            </div>
            <div className="text-xs font-medium truncate text-sky-300">{m.subject}</div>
            <div className="text-[11px] text-slate-400 truncate">{m.body}</div>
          </div>
        ))}
      </div>

      {/* Message Reader */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-slate-950/60">
        <div>
          <div className="flex justify-between items-start pb-3 mb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-base text-white">{mails[selectedMail].subject}</h3>
              <div className="text-xs text-sky-400 mt-0.5">From: {mails[selectedMail].sender}</div>
            </div>
            <span className="text-xs font-mono text-slate-400">{mails[selectedMail].time}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {mails[selectedMail].body}
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- NOTEPAD SCRATCHPAD APP --- */
export const NotepadApp: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    return (
      localStorage.getItem('aurora_notepad') ||
      '# AuroraOS Scratchpad\n\n- Unblocked games are working smoothly.\n- Password set to: 1234\n- Remember to complete chemistry homework by 4 PM!'
    );
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('aurora_notepad', content);
  }, [content]);

  const disguiseAsEssay = () => {
    sound.playSoundEffect('levelup');
    setContent(
      'The Analysis of Thermodynamic Principles in Renewable Energy Systems\n\nAbstract:\nIn modern thermodynamic applications, the enthalpy and entropy distributions dictate energy conservation...'
    );
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-3 text-slate-100">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">Notepad & Stealth Scratchpad</span>
          <span className="text-slate-400 font-mono">({wordCount} words • {charCount} chars)</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={disguiseAsEssay}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors cursor-pointer"
          >
            Disguise as Essay
          </button>
          <button
            onClick={() => {
              sound.playKeypadClick(500);
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'notes.txt';
              a.click();
            }}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Export .txt
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type notes, copy links, or paste cheat codes..."
        className="flex-1 w-full p-4 rounded-2xl bg-slate-950/90 border border-white/10 font-mono text-xs sm:text-sm text-slate-100 resize-none focus:outline-none focus:border-amber-400/50 leading-relaxed"
      />
    </div>
  );
};
