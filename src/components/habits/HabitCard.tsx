import { motion } from 'framer-motion';
import type { Habit } from '../../types';
import { Heatmap } from './Heatmap';
import { Flame, Trophy, Trash2 } from 'lucide-react';
import { getRollingDays, formatDateString } from '../../lib/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (date: Date) => void;
  onDelete: (id: string) => void;
  streak: number;
  longestStreak: number;
}

export function HabitCard({ habit, onToggle, onDelete, streak, longestStreak }: HabitCardProps) {
  const days = getRollingDays(30);
  const completedIn30Days = days.filter(d => habit.completedDates.includes(formatDateString(d))).length;
  const completionPercentage = Math.round((completedIn30Days / 30) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="glass rounded-3xl p-8 md:p-10 relative group overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 w-full h-1 opacity-50" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{habit.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-surface-hover text-gray-300 font-medium">
            {habit.category}
          </span>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm text-gray-400">30-day</span>
            <span className="text-lg font-semibold text-white">{completionPercentage}%</span>
          </div>
          
          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20" title="Longest Streak">
            <Trophy size={16} />
            <span className="font-bold">{longestStreak}</span>
          </div>

          <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full border border-orange-500/20" title="Current Streak">
            <Flame size={16} className={streak > 0 ? "animate-pulse" : ""} />
            <span className="font-bold">{streak}</span>
          </div>
          
          <button 
            onClick={() => onDelete(habit.id)}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
            title="Delete Habit"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <Heatmap habit={habit} onToggle={onToggle} />
      </div>
      
      {/* Background glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
}
