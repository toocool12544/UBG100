import React, { useState } from 'react';
import { Calculator as CalcIcon, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<string>('');
  const [op, setOp] = useState<string | null>(null);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    sound.playKeypadClick(550);
    setDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleOp = (operator: string) => {
    sound.playKeypadClick(450);
    setPrevVal(display);
    setOp(operator);
    setDisplay('0');
  };

  const calculate = () => {
    // Check secret code 1337
    if (display === '1337' || `${prevVal}${display}` === '1337') {
      sound.playSoundEffect('levelup');
      setIsSecretUnlocked(true);
      setDisplay('1337 UNLOCKED');
      return;
    }

    if (!op || !prevVal) return;
    sound.playSoundEffect('coin');
    const a = parseFloat(prevVal);
    const b = parseFloat(display);
    let res = 0;

    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b !== 0 ? a / b : 0; break;
      default: break;
    }

    setDisplay(String(Number(res.toFixed(6))));
    setPrevVal('');
    setOp(null);
  };

  const clear = () => {
    sound.playKeypadClick(400);
    setDisplay('0');
    setPrevVal('');
    setOp(null);
  };

  const handleSci = (fn: string) => {
    sound.playKeypadClick(500);
    const val = parseFloat(display);
    if (fn === 'sqrt') setDisplay(String(Math.sqrt(val)));
    if (fn === 'sq') setDisplay(String(val * val));
    if (fn === 'sin') setDisplay(String(Math.sin(val).toFixed(4)));
    if (fn === 'cos') setDisplay(String(Math.cos(val).toFixed(4)));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-slate-100">
      <div className="w-72 sm:w-80 rounded-3xl bg-neutral-900 border border-white/20 p-5 shadow-2xl flex flex-col">
        {/* Screen */}
        <div className="bg-neutral-950 p-4 rounded-2xl border border-white/10 mb-4 text-right overflow-hidden shadow-inner">
          <div className="text-[11px] font-mono text-slate-400 h-4">
            {prevVal} {op}
          </div>
          <div className="text-3xl font-black font-mono text-white truncate">
            {display}
          </div>
        </div>

        {/* Scientific Row */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {['sin', 'cos', 'sqrt', 'sq'].map((fn) => (
            <button
              key={fn}
              onClick={() => handleSci(fn)}
              className="py-2 rounded-xl bg-neutral-800 text-slate-300 font-mono text-xs font-bold hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {fn}
            </button>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={clear}
            className="col-span-2 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm hover:bg-rose-500/30 cursor-pointer"
          >
            Clear (C)
          </button>
          <button
            onClick={() => handleOp('÷')}
            className="py-3 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-base hover:bg-amber-500/30 cursor-pointer"
          >
            ÷
          </button>
          <button
            onClick={() => handleOp('×')}
            className="py-3 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-base hover:bg-amber-500/30 cursor-pointer"
          >
            ×
          </button>

          {['7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOp('-')}
            className="py-3 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-base hover:bg-amber-500/30 cursor-pointer"
          >
            -
          </button>

          {['4', '5', '6'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOp('+')}
            className="py-3 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-base hover:bg-amber-500/30 cursor-pointer"
          >
            +
          </button>

          {['1', '2', '3'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={calculate}
            className="row-span-2 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xl cursor-pointer shadow-lg shadow-sky-500/30 flex items-center justify-center"
          >
            =
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base cursor-pointer shadow-sm"
          >
            .
          </button>
        </div>

        {isSecretUnlocked && (
          <div className="mt-3 p-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-[10px] text-emerald-300 text-center font-mono">
            🎉 Developer Mode Unlocked: All games run in turbo 60FPS mode!
          </div>
        )}
      </div>
    </div>
  );
};
