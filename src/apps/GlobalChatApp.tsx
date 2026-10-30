import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Users, Shield, Smile } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { sessionManager } from '../utils/sessionManager';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isAdmin?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'Admin_Host', text: 'Welcome to AuroraOS Global Lounge! Keep it chill.', time: '12:00 PM', isAdmin: true },
  { id: '2', sender: 'Guest_719', text: 'Anyone playing retro pacman right now?', time: '12:02 PM' },
  { id: '3', sender: 'Guest_402', text: 'Yeah I just hit 14,000 points on level 4 lol', time: '12:03 PM' },
];

export const GlobalChatApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const guestName = sessionManager.getGuestName();
  const isAdmin = sessionManager.isUserAdmin();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sound.playSoundEffect('coin');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: guestName,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Global Unblocked Chat</h1>
            <p className="text-xs text-slate-400">Public network lobby • Posting as <span className="text-emerald-400 font-bold">{guestName}</span></p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live Room
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className={m.isAdmin ? 'text-amber-400 font-black' : 'text-emerald-400'}>{m.sender}</span>
                {m.isAdmin && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    ADMIN
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
            </div>
            <p className="text-xs text-slate-200">{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-white/10 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Say something in Global Chat as ${guestName}...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-emerald-400 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
