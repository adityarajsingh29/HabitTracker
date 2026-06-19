import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HabitInput, Category } from '../../types';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: HabitInput) => void;
}

const CATEGORIES: Category[] = ['Health', 'Work', 'Learning', 'Personal', 'Other'];
const COLORS = [
  'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'
];

export function CreateHabitModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Health');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({ name, category, color });
    setName('');
    setCategory('Health');
    setColor(COLORS[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="glass rounded-2xl p-6 shadow-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">New Habit</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Habit Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Read 10 pages"
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm transition-all",
                          category === c 
                            ? "bg-white/10 text-white border border-white/20" 
                            : "bg-surface/50 text-gray-400 border border-transparent hover:bg-white/5"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme Color</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all",
                          c,
                          color === c ? "ring-2 ring-white ring-offset-2 ring-offset-surface scale-110" : "opacity-50 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Habit
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
