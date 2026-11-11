import { useEffect, useState, useMemo } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Circle, Plus, Home, BarChart2, Folder } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Task } from '@/db/db'
import { toggleTaskCompleted } from '@/db/taskService'
import { useUIStore, type NavTabId } from '@/stores/uiStore'
import { searchTasksFuzzy } from '@/lib/search'
import { Badge } from '@/components/common/Badge'

export function CommandPalette() {
  const isCommandPaletteOpen = useUIStore((s) => s.isCommandPaletteOpen)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const [search, setSearch] = useState('')

  // Query tasks only when palette is open
  const allTasks = useLiveQuery<Task[]>(
    () => (isCommandPaletteOpen ? db.tasks.toArray() : Promise.resolve<Task[]>([])),
    [isCommandPaletteOpen]
  ) || []

  const filteredTasks = useMemo(() => {
    if (!isCommandPaletteOpen) return []
    return searchTasksFuzzy(search, allTasks)
  }, [search, allTasks, isCommandPaletteOpen])

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setSearch('')
    }
  }, [isCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  const handleSelectNav = (tab: NavTabId) => {
    setActiveTab(tab)
    setCommandPaletteOpen(false)
  }

  const handleSelectNewTask = () => {
    setCommandPaletteOpen(false)
    setAddTaskModalOpen(true)
  }

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-24 p-3 sm:p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs"
        />

        {/* Command Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -6 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#18181B] rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden z-10 text-[#111827] dark:text-[#F4F4F5]"
        >
          <Command label="Global Command Menu" className="w-full">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <Search className="w-4 h-4 text-neutral-400 dark:text-zinc-500 mr-3 shrink-0" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search tasks, jump to tabs, or press 'N' for new task..."
                className="w-full py-3.5 text-sm font-medium text-[#111827] dark:text-[#F4F4F5] placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none bg-transparent"
              />
              <span className="text-[10px] font-semibold text-neutral-400 dark:text-zinc-400 bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-zinc-700">
                ESC
              </span>
            </div>

            {/* Results List */}
            <Command.List className="max-h-80 overflow-y-auto p-2 divide-y divide-black/[0.03] dark:divide-white/[0.06]">
              <Command.Empty className="py-8 text-center text-xs text-neutral-400 dark:text-zinc-500">
                No matching tasks or commands found.
              </Command.Empty>

              {/* Tasks Group */}
              {filteredTasks.length > 0 && (
                <Command.Group heading="Tasks" className="py-1 text-[11px] font-bold text-neutral-400 dark:text-zinc-500 px-2">
                  {filteredTasks.map((task) => (
                    <Command.Item
                      key={task.id}
                      onSelect={() => {
                        toggleTaskCompleted(task.id, task.completed)
                        setCommandPaletteOpen(false)
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#111827] dark:text-[#F4F4F5] hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        {task.completed === 1 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                        )}
                        <span className={task.completed === 1 ? 'line-through text-neutral-400 dark:text-zinc-500' : ''}>
                          {task.title}
                        </span>
                      </div>
                      <Badge category={task.category} />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Quick Actions Group */}
              <Command.Group heading="Actions" className="py-1 text-[11px] font-bold text-neutral-400 dark:text-zinc-500 px-2">
                <Command.Item
                  onSelect={handleSelectNewTask}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-[#111827] dark:text-[#F4F4F5] hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
                  <span>Create New Task</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelectNav('home')}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-[#111827] dark:text-[#F4F4F5] hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
                  <span>Go to Home</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelectNav('projects')}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-[#111827] dark:text-[#F4F4F5] hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 cursor-pointer"
                >
                  <Folder className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
                  <span>View Projects</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => handleSelectNav('stats')}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-[#111827] dark:text-[#F4F4F5] hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
                  <span>View Stats</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
