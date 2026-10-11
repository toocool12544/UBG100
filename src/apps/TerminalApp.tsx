import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'error' | 'success';
}

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'AuroraOS Terminal [Version 2.4.0-unblocked]', type: 'success' },
    { text: 'Type "help" for a list of available commands or "matrix" for digital rain.', type: 'output' },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Matrix canvas rain effect
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const chars = '0123456789ABCDEF!@#$%^&*()_+{}[]:;<>?,./~`';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isMatrixActive]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    sound.playKeypadClick(600);
    const newHistory: TerminalLine[] = [...history, { text: `user@aurora:~$ ${cmd}`, type: 'cmd' }];
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      setIsMatrixActive(false);
      return;
    } else if (lower === 'matrix') {
      setIsMatrixActive(true);
      newHistory.push({ text: 'Matrix mode engaged. Press ESC or type "stop" to exit.', type: 'success' });
    } else if (lower === 'stop') {
      setIsMatrixActive(false);
      newHistory.push({ text: 'Matrix mode stopped.', type: 'output' });
    } else if (lower === 'help') {
      newHistory.push(
        { text: 'AVAILABLE COMMANDS:', type: 'success' },
        { text: '  matrix       - Stream digital falling code rain', type: 'output' },
        { text: '  stop         - Exit matrix mode', type: 'output' },
        { text: '  hack         - Simulate firewall penetration sequence', type: 'output' },
        { text: '  scan         - Scan local unblocked ports & proxies', type: 'output' },
        { text: '  games        - List 31 built-in unblocked games & apps', type: 'output' },
        { text: '  cowsay <msg> - ASCII cow speech generator', type: 'output' },
        { text: '  cat flag.txt - Reveal classified Aurora flag', type: 'output' },
        { text: '  whoami       - Display active gamer identity', type: 'output' },
        { text: '  clear        - Clear console window', type: 'output' }
      );
    } else if (lower.startsWith('cowsay')) {
      const msg = cmd.replace(/^cowsay\s*/i, '') || 'AuroraOS is unblocked!';
      const cow = [
        ` _______`,
        `< ${msg} >`,
        ` -------`,
        `        \\   ^__^`,
        `         \\  (oo)\\_______`,
        `            (__)\\       )\\/\\`,
        `                ||----w |`,
        `                ||     ||`,
      ].join('\n');
      newHistory.push({ text: cow, type: 'output' });
    } else if (lower === 'hack') {
      sound.playSoundEffect('levelup');
      newHistory.push(
        { text: '[*] Initializing quantum bypass protocol...', type: 'output' },
        { text: '[+] Bypassing district firewall filter... [SUCCESS]', type: 'success' },
        { text: '[+] High-speed unblocked tunnels verified: 100%', type: 'success' },
        { text: '[✓] Access granted. AuroraOS root privileges unlocked.', type: 'success' }
      );
    } else if (lower === 'scan') {
      newHistory.push(
        { text: 'Scanning internal memory ports...', type: 'output' },
        { text: 'PORT 3000: OPEN (AuroraOS Web Engine)', type: 'success' },
        { text: 'PORT 8080: OPEN (Unblocked Local Proxy)', type: 'success' },
        { text: 'PORT 1234: SECURED (Passcode Enclave)', type: 'output' }
      );
    } else if (lower === 'cat flag.txt') {
      sound.playSoundEffect('coin');
      newHistory.push({ text: 'FLAG{aurora_unblocked_games_master_1234}', type: 'success' });
    } else if (lower === 'whoami') {
      newHistory.push({ text: 'aurora-guest (UID: 1234, GID: 1234, groups: gamers, unblocked)', type: 'output' });
    } else if (lower === 'games') {
      newHistory.push({
        text: '30 Apps: Games, Cinera, MP3 Player, JS Executor, Suggestions, Camera, Calendar, Themes, Retro, Clips, Global Chat, Links, Roblox, Terminal, Soundboard, Movies, TikTok, Paint, Inbox, Meet, Calculator, Celeste, App Creator, Anime, Music, Notepad, Solara ID, Voice, Clock, Fast.com',
        type: 'output',
      });
    } else {
      newHistory.push({ text: `command not found: ${cmd}. Type 'help' for options.`, type: 'error' });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-white/10 relative overflow-hidden">
      {/* Matrix Canvas Backdrop */}
      {isMatrixActive && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 opacity-90" />
      )}

      {/* Terminal Output Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pb-2 relative z-20">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'cmd'
                ? 'text-sky-300 font-bold'
                : line.type === 'success'
                ? 'text-emerald-400 font-bold'
                : line.type === 'error'
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-white/10 relative z-20">
        <span className="text-emerald-400 font-bold select-none">user@aurora:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type help, matrix, hack..."
          autoFocus
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none focus:ring-0 caret-emerald-400"
        />
      </form>
    </div>
  );
};
