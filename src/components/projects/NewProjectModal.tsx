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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-black/[0.08] shadow-2xl p-4 sm:p-6 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Create New Project</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Group and organize related tasks into a structured project
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
            {/* 1. Project Name */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website Redesign, Machine Learning..."
                autoFocus
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* 2. Description */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary or goals for this project..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* 3. Icon Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
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
                      onClick={() => {
                        sound.playClick()
                        setIcon(item.id)
                      }}
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center border transition-all',
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs scale-105'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
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
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center space-x-2.5">
                {COLOR_OPTIONS.map((item) => {
                  const isSelected = color === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setColor(item.id)
                      }}
                      className={cn(
                        'w-6 h-6 rounded-full transition-all flex items-center justify-center',
                        item.bg,
                        isSelected ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
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
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Project['status'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  <span>Target Date</span>
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Due Nov 25"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-black/[0.05]">
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
