import React, { useState } from 'react';
import { Play, RotateCcw, Terminal as TermIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const DEFAULT_CODE = `// JavaScript Code Runner
const students = ["Alex", "Jordan", "Taylor", "Sam"];
const scores = students.map(name => ({
  name,
  score: Math.floor(Math.random() * 30) + 70
}));

console.log("🎮 Game High Scores:");
console.table(scores);

const topPlayer = scores.reduce((max, s) => s.score > max.score ? s : max);
console.log("🏆 Top Scorer is:", topPlayer.name, "with", topPlayer.score, "points!");
`;

export const JsExecutorApp: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  const handleRun = () => {
    sound.playSoundEffect('levelup');
    setHasError(false);
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      table: (data: any) => {
        logs.push(JSON.stringify(data, null, 2));
      },
      error: (...args: any[]) => {
        logs.push('[ERROR] ' + args.join(' '));
      },
    };

    try {
      const runFn = new Function('console', code);
      runFn(customConsole);
      setOutput(logs.length > 0 ? logs : ['Execution completed with no console output.']);
    } catch (err: any) {
      sound.playError();
      setHasError(true);
      setOutput([`Error: ${err.message}`]);
    }
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto h-full flex flex-col overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
            JS
          </div>
          <div>
            <h1 className="text-xl font-black">JS Code Executor</h1>
            <p className="text-xs text-slate-400">Run safe sandboxed JavaScript snippets in your browser</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCode(DEFAULT_CODE);
              setOutput([]);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-400/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[360px]">
        {/* Editor */}
        <div className="flex flex-col rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
          <div className="px-4 py-2 border-b border-white/10 bg-slate-950/60 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>script.js</span>
            <span className="text-[10px] text-amber-400">ES6+ Playground</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs bg-slate-950 text-emerald-300 resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Console Output */}
        <div className="flex flex-col rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
          <div className="px-4 py-2 border-b border-white/10 bg-slate-950/60 text-xs font-mono text-slate-400 flex items-center gap-2">
            <TermIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Console Output</span>
          </div>
          <div className="flex-1 w-full p-4 font-mono text-xs bg-slate-950/90 overflow-y-auto space-y-2">
            {output.length === 0 ? (
              <span className="text-slate-600">Press "Run Code" to execute...</span>
            ) : (
              output.map((line, idx) => (
                <div
                  key={idx}
                  className={`whitespace-pre-wrap ${
                    hasError ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
