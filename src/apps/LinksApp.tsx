import React from 'react';
import { ExternalLink, Link2, Shield, Globe, Compass } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MirrorLink {
  title: string;
  category: string;
  url: string;
  desc: string;
}

const MIRRORS: MirrorLink[] = [
  { title: 'Fiveplay Hub', category: 'Gaming', url: 'https://fiveplay.org', desc: 'Huge library of unblocked HTML5 and WebGL games' },
  { title: 'Now.gg Cloud Gaming', category: 'Cloud Emulation', url: 'https://now.gg', desc: 'Play mobile Android games in browser without installs' },
  { title: 'Coolmath Unblocked', category: 'Logic & Puzzle', url: 'https://coolmathgames.com', desc: 'Run3, Papa Louie, Fireboy & Watergirl classic collection' },
  { title: 'GitHub Mirrors', category: 'Developer', url: 'https://github.com', desc: 'Open-source game engines and browser ports' },
  { title: 'Wikipedia Encyclopedia', category: 'Study Cloak', url: 'https://en.wikipedia.org', desc: 'Research and reference portal' },
];

interface LinksAppProps {
  currentCloak?: string;
  onSelectCloak?: (cloak: string) => void;
}

export const LinksApp: React.FC<LinksAppProps> = () => {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col overflow-y-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
          <Link2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Stealth Links & Unblocked Mirrors</h1>
          <p className="text-xs text-slate-400">Direct gateways and verified unblocked browser mirrors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MIRRORS.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playSoundEffect('coin')}
            className="p-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-900/90 transition-all cursor-pointer shadow-lg group block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                {link.category}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{link.title}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
