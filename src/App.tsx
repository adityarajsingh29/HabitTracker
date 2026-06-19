import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from './hooks/useHabits';
import { HabitCard } from './components/habits/HabitCard';
import { CreateHabitModal } from './components/habits/CreateHabitModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

const ITEMS_PER_PAGE = 4;

function App() {
  const { habits, addHabit, deleteHabit, toggleCompletion, getStreak, getLongestStreak } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(habits.length / ITEMS_PER_PAGE));
  const currentHabits = habits.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
        
        {/* Hero Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight mb-4 drop-shadow-sm">
              Habit Streak
            </h1>
            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
              Build consistency through visual progress. Track your daily routines and watch your streaks grow with beautiful, github-style heatmaps.
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            New Habit
          </button>
        </motion.header>

        {habits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="glass inline-block p-10 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-3xl font-bold text-white mb-3">Your canvas is empty</h3>
              <p className="text-gray-400 mb-8 text-lg">Start your journey by creating your first habit.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary hover:text-white transition-colors underline underline-offset-8 text-lg font-medium"
              >
                Create one now
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {currentHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.3 }}
                  >
                    <HabitCard
                      habit={habit}
                      streak={getStreak(habit)}
                      longestStreak={getLongestStreak(habit)}
                      onToggle={(date) => toggleCompletion(habit.id, date)}
                      onDelete={(id) => {
                        deleteHabit(id);
                        if (currentHabits.length === 1 && currentPage > 1) {
                          setCurrentPage(p => p - 1);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4 mt-12"
              >
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="text-white" />
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        currentPage === i + 1 ? "bg-white w-8" : "bg-white/20 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="text-white" />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(habit) => {
          addHabit(habit);
          // If the last page is full, adding a new habit pushes it to a new page, so we could navigate there.
          const newTotalPages = Math.ceil((habits.length + 1) / ITEMS_PER_PAGE);
          setCurrentPage(newTotalPages);
        }}
      />
    </div>
  );
}

export default App;
