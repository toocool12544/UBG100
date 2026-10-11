import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Send, Smile, Hash, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ChatMessage {
  id: string;
  sender: string;
  channel: string;
  text: string;
  time: string;
  avatarColor: string;
}

const CHANNELS = ['general', 'unblocked-games', 'speedruns', 'cheat-codes'];

const BOT_REPLIES = [
  'Anyone know the high score for Flappy Bird on AuroraOS?',
  'Just hit 2048 on the built-in cabinet! Keep high tiles bottom right.',
  'Make sure to use the Cloak Tab feature if a teacher walks by haha',
  'The soundboard has Vine Boom and bruh, spamming it now lol',
  'Try typing "matrix" in the Terminal app, looks super hacker style!',
];

export const GlobalChatApp: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ShadowNinja',
      channel: 'general',
      text: 'Yo welcome to AuroraOS chat lobby!',
      time: '12:04 PM',
      avatarColor: 'from-emerald-500 to-teal-600',
    },
    {
      id: '2',
      sender: 'Viper88',
      channel: 'unblocked-games',
      text: 'What game should we speedrun today? Celeste or Breakout?',
      time: '12:05 PM',
      avatarColor: 'from-sky-500 to-blue-600',
    },
    {
      id: '3',
      sender: 'CyberFox',
      channel: 'general',
      text: 'The 1234 passcode screen on start is super clean.',
      time: '12:06 PM',
      avatarColor: 'from-purple-500 to-pink-600',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sound.playSoundEffect('discord');
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      channel: activeChannel,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: 'from-rose-500 to-amber-500',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger random bot reply after short delay
    setTimeout(() => {
      sound.playSoundEffect('discord');
      const randomBot = ['EchoGamer', 'NovaPulse', 'PixelKnight'][Math.floor(Math.random() * 3)];
      const randomText = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: randomBot,
          channel: activeChannel,
          text: randomText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatarColor: 'from-teal-500 to-emerald-600',
        },
      ]);
    }, 1800);
  };

  const channelMessages = messages.filter((m) => m.channel === activeChannel);

  return (
    <div className="flex h-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 text-slate-100 bg-slate-950/80">
      {/* Channels Sidebar */}
      <div className="w-48 bg-slate-900/90 border-r border-white/10 p-3 flex flex-col justify-between hidden sm:flex">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Rooms</span>
          </div>
          <div className="space-y-1">
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  sound.playKeypadClick(500);
                  setActiveChannel(ch);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeChannel === ch
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>{ch}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 text-[11px] text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>48 Gamers Online</span>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-950/60">
        {/* Channel Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span>{activeChannel}</span>
          </div>
          <span className="text-[11px] text-slate-400 sm:hidden">
            Channels: {CHANNELS.join(' | ')}
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {channelMessages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${m.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm`}
              >
                {m.sender[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-white">{m.sender}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${activeChannel}...`}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
