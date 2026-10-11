import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface EventItem {
  id: string;
  time: string;
  title: string;
  type: 'class' | 'exam' | 'break' | 'gaming';
}

const DEFAULT_EVENTS: EventItem[] = [
  { id: '1', time: '08:30 AM', title: 'Period 1: Algebra II (Disguised Mode)', type: 'class' },
  { id: '2', time: '09:45 AM', title: 'Period 2: Chemistry Lab', type: 'class' },
  { id: '3', time: '11:15 AM', title: 'Free Period / Unblocked Gaming Break', type: 'gaming' },
  { id: '4', time: '12:30 PM', title: 'Lunch & Multiplayer Lobby', type: 'break' },
  { id: '5', time: '01:45 PM', title: 'Period 4: Computer Science', type: 'class' },
];

export const CalendarApp: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number>(10);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    sound.playSoundEffect('levelup');
    setEvents([
      ...events,
      {
        id: Date.now().toString(),
        time: newTime || '02:30 PM',
        title: newTitle,
        type: 'class',
      },
    ]);
    setNewTitle('');
    setNewTime('');
  };

  const removeEvent = (id: string) => {
    sound.playKeypadClick(400);
    setEvents(events.filter((ev) => ev.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Month Calendar Grid */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-400" />
                <span>October 2026</span>
              </h3>
              <p className="text-xs text-slate-400">Aurora Academic Schedule</p>
            </div>
            <div className="flex gap-1">
              <button className="p-1 rounded bg-white/5 hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 rounded bg-white/5 hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {/* Empty slots for start of month */}
            {[0, 1, 2, 3].map((i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isToday = day === 10;
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => {
                    sound.playKeypadClick(500);
                    setSelectedDay(day);
                  }}
                  className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isToday
                      ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/30'
                      : isSelected
                      ? 'bg-sky-500/30 border border-sky-400 text-sky-200'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">School Bell Countdown:</span>
            <span className="font-mono font-bold text-amber-300">42m until Period 3</span>
          </div>
        </div>

        {/* Schedule & Events Planner */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
            <span>Period Timetable • Oct {selectedDay}</span>
            <span className="text-xs text-sky-400 font-mono">{events.length} periods</span>
          </h3>

          <div className="flex-1 space-y-2 overflow-y-auto mb-4 max-h-[300px]">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-100">{ev.title}</div>
                  <div className="text-[10px] text-sky-400 font-mono">{ev.time}</div>
                </div>
                <button
                  onClick={() => removeEvent(ev.id)}
                  className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 text-xs px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add period form */}
          <form onSubmit={addEvent} className="flex gap-2">
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="02:30 PM"
              className="w-24 px-2 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New class or task..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold text-xs text-white cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
