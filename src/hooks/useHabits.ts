import { useState, useEffect } from 'react';
import type { Habit, HabitInput } from '../types';
import { formatDateString } from '../lib/dateUtils';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (input: HabitInput) => {
    const newHabit: Habit = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleCompletion = (habitId: string, date: Date) => {
    const dateStr = formatDateString(date);
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(dateStr);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr],
        };
      }
      return habit;
    }));
  };

  const getStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates].sort((a, b) => b.localeCompare(a));
    let streak = 0;
    
    let currentCheckDate = new Date();
    let currentCheckStr = formatDateString(currentCheckDate);
    
    if (!sortedDates.includes(currentCheckStr)) {
       // Check yesterday
       currentCheckDate = new Date(currentCheckDate.getTime() - 86400000);
       currentCheckStr = formatDateString(currentCheckDate);
       if (!sortedDates.includes(currentCheckStr)) {
           return 0;
       }
    }

    while (sortedDates.includes(currentCheckStr)) {
        streak++;
        currentCheckDate = new Date(currentCheckDate.getTime() - 86400000);
        currentCheckStr = formatDateString(currentCheckDate);
    }
    
    return streak;
  };

  const getLongestStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    // Sort dates descending
    const sortedDates = [...habit.completedDates].sort((a, b) => b.localeCompare(a));
    
    let maxStreak = 0;
    let currentStreak = 1;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentStr = sortedDates[i];
      const nextStr = sortedDates[i + 1];
      
      const currentDate = new Date(currentStr + 'T00:00:00');
      const nextDate = new Date(nextStr + 'T00:00:00');
      
      const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
      const diffDays = Math.round(diffTime / 86400000); 
      
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        currentStreak = 1;
      }
    }
    
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    
    return maxStreak;
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleCompletion,
    getStreak,
    getLongestStreak,
  };
}
