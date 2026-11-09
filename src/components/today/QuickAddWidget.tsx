import { useState, type FormEvent } from 'react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { addTask } from '@/db/taskService'
import { getTodayFormattedDate } from '@/lib/date'

export function QuickAddWidget() {
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const showToast = useUIStore((s) => s.showToast)
  const [quickTitle, setQuickTitle] = useState('')

  const handleQuickSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim()) return

    await addTask({
      title: quickTitle.trim(),
      category: 'Study',
      dueDate: getTodayFormattedDate(),
      estimatedTime: '30 min',
    })
    setQuickTitle('')
    showToast('Task added for Today', 'success')
  }

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Quick Add</h3>
        <button
          type="button"
          onClick={() => setAddTaskModalOpen(true)}
          className="text-xs font-medium text-neutral-500 hover:text-black dark:text-zinc-400 dark:hover:text-white cursor-pointer transition-colors"
        >
          Full options
        </button>
      </div>

      <form onSubmit={handleQuickSubmit} className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="What needs to be done today?"
            className="w-full pl-3.5 pr-14 py-2.5 text-xs font-medium rounded-xl border border-neutral-200 dark:border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] placeholder:text-neutral-400 dark:placeholder:text-zinc-500 transition-all"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] rounded-lg text-xs font-semibold disabled:opacity-30 transition-opacity cursor-pointer"
          >
            Add
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAddTaskModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-neutral-200/70 dark:border-white/[0.08] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] transition-colors cursor-pointer text-center"
        >
          Detailed task creation
        </button>
      </form>
    </Card>
  )
}
