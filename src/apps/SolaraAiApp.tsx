import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const PRESET_TIPS: { [q: string]: string } = {
  '2048 Strategy':
    'To master 2048: Always keep your highest value tile locked in a specific corner (e.g. bottom-right) and NEVER press Up! Build numbers in descending order along that edge.',
  'Celeste Jumps':
    'For difficult Celeste mountain stages: Save your air dash until the apex of your jump for maximum horizontal momentum. Wall jumps do not consume your stamina meter if executed with quick releases.',
  'Unblocked Proxies':
    'AuroraOS includes built-in Tab Cloaking and client-side games that run 100% locally in your browser memory, bypassing standard school web filters completely.',
  'Konami Code':
    'Classic gamer code: Up, Up, Down, Down, Left, Right, Left, Right, B, A. In many retro titles, this grants 30 extra lives!',
};

export const SolaraAiApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings! I am Solara AI, your AuroraOS gaming companion and unblocked study assistant. Ask me for cheat codes, game strategies, or quick homework help!',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    sound.playKeypadClick(600);
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      sound.playSoundEffect('levelup');
      let reply = '';
      if (query.toLowerCase().includes('2048')) {
        reply = PRESET_TIPS['2048 Strategy'];
      } else if (query.toLowerCase().includes('celeste')) {
        reply = PRESET_TIPS['Celeste Jumps'];
      } else if (query.toLowerCase().includes('proxy') || query.toLowerCase().includes('unblocked')) {
        reply = PRESET_TIPS['Unblocked Proxies'];
      } else if (query.toLowerCase().includes('cheat') || query.toLowerCase().includes('code')) {
        reply = PRESET_TIPS['Konami Code'];
      } else {
        reply = `Here is my recommendation for "${query}": Keep your frame rate high, utilize the AuroraOS Tab Cloaker whenever privacy is needed, and practice speedrunning the built-in 2048 and Snake retro cabinets!`;
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: reply },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Solara AI Intelligence</h3>
          <p className="text-xs text-emerald-400">Online • Unblocked Gaming & Cheat Assistant</p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
        {Object.keys(PRESET_TIPS).map((topic) => (
          <button
            key={topic}
            onClick={() => sendMessage(topic)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-emerald-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            ⚡ {topic}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/40 rounded-2xl border border-white/5 mb-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 italic">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Solara AI is generating response...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for game strategies, cheats, or homework..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
