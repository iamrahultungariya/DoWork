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
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Window with Fixed Header, Scrollable Middle, Fixed Footer */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#18181B] rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-4 sm:p-6 z-10 max-h-[88vh] flex flex-col overflow-hidden text-[#111827] dark:text-[#F4F4F5]"
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08] shrink-0">
            <div>
              <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5]">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">
                {isEditing ? 'Update task details and preferences' : 'Configure custom date, time and priority'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form with Scrollable Middle Body & Fixed Footer */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Scrollable Middle Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 sm:px-2.5 py-3 mt-1 space-y-4">
              {/* 1. Title Input */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Unit practice or Revise Notes..."
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* 2. Custom Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5 flex items-center space-x-1.5">
                  <Folder className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
                  <span>Category / Project</span>
                </label>
                <div className="flex flex-wrap gap-2 pt-0.5 pb-0.5">
                  {allCategories.map((cat) => {
                    const isSelected = category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                      >
                        <Badge
                          category={cat}
                          className={cn(
                            'cursor-pointer transition-all px-3 py-1.5 rounded-xl font-semibold',
                            isSelected
                              ? 'ring-2 ring-neutral-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-900 font-bold shadow-xs'
                              : 'opacity-70 hover:opacity-100'
                          )}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. Custom Priority Selector with High-Contrast Active States */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5 flex items-center space-x-1.5">
                  <Flag className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
                  <span>Priority Level</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-neutral-100/90 dark:bg-zinc-800/90 rounded-xl sm:rounded-2xl border border-black/[0.04] dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setPriority('normal')}
                    className={cn(
                      'flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                      priority === 'normal'
                        ? 'bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-xs ring-2 ring-neutral-900/20 dark:ring-white/40 font-bold'
                        : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-white'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-zinc-300" />
                    <span>Normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={cn(
                      'flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                      priority === 'medium'
                        ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shadow-xs ring-2 ring-amber-500/80 font-bold'
                        : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-white'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Medium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('high')}
                    className={cn(
                      'flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                      priority === 'high'
                        ? 'bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 shadow-xs ring-2 ring-rose-500/80 font-bold'
                        : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-white'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>High<span className="hidden xs:inline"> (Urgent)</span></span>
                  </button>
                </div>
              </div>

              {/* 4. Sleek Row Trigger Date Picker with Inline Accordion Calendar */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                  Due Date
                </label>
                <CustomDatePicker value={dueDate} onChange={setDueDate} />
              </div>

              {/* 5. Sleek Row Trigger Time Picker with Inline Stepper & Manual Entry */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                  Estimated / Scheduled Time
                </label>
                <CustomTimePicker value={estimatedTime} onChange={setEstimatedTime} />
              </div>
            </div>

            {/* Fixed Bottom Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3.5 border-t border-black/[0.05] dark:border-white/[0.08] shrink-0 bg-white dark:bg-[#18181B]">
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
