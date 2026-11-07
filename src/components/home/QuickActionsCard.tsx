import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Calendar, PlusSquare, Sparkles } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { sound } from '@/lib/sound'

const INSPIRATIONAL_QUOTES = [
  'Focus on being productive instead of busy.',
  'Small daily improvements over time lead to stunning results.',
  'Done is better than perfect. Keep moving forward.',
  'Your future is created by what you do today, not tomorrow.',
  'Discipline is choosing between what you want now and what you want most.',
]

export function QuickActionsCard() {
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const [inspiration, setInspiration] = useState<string | null>(null)

  const handleFocusClick = () => {
    sound.playAction()
    setActiveTab('today')
    useUIStore.getState().startFocusTimer()
  }

  const handlePlanClick = () => {
    setActiveTab('today')
  }

  const handleAddTaskClick = () => {
    sound.playOpen()
    setAddTaskModalOpen(true)
  }

  const handleInspireClick = () => {
    sound.playAction()
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
    setInspiration(INSPIRATIONAL_QUOTES[randomIndex])
    setTimeout(() => setInspiration(null), 4500)
  }

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Quick Actions</h3>
        {inspiration && (
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-800/50">
            Inspiring Tip
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2.5 xs:gap-3 py-2">
        {/* 1. Focus */}
        <button
          type="button"
          onClick={handleFocusClick}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl sm:rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40 border border-orange-100/60 dark:border-orange-800/40 transition-all duration-150 group cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-orange-500 dark:text-orange-400 group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-orange-500/20 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mt-1.5">Focus</span>
        </button>

        {/* 2. Plan */}
        <button
          type="button"
          onClick={handlePlanClick}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl sm:rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 border border-blue-100/60 dark:border-blue-800/40 transition-all duration-150 group cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mt-1.5">Plan</span>
        </button>

        {/* 3. Add Task */}
        <button
          type="button"
          onClick={handleAddTaskClick}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 border border-emerald-100/60 dark:border-emerald-800/40 transition-all duration-150 group cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <PlusSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mt-1.5">Add Task</span>
        </button>

        {/* 4. Inspire */}
        <button
          type="button"
          onClick={handleInspireClick}
          className="flex flex-col items-center justify-center p-3.5 rounded-xl sm:rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100/80 dark:hover:bg-purple-900/40 border border-purple-100/60 dark:border-purple-800/40 transition-all duration-150 group cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] mt-1.5">Inspire</span>
        </button>
      </div>

      {/* Dynamic Motivational Quote Display */}
      <AnimatePresence>
        {inspiration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 text-xs font-medium text-neutral-600 dark:text-zinc-400 italic border-t border-black/[0.04] dark:border-white/[0.08]"
          >
            &ldquo;{inspiration}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
