export type Category = 'Health' | 'Work' | 'Learning' | 'Personal' | 'Other';

export interface Habit {
  id: string;
  name: string;
  category: Category;
  color: string; // TailWind color class or hex
  createdAt: string; // ISO date string
  completedDates: string[]; // Array of YYYY-MM-DD strings
}

export type HabitInput = Omit<Habit, 'id' | 'createdAt' | 'completedDates'>;
