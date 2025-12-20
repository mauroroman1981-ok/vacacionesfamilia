// Fix date-fns import issues by using sub-module paths where named exports from root might fail
import React from 'react';
import { format, addMonths, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import { es } from 'date-fns/locale/es';
import { Plane, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  targetDate: Date;
}

const CalendarView: React.FC<Props> = ({ targetDate }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  return (
    <div className="glass rounded-[2rem] p-6 text-white w-full max-w-md shadow-2xl self-start">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-cyan-300" />
          <h4 className="text-lg font-bold capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h4>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold opacity-40 py-2">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          const isTarget = isSameDay(day, targetDate);
          const isTodayDay = isToday(day);
          
          return (
            <div 
              key={i} 
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm relative group cursor-default
                ${isTarget ? 'bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/50' : ''}
                ${isTodayDay && !isTarget ? 'border border-white/50 font-bold' : 'hover:bg-white/5'}
              `}
            >
              {format(day, 'd')}
              {isTarget && (
                <Plane size={12} className="absolute -top-1 -right-1 text-white animate-bounce" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Plane className="text-cyan-300 rotate-45" size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-tighter opacity-60">Gran salida:</p>
          <p className="text-sm font-bold">11 de Enero, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
