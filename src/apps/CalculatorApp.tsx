import React, { useState } from 'react';
import { Calculator as CalcIcon, Shield, Delete } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleDigit = (d: string) => {
    sound.playKeypadClick(400);
    if (display === '0') setDisplay(d);
    else setDisplay(display + d);
  };

  const handleOp = (op: string) => {
    sound.playKeypadClick(500);
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    sound.playSoundEffect('powerdown');
    setDisplay('0');
    setEquation('');
  };

  const handleEquals = () => {
    sound.playSoundEffect('coin');
    try {
      const full = `${equation}${display}`;
      // Safe math evaluate
      const sanitized = full.replace(/×/g, '*').replace(/÷/g, '/');
      const res = Function(`"use strict"; return (${sanitized})`)();
      setDisplay(String(res));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="p-6 text-white max-w-sm mx-auto h-full flex flex-col justify-center select-none">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4">
        {/* Screen */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-right space-y-1">
          <div className="text-[11px] font-mono text-slate-500 h-4">{equation}</div>
          <div className="text-3xl font-mono font-black text-white truncate">{display}</div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {['C', '±', '%', '÷'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === 'C' ? handleClear() : handleOp(btn))}
              className="h-12 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-sm cursor-pointer transition-colors active:scale-95"
            >
              {btn}
            </button>
          ))}
          {['7', '8', '9', '×'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '×' ? handleOp(btn) : handleDigit(btn))}
              className={`h-12 rounded-xl font-bold text-sm cursor-pointer transition-colors active:scale-95 ${
                btn === '×' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', '-'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '-' ? handleOp(btn) : handleDigit(btn))}
              className={`h-12 rounded-xl font-bold text-sm cursor-pointer transition-colors active:scale-95 ${
                btn === '-' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '+' ? handleOp(btn) : handleDigit(btn))}
              className={`h-12 rounded-xl font-bold text-sm cursor-pointer transition-colors active:scale-95 ${
                btn === '+' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm cursor-pointer active:scale-95"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg shadow-emerald-500/30 active:scale-95"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
