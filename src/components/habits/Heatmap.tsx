import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateCalendarGrid, formatDateString } from '../../lib/dateUtils';
import type { Habit } from '../../types';
import { cn } from '../../lib/utils';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeatmapProps {
  habit: Habit;
  onToggle: (date: Date) => void;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function Heatmap({ habit, onToggle }: HeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const days = generateCalendarGrid(currentMonth);

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  return (
    <div className="flex flex-col w-full mt-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((day, i) => {
          const dateStr = formatDateString(day);
          const isCompleted = habit.completedDates.includes(dateStr);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <motion.div
              key={dateStr}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.005 }}
              className="cursor-pointer aspect-square flex items-center justify-center"
              title={`${format(day, 'MMM d, yyyy')} - ${isCompleted ? 'Completed' : 'Missed'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(day);
              }}
            >
              <div 
                className={cn(
                  "w-full h-full rounded-md transition-all duration-300 flex items-center justify-center text-xs font-medium",
                  isCompleted 
                    ? `${habit.color} shadow-[0_0_10px_rgba(255,255,255,0.15)] text-white/90` 
                    : isCurrentMonth ? "bg-surface-hover text-gray-500" : "bg-surface-hover/30 text-gray-600/50",
                  "hover:scale-105 hover:ring-2 hover:ring-white/30"
                )}
              >
                {format(day, 'd')}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
