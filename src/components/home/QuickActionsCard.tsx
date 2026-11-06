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
    sound.playAction()
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
    <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#111827] tracking-tight">Quick Actions</h3>
        {inspiration && (
          <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            Inspiring Tip
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2.5 xs:gap-3 py-2">
        {/* 1. Focus */}
        <button
          type="button"
          onClick={handleFocusClick}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-100/60 transition-all duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-orange-500/20 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#18181B] mt-1.5">Focus</span>
        </button>

        {/* 2. Plan */}
        <button
          type="button"
          onClick={handlePlanClick}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-100/60 transition-all duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#18181B] mt-1.5">Plan</span>
        </button>

        {/* 3. Add Task */}
        <button
          type="button"
          onClick={handleAddTaskClick}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100/60 transition-all duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
            <PlusSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#18181B] mt-1.5">Add Task</span>
        </button>

        {/* 4. Inspire */}
        <button
          type="button"
          onClick={handleInspireClick}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100/60 transition-all duration-150 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-[#18181B] mt-1.5">Inspire</span>
        </button>
      </div>

      {/* Floating Inspirational Quote Popup */}
      <AnimatePresence>
        {inspiration && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 p-2.5 bg-neutral-900 text-white text-xs font-medium rounded-xl text-center shadow-lg"
          >
            "{inspiration}"
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
