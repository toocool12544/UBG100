import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Shield, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface TerminalLine {
  type: 'in' | 'out' | 'err';
  text: string;
}

const WELCOME_BANNER = `
 █████╗ ██╗   ██╗██████╗  ██████╗ ██████╗  █████╗  ██████╗ ███████╗
██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔═══██╗██╔════╝
███████║██║   ██║██████╔╝██║   ██║██████╔╝███████║██║   ██║███████╗
██╔══██║██║   ██║██╔══██╗██║   ██║██╔══██╗██╔══██║██║   ██║╚════██║
██║  ██║╚██████╔╝██║  ██║╚██████╔╝██║  ██║██║  ██║╚██████╔╝███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
AuroraOS v4.2 Kernel [x86_64] • Stealth Shell
Type 'help' for available commands.
`;

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'out', text: WELCOME_BANNER },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    sound.playKeypadClick(400);
    const newHistory: TerminalLine[] = [...history, { type: 'in', text: `$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'out',
          text: `Available Commands:
  help       - List terminal commands
  clear      - Clear terminal screen
  neofetch   - Display AuroraOS system information
  ping       - Check network latency
  matrix     - Toggle green matrix cascade
  apps       - List installed applications
  date       - Show current timestamp
  whoami     - Show active session user`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'neofetch':
        newHistory.push({
          type: 'out',
          text: `OS: AuroraOS 4.2 Unblocked
Host: Web Client [Vite SPA + Express]
Kernel: 6.8.0-aurora-custom
Uptime: 4 hours, 12 mins
Shell: /bin/aurora-sh
Memory: 342MB / 8192MB
Resolution: ${window.innerWidth}x${window.innerHeight}`,
        });
        break;

      case 'ping':
        newHistory.push({
          type: 'out',
          text: `PING aurora-gateway (192.168.1.1): 56 data bytes
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=14.2 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=12.8 ms
--- aurora-gateway ping statistics ---
2 packets transmitted, 2 received, 0% packet loss`,
        });
        break;

      case 'apps':
        newHistory.push({
          type: 'out',
          text: 'Installed apps: Games, AP, Cinera, MP3, JS, Retro, Terminal, Soundboard, Roblox, Clips, Paint, Calculator, Celeste, etc.',
        });
        break;

      case 'date':
        newHistory.push({
          type: 'out',
          text: new Date().toString(),
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'out',
          text: 'aurora_operator [uid=1000 gid=1000 groups=admin,games]',
        });
        break;

      default:
        newHistory.push({
          type: 'err',
          text: `bash: ${cmd}: command not found. Type 'help' for commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="p-4 sm:p-6 text-white max-w-5xl mx-auto h-full flex flex-col justify-between overflow-hidden font-mono bg-black/90 rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-300 font-bold ml-2">aurora@terminal:~</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold">READY</span>
      </div>

      {/* Screen Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 text-xs text-emerald-400 select-text">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'in' ? 'text-white font-bold' : line.type === 'err' ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-white/10 shrink-0">
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help'..."
          autoFocus
          className="flex-1 bg-transparent border-0 text-white font-mono text-xs focus:outline-none"
        />
      </form>
    </div>
  );
};
