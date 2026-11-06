import { useState, useMemo, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { List, LayoutGrid, Calendar, Clock, Star, Pencil, Trash2 } from 'lucide-react'
import { db, type Task } from '@/db/db'
import { Card } from '@/components/common/Card'
import { Checkbox } from '@/components/common/Checkbox'
import { Badge } from '@/components/common/Badge'
import { toggleTaskCompleted, toggleTaskStarred, deleteTask } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
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
    const list = allTasks.filter((t) => {
      if (taskFilter === 'all') return true
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
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (taskSort === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
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
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
        <h2 className="text-lg font-bold text-[#111827] tracking-tight">
          Tasks ({filtered.length})
        </h2>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 p-0.5 bg-neutral-100 rounded-lg border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            title="List View"
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-white shadow-2xs text-[#18181B]'
                : 'text-neutral-400 hover:text-neutral-700'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-white shadow-2xs text-[#18181B]'
                : 'text-neutral-400 hover:text-neutral-700'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div
        className={cn(
          'pt-2',
          viewMode === 'list'
            ? 'flex flex-col divide-y divide-black/[0.03]'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3'
        )}
      >
        {filtered.map((task: Task) => {
          const isDone = task.completed === 1

          return (
            <div
              key={task.id}
              className={cn(
                'group flex items-center justify-between py-3 px-2 rounded-xl hover:bg-neutral-50/80 transition-all select-none',
                viewMode === 'grid' && 'border border-black/[0.06] p-4 flex-col items-start space-y-3'
              )}
            >
              {/* Left Side: Checkbox & Info */}
              <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-3">
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
                        ? 'text-[#6B7280] line-through decoration-neutral-400'
                        : 'text-[#111827] hover:text-neutral-900'
                    )}
                  >
                    {task.title}
                  </div>

                  {/* Subline: Date & Duration */}
                  <div className="flex items-center space-x-3 text-[11px] font-medium text-[#6B7280] mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{task.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{task.estimatedTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Badge & Actions (Edit, Delete, Star) */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
                <Badge category={task.category} className="hidden xs:inline-flex" />

                {/* Edit Task */}
                <button
                  type="button"
                  onClick={() => openEditTaskModal(task)}
                  title="Edit Task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4 stroke-[1.8]" />
                </button>

                {/* Delete Task (Confirmation Modal) */}
                <button
                  type="button"
                  onClick={() => handleDelete(task)}
                  title="Delete Task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                </button>

                {/* Star Button */}
                <button
                  type="button"
                  onClick={() => toggleTaskStarred(task.id, task.starred)}
                  title={task.starred ? 'Starred' : 'Star this task'}
                  className="p-1.5 rounded-lg transition-colors"
                >
                  <Star
                    className={cn(
                      'w-4 h-4 transition-colors',
                      task.starred
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-neutral-300 hover:text-neutral-500'
                    )}
                  />
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#9CA3AF]">
            No tasks found in this view.
          </div>
        )}
      </div>
    </Card>
  )
}
