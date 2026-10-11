import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarApp: React.FC = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Navigation
  const prevMonth = () => {
    sound.playKeypadClick(450);
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    sound.playKeypadClick(550);
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    sound.playKeypadClick(600);
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Month grid calculations
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 sm:p-6 text-slate-100 items-center justify-center">
      {/* Calendar Card */}
      <div className="w-full rounded-3xl bg-slate-900/80 border border-sky-500/20 shadow-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-sky-500/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {MONTH_NAMES[month]} <span className="text-sky-400">{year}</span>
              </h2>
              <p className="text-xs text-sky-200/60 font-medium">Aurora Calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              Today
            </button>
            <div className="flex items-center gap-1 bg-slate-950/70 border border-sky-500/20 rounded-xl p-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-white/10 text-sky-300 cursor-pointer active:scale-90 transition-transform"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-white/10 text-sky-300 cursor-pointer active:scale-90 transition-transform"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-sky-400/80 uppercase tracking-wider mb-3">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
          {/* Previous month trailing days */}
          {Array.from({ length: firstDayIndex }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
            const prevMonthDate = new Date(year, month - 1, dayNum);
            return (
              <button
                key={`prev-${i}`}
                onClick={() => {
                  sound.playKeypadClick(400);
                  setViewDate(new Date(year, month - 1, 1));
                  setSelectedDate(prevMonthDate);
                }}
                className="h-11 sm:h-13 rounded-2xl text-xs sm:text-sm text-slate-600 hover:text-slate-400 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
              >
                {dayNum}
              </button>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
            const dateObj = new Date(year, month, day);
            const isToday = isSameDay(dateObj, today);
            const isSelected = isSameDay(dateObj, selectedDate);

            return (
              <button
                key={day}
                onClick={() => {
                  sound.playKeypadClick(500);
                  setSelectedDate(dateObj);
                }}
                className={`h-11 sm:h-13 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black shadow-lg shadow-sky-500/30 scale-105 border border-cyan-300'
                    : isToday
                    ? 'bg-sky-500/20 border border-sky-400 text-sky-300 font-bold'
                    : 'text-slate-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                <span>{day}</span>
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
                )}
              </button>
            );
          })}

          {/* Next month leading days to complete grid */}
          {(() => {
            const totalCells = firstDayIndex + daysInCurrentMonth;
            const remainingCells = (7 - (totalCells % 7)) % 7;
            return Array.from({ length: remainingCells }).map((_, i) => {
              const dayNum = i + 1;
              const nextMonthDate = new Date(year, month + 1, dayNum);
              return (
                <button
                  key={`next-${i}`}
                  onClick={() => {
                    sound.playKeypadClick(400);
                    setViewDate(new Date(year, month + 1, 1));
                    setSelectedDate(nextMonthDate);
                  }}
                  className="h-11 sm:h-13 rounded-2xl text-xs sm:text-sm text-slate-600 hover:text-slate-400 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {dayNum}
                </button>
              );
            });
          })()}
        </div>

        {/* Selected Date Footer */}
        <div className="mt-6 pt-5 border-t border-sky-500/15 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Selected Date</span>
          <span className="font-semibold text-sky-300 text-sm">
            {formattedSelectedDate}
          </span>
        </div>
      </div>
    </div>
  );
};
