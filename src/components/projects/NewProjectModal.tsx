import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Laptop, Code, Palette, BookOpen, Target, Calendar } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { addProject } from '@/db/taskService'
import type { Project } from '@/db/db'
import { Button } from '@/components/common/Button'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const ICON_OPTIONS: Array<{ id: Project['icon']; label: string; icon: typeof Laptop }> = [
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'palette', label: 'Design', icon: Palette },
  { id: 'book', label: 'Study', icon: BookOpen },
  { id: 'target', label: 'Goal', icon: Target },
]

const COLOR_OPTIONS = [
  { id: '#2563EB', label: 'Blue', bg: 'bg-blue-600' },
  { id: '#7C3AED', label: 'Purple', bg: 'bg-purple-600' },
  { id: '#D97706', label: 'Amber', bg: 'bg-amber-600' },
  { id: '#059669', label: 'Emerald', bg: 'bg-emerald-600' },
  { id: '#EA580C', label: 'Orange', bg: 'bg-orange-600' },
  { id: '#E11D48', label: 'Rose', bg: 'bg-rose-600' },
]

export function NewProjectModal() {
  const isNewProjectModalOpen = useUIStore((s) => s.isNewProjectModalOpen)
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const showToast = useUIStore((s) => s.showToast)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<Project['icon']>('laptop')
  const [color, setColor] = useState('#2563EB')
  const [status, setStatus] = useState<Project['status']>('active')
  const [dueDate, setDueDate] = useState('')

  if (!isNewProjectModalOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await addProject({
      name: name.trim(),
      description: description.trim() || 'Organize project tasks and milestones',
      icon,
      color,
      status,
      dueDate: dueDate.trim() || 'No due date',
    })

    showToast(`Project "${name}" created`, 'success')
    setName('')
    setDescription('')
    setDueDate('')
    setNewProjectModalOpen(false)
  }

  const handleClose = () => {
    sound.playClose()
    setNewProjectModalOpen(false)
  }

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-[#18181B] rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-4 sm:p-6 z-10 max-h-[90vh] overflow-y-auto text-[#111827] dark:text-[#F4F4F5]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
            <div>
              <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5]">Create New Project</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">
                Group and organize related tasks into a structured project
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* 1. Project Name */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website Redesign, Machine Learning..."
                autoFocus
                required
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
              />
            </div>

            {/* 2. Description */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary or goals for this project..."
                className="w-full px-4 py-2.5 text-xs font-medium rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500 resize-none"
              />
            </div>

            {/* 3. Icon Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                Project Icon
              </label>
              <div className="flex items-center space-x-2">
                {ICON_OPTIONS.map((item) => {
                  const Icon = item.icon
                  const isSelected = icon === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIcon(item.id)}
                      className={cn(
                        'w-10 h-10 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-all cursor-pointer',
                        isSelected
                          ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] shadow-xs scale-105'
                          : 'border-neutral-200 dark:border-white/[0.1] text-neutral-600 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-800'
                      )}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Color Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center space-x-3">
                {COLOR_OPTIONS.map((item) => {
                  const isSelected = color === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setColor(item.id)}
                      className={cn(
                        'w-7 h-7 rounded-xl transition-all flex items-center justify-center cursor-pointer',
                        item.bg,
                        isSelected ? 'ring-2 ring-neutral-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-900 scale-110 shadow-2xs' : 'opacity-80 hover:opacity-100'
                      )}
                      title={item.label}
                    />
                  )
                })}
              </div>
            </div>

            {/* 5. Status & Due Date */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Project['status'])}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-neutral-500 dark:text-zinc-400" />
                  <span>Target Date</span>
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Due Nov 25"
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="px-5">
                Create Project
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
