import React, { useState, useEffect } from 'react';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';

interface CalendarEvent {
  id: string;
  dateKey: string; // YYYY-MM-DD
  title: string;
  time: string;
  category: 'gaming' | 'project' | 'reminder' | 'personal';
}

const CATEGORY_STYLES = {
  gaming: {
    label: 'Gaming',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    dot: 'bg-cyan-400',
  },
  project: {
    label: 'Project',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    dot: 'bg-purple-400',
  },
  reminder: {
    label: 'Reminder',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    dot: 'bg-amber-400',
  },
  personal: {
    label: 'Personal',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    dot: 'bg-emerald-400',
  },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    dateKey: new Date().toISOString().slice(0, 10),
    title: 'AuroraOS Game Night (Unblocked)',
    time: '4:30 PM',
    category: 'gaming',
  },
  {
    id: '2',
    dateKey: new Date().toISOString().slice(0, 10),
    title: 'Check AP Device Connections',
    time: '6:00 PM',
    category: 'reminder',
  },
  {
    id: '3',
    dateKey: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    title: 'Pac-Man Speedrun Tournament',
    time: '3:00 PM',
    category: 'gaming',
  },
  {
    id: '4',
    dateKey: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    title: 'Coding Sprint: JS Executor Projects',
    time: '2:15 PM',
    category: 'project',
  },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarApp: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = safeStorage.getItem('aurora_calendar_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EVENTS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('4:00 PM');
  const [newCategory, setNewCategory] = useState<'gaming' | 'project' | 'reminder' | 'personal'>('gaming');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    safeStorage.setItem('aurora_calendar_events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Grid calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    sound.playKeypadClick(400);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    sound.playKeypadClick(400);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    sound.playSoundEffect('coin');
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const toDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const selectedDateKey = toDateKey(selectedDate);
  const selectedDayEvents = events.filter((e) => e.dateKey === selectedDateKey);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playSoundEffect('levelup');
    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      dateKey: selectedDateKey,
      title: newTitle.trim(),
      time: newTime || 'All Day',
      category: newCategory,
    };

    setEvents((prev) => [...prev, newEv]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    sound.playSoundEffect('powerdown');
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Build grid days
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const cellDate = new Date(year, month - 1, dayNum);
    calendarCells.push({
      date: cellDate,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const cellDate = new Date(year, month, i);
    calendarCells.push({
      date: cellDate,
      dayNum: i,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const cellDate = new Date(year, month + 1, i);
    calendarCells.push({
      date: cellDate,
      dayNum: i,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="p-4 sm:p-6 text-white max-w-6xl mx-auto h-full flex flex-col justify-between overflow-y-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
            <CalIcon className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Aurora Calendar
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                {year}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive monthly planner, reminders & events
            </p>
          </div>
        </div>

        {/* Month Navigation & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10 active:scale-95"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white min-w-[120px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Monthly Grid (Left) + Selected Day Events (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Month Grid View */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((cell, idx) => {
                const cellKey = toDateKey(cell.date);
                const isCellToday = isSameDay(cell.date, today);
                const isCellSelected = isSameDay(cell.date, selectedDate);
                const cellEvents = events.filter((e) => e.dateKey === cellKey);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playKeypadClick(500);
                      setSelectedDate(cell.date);
                    }}
                    className={`relative min-h-[58px] sm:min-h-[68px] p-2 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                      isCellSelected
                        ? 'bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : isCellToday
                        ? 'bg-white/10 border-white/30'
                        : cell.isCurrentMonth
                        ? 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-white/5'
                        : 'bg-black/20 border-transparent text-slate-600 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold ${
                          isCellToday
                            ? 'w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-sm'
                            : isCellSelected
                            ? 'text-cyan-300 font-black'
                            : cell.isCurrentMonth
                            ? 'text-slate-200'
                            : 'text-slate-600'
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {cellEvents.length > 0 && (
                        <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-500/20 px-1 rounded">
                          {cellEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Event category dot indicators */}
                    <div className="flex items-center gap-1 mt-1">
                      {cellEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            CATEGORY_STYLES[ev.category]?.dot || 'bg-cyan-400'
                          }`}
                        />
                      ))}
                      {cellEvents.length > 3 && (
                        <span className="text-[8px] text-slate-400 leading-none">+</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Today: {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Total {events.length} Events Logged
            </span>
          </div>
        </div>

        {/* Selected Day Agenda Panel */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  Selected Day
                </span>
                <h2 className="text-base font-black text-white">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h2>
              </div>

              <button
                onClick={() => {
                  sound.playKeypadClick(400);
                  setShowAddForm(!showAddForm);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel' : 'Add Event'}</span>
              </button>
            </div>

            {/* Quick Add Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddEvent}
                className="p-3.5 rounded-2xl bg-black/50 border border-cyan-500/30 mb-4 space-y-3 animate-in fade-in duration-200"
              >
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Event or reminder title..."
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 focus:border-cyan-400 text-xs text-white focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Time (e.g. 4:00 PM)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 focus:border-cyan-400 text-xs text-white focus:outline-none"
                  />

                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="px-2 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none"
                  >
                    <option value="gaming">Gaming</option>
                    <option value="project">Project</option>
                    <option value="reminder">Reminder</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Save Event
                </button>
              </form>
            )}

            {/* Events List for Selected Day */}
            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <CalIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>No events scheduled for this date.</p>
                <p className="text-[11px] text-slate-600 mt-1">Click "+ Add Event" to create one.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {selectedDayEvents.map((ev) => {
                  const catStyle = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.gaming;
                  return (
                    <div
                      key={ev.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${catStyle.badge}`}
                          >
                            {catStyle.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{ev.time}</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">{ev.title}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Legend */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] text-slate-400">
            {Object.entries(CATEGORY_STYLES).map(([key, item]) => (
              <span key={key} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
