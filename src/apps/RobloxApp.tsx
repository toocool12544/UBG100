import React, { useState } from 'react';
import { Play, Sparkles, Volume2, Gamepad, Award } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ObbyStage {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  jumps: number;
}

const STAGES: ObbyStage[] = [
  { id: 1, name: 'Rainbow Stairway', difficulty: 'Easy', jumps: 5 },
  { id: 2, name: 'Lava Block Jumper', difficulty: 'Medium', jumps: 8 },
  { id: 3, name: 'Disappearing Neon Platforms', difficulty: 'Hard', jumps: 12 },
  { id: 4, name: 'Speed Coil Tower Climb', difficulty: 'Insane', jumps: 16 },
];

export const RobloxApp: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [jumpsDone, setJumpsDone] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const stage = STAGES.find((s) => s.id === currentStage) || STAGES[0];

  const handleJump = () => {
    sound.playSoundEffect('jump');
    const success = Math.random() > (stage.id * 0.08);

    if (success) {
      const nextJumps = jumpsDone + 1;
      setScore((prev) => prev + 100 * stage.id);
      setStreak((prev) => prev + 1);

      if (nextJumps >= stage.jumps) {
        sound.playSoundEffect('levelup');
        if (currentStage < STAGES.length) {
          setCurrentStage((prev) => prev + 1);
          setJumpsDone(0);
        } else {
          // Beat game
          setJumpsDone(stage.jumps);
        }
      } else {
        setJumpsDone(nextJumps);
      }
    } else {
      sound.playSoundEffect('powerdown');
      setStreak(0);
      setJumpsDone(0);
    }
  };

  const handleOofSound = () => {
    sound.playSoundEffect('powerdown');
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center">
            <div className="w-5 h-5 bg-white rotate-12 rounded-[2px] flex items-center justify-center">
              <div className="w-2 h-2 bg-neutral-900 rounded-[1px]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black">Roblox Obby Simulator</h1>
            <p className="text-xs text-slate-400">Parkour jump simulator & classic soundboard</p>
          </div>
        </div>

        <button
          onClick={handleOofSound}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Play "OOF!"</span>
        </button>
      </div>

      {/* Main Obby Arena */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl text-center space-y-4">
        <div className="flex items-center justify-center gap-4 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300">
            Stage {stage.id}: {stage.name} ({stage.difficulty})
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
            Score: {score}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
            Streak: {streak}x
          </span>
        </div>

        {/* Visual Progress Blocks */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto py-6">
          {Array.from({ length: stage.jumps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-12 rounded-xl border transition-all flex items-center justify-center font-bold text-xs ${
                i < jumpsDone
                  ? 'bg-gradient-to-t from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : i === jumpsDone
                  ? 'bg-gradient-to-t from-cyan-500 to-sky-400 border-cyan-300 text-slate-950 animate-bounce'
                  : 'bg-white/5 border-white/10 text-slate-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          onClick={handleJump}
          className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/30 transition-all active:scale-95 cursor-pointer mx-auto block"
        >
          Jump Platform! (Space)
        </button>
      </div>
    </div>
  );
};
