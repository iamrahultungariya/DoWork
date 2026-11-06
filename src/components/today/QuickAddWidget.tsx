import { useState, type FormEvent } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { addTask } from '@/db/taskService'

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
      dueDate: 'Today',
      estimatedTime: '30 min',
    })
    setQuickTitle('')
    showToast('Task added to Today', 'success')
  }

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#111827] tracking-tight">Quick Add</h3>
        <button
          type="button"
          onClick={() => setAddTaskModalOpen(true)}
          className="text-[11px] font-semibold text-neutral-500 hover:text-black flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>Full Modal</span>
        </button>
      </div>

      <form onSubmit={handleQuickSubmit} className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick task title..."
            className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-[#18181B] text-white rounded-lg flex items-center justify-center text-xs disabled:opacity-30 transition-opacity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAddTaskModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/[0.04] text-xs font-semibold text-[#18181B] transition-colors"
        >
          <CheckSquare className="w-3.5 h-3.5 text-neutral-600" />
          <span>New Detailed Task</span>
        </button>
      </form>
    </Card>
  )
}
