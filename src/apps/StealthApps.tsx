import React, { useState } from 'react';
import { Video, Mail, FileText, Send, Lock, Mic, MicOff, Camera, CameraOff, Save } from 'lucide-react';
import { sound } from '../utils/soundEffects';

// 1. MeetApp
export const MeetApp: React.FC = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Google Meet Disguise Room</h1>
            <p className="text-xs text-slate-400">Stealth meeting screen • Looks like class lecture</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
          00:32:15 • Connected
        </span>
      </div>

      <div className="flex-1 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden relative flex items-center justify-center min-h-[320px]">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-black text-white mx-auto shadow-2xl">
            ZH
          </div>
          <h3 className="font-bold text-lg text-white">AP Computer Science Lecture (Live)</h3>
          <p className="text-xs text-slate-400">Dr. Aris is currently presenting: "Algorithm Complexity Big-O"</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => {
            sound.playKeypadClick(400);
            setMicOn(!micOn);
          }}
          className={`p-3 rounded-2xl border cursor-pointer ${
            micOn ? 'bg-white/10 text-white border-white/20' : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => {
            sound.playKeypadClick(400);
            setCamOn(!camOn);
          }}
          className={`p-3 rounded-2xl border cursor-pointer ${
            camOn ? 'bg-white/10 text-white border-white/20' : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}
        >
          {camOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// 2. InboxApp
export const InboxApp: React.FC = () => {
  const [messages] = useState([
    { from: 'Principal Miller', subject: 'Upcoming School Assembly Schedule', time: '10:14 AM' },
    { from: 'Google Classroom', subject: 'New Assignment: Unit 4 Review Practice', time: 'Yesterday' },
    { from: 'Aurora Network Hub', subject: 'System Update: 31 Unblocked Games Active', time: 'Oct 24' },
  ]);

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Secret Dispatch Inbox</h1>
          <p className="text-xs text-slate-400">Stealth messaging and disguised school notifications</p>
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4 hover:border-sky-400/40 cursor-pointer transition-colors">
            <div>
              <span className="text-xs font-bold text-sky-400">{m.from}</span>
              <h4 className="text-sm font-semibold text-white mt-0.5">{m.subject}</h4>
            </div>
            <span className="text-xs text-slate-500 font-mono shrink-0">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. NotepadApp
export const NotepadApp: React.FC = () => {
  const [text, setText] = useState(
    '# AP History Notes\n- Treaty of Versailles (1919)\n- League of Nations\n- Post-war economic conditions\n\n[Secret Link: AuroraOS Unblocked Games]'
  );

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Stealth Scratchpad</h1>
            <p className="text-xs text-slate-400">Quick notes, study cheat sheets & secret copy-paste</p>
          </div>
        </div>

        <button
          onClick={() => sound.playSoundEffect('levelup')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer active:scale-95 transition-transform"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Notes</span>
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full min-h-[300px] p-5 rounded-2xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:border-amber-400 leading-relaxed"
      />
    </div>
  );
};
