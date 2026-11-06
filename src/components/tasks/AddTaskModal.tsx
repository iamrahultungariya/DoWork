import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flag, Folder } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useUIStore } from '@/stores/uiStore'
import { addTask, updateTask } from '@/db/taskService'
import { db, type TaskCategory } from '@/db/db'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { CustomDatePicker } from '@/components/common/CustomDatePicker'
import { CustomTimePicker } from '@/components/common/CustomTimePicker'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const DEFAULT_CATEGORIES: TaskCategory[] = ['Study', 'Project', 'Exam', 'Design', 'Learning', 'Personal']

const getInitialFormattedDate = () => {
  const d = new Date()
  const monthShort = d.toLocaleString('en-US', { month: 'short' })
  return `${d.getDate()} ${monthShort} ${d.getFullYear()}`
}

export function AddTaskModal() {
  // Performance-optimized atomic selectors
  const isAddTaskModalOpen = useUIStore((s) => s.isAddTaskModalOpen)
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const editingTask = useUIStore((s) => s.editingTask)
  const closeEditTaskModal = useUIStore((s) => s.closeEditTaskModal)
  const showToast = useUIStore((s) => s.showToast)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>('Study')
  const [priority, setPriority] = useState<'normal' | 'medium' | 'high'>('normal')
  const [dueDate, setDueDate] = useState(getInitialFormattedDate())
  const [estimatedTime, setEstimatedTime] = useState('10:00:00 AM')

  // Query custom project names from Dexie DB
  const projects = useLiveQuery(() => db.projects.toArray(), []) || []
  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...projects.map((p) => p.name)])
  )

  const isEditing = Boolean(editingTask)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setCategory(editingTask.category)
      setPriority(editingTask.flagged ? 'high' : 'normal')
      setDueDate(editingTask.dueDate || getInitialFormattedDate())
      setEstimatedTime(editingTask.estimatedTime || '10:00:00 AM')
    } else {
      setTitle('')
      setCategory('Study')
      setPriority('normal')
      setDueDate(getInitialFormattedDate())
      setEstimatedTime('10:00:00 AM')
    }
  }, [editingTask, isAddTaskModalOpen])

  if (!isAddTaskModalOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const isFlagged = priority === 'high' || priority === 'medium'

    if (isEditing && editingTask) {
      await updateTask(editingTask.id, {
        title: title.trim(),
        category,
        flagged: isFlagged,
        dueDate,
        estimatedTime,
      })
      showToast('Task updated successfully', 'success')
      closeEditTaskModal()
    } else {
      await addTask({
        title: title.trim(),
        category,
        flagged: isFlagged,
        dueDate,
        estimatedTime,
      })
      showToast('New task created', 'success')
      setAddTaskModalOpen(false)
    }
  }

  const handleClose = () => {
    sound.playClose()
    if (isEditing) {
      closeEditTaskModal()
    } else {
      setAddTaskModalOpen(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-2xl border border-black/[0.08] shadow-2xl p-4 sm:p-6 z-10 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isEditing ? 'Update task details and preferences' : 'Configure custom date, time and priority'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* 1. Title Input */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Unit practice or Revise Notes..."
                autoFocus
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* 2. Custom Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 flex items-center space-x-1.5">
                <Folder className="w-3.5 h-3.5 text-neutral-500" />
                <span>Category / Project</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                  const isSelected = category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setCategory(cat)
                      }}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      <Badge
                        category={cat}
                        className={cn(
                          'cursor-pointer transition-all px-2.5 py-1',
                          isSelected
                            ? 'ring-2 ring-neutral-900 ring-offset-1 font-bold shadow-2xs scale-105'
                            : 'opacity-70 hover:opacity-100'
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Custom Priority Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 flex items-center space-x-1.5">
                <Flag className="w-3.5 h-3.5 text-neutral-500" />
                <span>Priority Level</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 bg-neutral-100/80 rounded-xl border border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick()
                    setPriority('normal')
                  }}
                  className={cn(
                    'flex items-center justify-center space-x-1 sm:space-x-1.5 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all',
                    priority === 'normal'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span>Normal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick()
                    setPriority('medium')
                  }}
                  className={cn(
                    'flex items-center justify-center space-x-1 sm:space-x-1.5 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all',
                    priority === 'medium'
                      ? 'bg-white text-amber-700 shadow-2xs ring-1 ring-amber-200'
                      : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Medium</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick()
                    setPriority('high')
                  }}
                  className={cn(
                    'flex items-center justify-center space-x-1 sm:space-x-1.5 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all',
                    priority === 'high'
                      ? 'bg-white text-rose-700 shadow-2xs ring-1 ring-rose-200'
                      : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>High<span className="hidden xs:inline"> (Urgent)</span></span>
                </button>
              </div>
            </div>

            {/* 4. Fully Custom Designed Calendar Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Due Date
              </label>
              <CustomDatePicker value={dueDate} onChange={setDueDate} />
            </div>

            {/* 5. Custom Designed Time Picker (hh:mm:ss am/pm) */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Estimated / Scheduled Time
              </label>
              <CustomTimePicker value={estimatedTime} onChange={setEstimatedTime} />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-black/[0.05]">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="px-5">
                {isEditing ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
