import React, { useState, useRef } from 'react';
import { Play, RotateCcw, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const PRESETS: { [key: string]: { label: string; code: string } } = {
  matrix: {
    label: 'Matrix Rain Output',
    code: `// Generate green digital rain sequence
const chars = "0123456789ABCDEF!@#$%^&*";
let output = "";
for (let i = 0; i < 8; i++) {
  let line = "";
  for (let j = 0; j < 32; j++) {
    line += chars[Math.floor(Math.random() * chars.length)];
  }
  output += line + "\\n";
}
console.log(">> MATRIX CODE STREAM INITIALIZED:");
console.log(output);
`,
  },
  fib: {
    label: 'Fibonacci Benchmark',
    code: `function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}

const n = 50;
const start = performance.now();
const res = fib(n);
const duration = (performance.now() - start).toFixed(4);

console.log(\`Calculated Fib(\${n}) = \${res}\`);
console.log(\`Execution time: \${duration} ms\`);
`,
  },
  math: {
    label: 'Math & Sine Waves',
    code: `for (let i = 0; i <= 10; i++) {
  const rad = (i * Math.PI) / 5;
  const sinVal = Math.sin(rad).toFixed(3);
  const cosVal = Math.cos(rad).toFixed(3);
  console.log(\`Step \${i}: sin=\${sinVal}, cos=\${cosVal}\`);
}
`,
  },
};

export const JsExecutorApp: React.FC = () => {
  const [code, setCode] = useState<string>(PRESETS.matrix.code);
  const [logs, setLogs] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<string | null>(null);

  const runCode = () => {
    sound.playSoundEffect('levelup');
    const newLogs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        newLogs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      },
      error: (...args: unknown[]) => {
        newLogs.push('[ERROR] ' + args.join(' '));
      },
      warn: (...args: unknown[]) => {
        newLogs.push('[WARN] ' + args.join(' '));
      },
    };

    const startTime = performance.now();
    try {
      const runner = new Function('console', code);
      runner(customConsole);
      const elapsed = (performance.now() - startTime).toFixed(2);
      setExecutionTime(`${elapsed} ms`);
    } catch (err: unknown) {
      newLogs.push(`Runtime Error: ${(err as Error).message}`);
    }
    setLogs(newLogs);
  };

  const clearAll = () => {
    setLogs([]);
    setExecutionTime(null);
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100 p-2">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Object.entries(PRESETS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCode(v.code)}
              className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/15 text-amber-300 font-medium transition-colors cursor-pointer"
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {executionTime && (
            <span className="text-[11px] font-mono text-emerald-400">
              ⚡ {executionTime}
            </span>
          )}
          <button
            onClick={clearAll}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear Console"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute JS</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[300px]">
        {/* Editor */}
        <div className="flex flex-col rounded-xl bg-slate-950/80 border border-white/10 overflow-hidden shadow-inner">
          <div className="px-3 py-1.5 bg-slate-900 border-b border-white/10 text-[11px] font-mono text-amber-300 flex justify-between items-center">
            <span>script.js</span>
            <span className="text-slate-500">ECMAScript Sandbox</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-3 font-mono text-xs text-amber-100 bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed"
          />
        </div>

        {/* Console Output */}
        <div className="flex flex-col rounded-xl bg-slate-950/90 border border-white/10 overflow-hidden shadow-inner">
          <div className="px-3 py-1.5 bg-slate-900 border-b border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>Output Console</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">Click "Execute JS" to see script output...</span>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap ${
                    log.includes('Error') ? 'text-rose-400' : 'text-emerald-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
