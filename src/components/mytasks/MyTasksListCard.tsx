import { useState, useMemo, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { List, LayoutGrid, Clock, Star, Pencil, Trash2 } from 'lucide-react'
import { db, type Task } from '@/db/db'
import { Card } from '@/components/common/Card'
import { Checkbox } from '@/components/common/Checkbox'
import { Badge } from '@/components/common/Badge'
import { toggleTaskCompleted, toggleTaskStarred, deleteTask } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
import {
  getTaskDateStatus,
  isTaskOverdue,
  isTaskStrictlyToday,
  toCalendarDateString,
  parseTaskDueDate,
} from '@/lib/date'
import { cn } from '@/lib/utils'

export function MyTasksListCard() {
  const taskFilter = useUIStore((s) => s.taskFilter)
  const taskSort = useUIStore((s) => s.taskSort)
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const allTasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  // Memoized filter and sort tasks
  const filtered = useMemo(() => {
    const todayStr = toCalendarDateString(new Date())

    const list = allTasks.filter((t) => {
      if (taskFilter === 'all') return true
      if (taskFilter === 'today') {
        if (isTaskStrictlyToday(t.dueDate, t.createdAt)) return true
        if (t.completed === 1 && t.completedAt && toCalendarDateString(new Date(t.completedAt)) === todayStr) {
          return true
        }
        if (t.completed === 0 && isTaskOverdue(t.dueDate, t.createdAt, 0)) {
          return true
        }
        return false
      }
      if (taskFilter === 'overdue') {
        return isTaskOverdue(t.dueDate, t.createdAt, t.completed)
      }
      if (taskFilter === 'done') return t.completed === 1
      if (taskFilter === 'in_progress') return t.status === 'in_progress'
      if (taskFilter === 'todo') return t.completed === 0 && t.status !== 'in_progress'
      return true
    })

    return [...list].sort((a, b) => {
      if (taskSort === 'priority') {
        if (a.starred && !b.starred) return -1
        if (!a.starred && b.starred) return 1
        if (a.flagged && !b.flagged) return -1
        if (!a.flagged && b.flagged) return 1
        return a.order - b.order
      }
      if (taskSort === 'date') {
        const dateA = parseTaskDueDate(a.dueDate, a.createdAt)
        const dateB = parseTaskDueDate(b.dueDate, b.createdAt)
        if (!dateA && !dateB) return a.order - b.order
        if (!dateA) return 1
        if (!dateB) return -1
        const diff = dateA.getTime() - dateB.getTime()
        return diff !== 0 ? diff : a.order - b.order
      }
      if (taskSort === 'title') {
        return a.title.localeCompare(b.title)
      }
      return a.order - b.order
    })
  }, [allTasks, taskFilter, taskSort])

  const handleDelete = useCallback(
    (task: Task) => {
      requestConfirm({
        title: 'Delete Task?',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete Task',
        onConfirm: async () => {
          await deleteTask(task.id)
          showToast('Task deleted', 'info')
        },
      })
    },
    [requestConfirm, showToast]
  )

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl h-full">
      {/* Header with Title & View Toggles */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">
            Tasks ({filtered.length})
          </h2>
          {taskFilter === 'overdue' && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
              Tasks past their scheduled deadline requiring immediate attention
            </p>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 p-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-lg border border-black/[0.04] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            title="List View"
            aria-label="List view"
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer',
              viewMode === 'list'
                ? 'bg-white dark:bg-[#18181B] shadow-2xs text-[#18181B] dark:text-white'
                : 'text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            title="Grid View"
            aria-label="Grid view"
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer',
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#18181B] shadow-2xs text-[#18181B] dark:text-white'
                : 'text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div
        className={cn(
          'pt-2 flex-1',
          viewMode === 'list'
            ? 'flex flex-col divide-y divide-black/[0.03] dark:divide-white/[0.06]'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3'
        )}
      >
        {filtered.map((task: Task) => {
          const isDone = task.completed === 1
          const dateStatus = getTaskDateStatus(task.dueDate, task.createdAt, isDone)
          const isOverdue = !isDone && dateStatus.category === 'overdue'

          return (
            <div
              key={task.id}
              className={cn(
                'group flex items-center justify-between py-3 px-2 rounded-xl hover:bg-neutral-50/80 dark:hover:bg-zinc-800/50 transition-all select-none',
                isOverdue && 'bg-red-500/[0.02] dark:bg-red-500/[0.04]',
                viewMode === 'grid' && 'border border-black/[0.06] dark:border-white/[0.08] p-4 flex-col items-start space-y-3'
              )}
            >
              {/* Left Side: Checkbox & Info */}
              <div
                className={cn(
                  'flex items-center space-x-3.5 flex-1 min-w-0',
                  viewMode === 'grid' ? 'w-full' : 'mr-3'
                )}
              >
                <Checkbox
                  checked={isDone}
                  onChange={() => toggleTaskCompleted(task.id, task.completed)}
                  ariaLabel={`Toggle ${task.title}`}
                />

                <div className="min-w-0 flex-1">
                  <div
                    onClick={() => toggleTaskCompleted(task.id, task.completed)}
                    className={cn(
                      'text-sm font-medium transition-all truncate cursor-pointer',
                      isDone
                        ? 'text-[#6B7280] dark:text-zinc-500 line-through decoration-neutral-400 dark:decoration-zinc-600'
                        : 'text-[#111827] dark:text-[#F4F4F5] hover:text-neutral-900 dark:hover:text-white'
                    )}
                  >
                    {task.title}
                  </div>

                  {/* Subline: Date Status & Duration */}
                  <div className="flex items-center space-x-2.5 text-[11px] font-medium text-[#6B7280] dark:text-[#A1A1AA] mt-1">
                    {isOverdue ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {dateStatus.label}
                      </span>
                    ) : (
                      <span>{dateStatus.label || task.dueDate}</span>
                    )}

                    <span>·</span>
                    <span className="flex items-center space-x-1 tabular-nums">
                      <Clock className="w-3 h-3 text-neutral-400 dark:text-zinc-500" />
                      <span>{task.estimatedTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side / Bottom: Badge & Actions (Edit, Delete, Star) */}
              <div
                className={cn(
                  'flex items-center space-x-1 sm:space-x-1.5 shrink-0',
                  viewMode === 'grid' && 'w-full justify-between pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] mt-1'
                )}
              >
                <Badge category={task.category} className={viewMode === 'grid' ? 'inline-flex' : 'hidden xs:inline-flex'} />

                <div className="flex items-center space-x-1">
                  {/* Edit Task */}
                  <button
                    type="button"
                    onClick={() => openEditTaskModal(task)}
                    title="Edit task"
                    aria-label={`Edit ${task.title}`}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-zinc-200 rounded-lg transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Task */}
                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    title="Delete task"
                    aria-label={`Delete ${task.title}`}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Star Button */}
                  <button
                    type="button"
                    onClick={() => toggleTaskStarred(task.id, task.starred)}
                    title={task.starred ? 'Starred' : 'Star this task'}
                    aria-label={task.starred ? 'Remove star' : 'Star this task'}
                    className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Star
                      className={cn(
                        'w-3.5 h-3.5 transition-colors',
                        task.starred
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-neutral-300 dark:text-zinc-600 hover:text-neutral-500 dark:hover:text-zinc-400'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#9CA3AF] dark:text-zinc-500">
            {taskFilter === 'overdue'
              ? 'No overdue tasks found. All previous tasks are up to date.'
              : 'No tasks found in this view.'}
          </div>
        )}
      </div>
    </Card>
  )
}
