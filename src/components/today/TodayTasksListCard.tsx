import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Pencil, Trash2 } from 'lucide-react'
import { db, type Task } from '@/db/db'
import { Card } from '@/components/common/Card'
import { Checkbox } from '@/components/common/Checkbox'
import { Badge } from '@/components/common/Badge'
import { toggleTaskCompleted, deleteTask } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
import { getTaskDateStatus, isTaskOverdue, isTaskStrictlyToday } from '@/lib/date'
import { cn } from '@/lib/utils'

type TodayFilterTab = 'all_today' | 'today_only' | 'overdue'

export function TodayTasksListCard() {
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const [filterTab, setFilterTab] = useState<TodayFilterTab>('all_today')

  const allTasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), []) || []

  // Categorize tasks by due date
  const { overdueTasks, todayTasks, displayTasks } = useMemo(() => {
    const overdue = allTasks.filter((t) => isTaskOverdue(t.dueDate, t.createdAt, t.completed))
    const today = allTasks.filter((t) => {
      if (isTaskStrictlyToday(t.dueDate, t.createdAt)) return true
      // Also include tasks completed today
      if (t.completed === 1) {
        const status = getTaskDateStatus(t.dueDate, t.createdAt, true)
        return status.category === 'today'
      }
      return false
    })

    let filtered: Task[] = []
    if (filterTab === 'all_today') {
      // Overdue carryovers first, then today's tasks
      filtered = [...overdue, ...today]
    } else if (filterTab === 'today_only') {
      filtered = today
    } else if (filterTab === 'overdue') {
      filtered = overdue
    }

    return {
      overdueTasks: overdue,
      todayTasks: today,
      displayTasks: filtered,
    }
  }, [allTasks, filterTab])

  const handleDelete = (task: Task) => {
    requestConfirm({
      title: 'Delete Task?',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Task',
      onConfirm: async () => {
        await deleteTask(task.id)
        showToast('Task deleted', 'info')
      },
    })
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl h-full">
      {/* Header with Title and Segmented Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08] gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">
            Today's Agenda
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">
            <span className="tabular-nums font-medium">{todayTasks.length}</span> scheduled today
            {overdueTasks.length > 0 && (
              <>
                {' · '}
                <span className="text-red-600 dark:text-red-400 font-semibold tabular-nums">
                  {overdueTasks.length} overdue from past days
                </span>
              </>
            )}
          </p>
        </div>

        {/* Scope Pill Filter */}
        <div className="flex items-center space-x-1 p-1 bg-neutral-100 dark:bg-zinc-800 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterTab('all_today')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
              filterTab === 'all_today'
                ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            )}
          >
            All Work ({overdueTasks.length + todayTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('today_only')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
              filterTab === 'today_only'
                ? 'bg-white dark:bg-[#18181B] text-[#111827] dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            )}
          >
            Today ({todayTasks.length})
          </button>
          {overdueTasks.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab('overdue')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5',
                filterTab === 'overdue'
                  ? 'bg-red-500/15 text-red-700 dark:text-red-300 font-semibold shadow-2xs'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
              )}
            >
              <span>Overdue</span>
              <span className="tabular-nums px-1.5 py-0.2 rounded-md bg-red-500/20 text-[10px] font-bold">
                {overdueTasks.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Task Rows List */}
      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.06] pt-1 flex-1">
        {displayTasks.map((task) => {
          const isDone = task.completed === 1
          const dateStatus = getTaskDateStatus(task.dueDate, task.createdAt, isDone)
          const isOverdueItem = !isDone && dateStatus.category === 'overdue'

          return (
            <div
              key={task.id}
              className={cn(
                'flex items-center justify-between py-3 px-1 rounded-xl hover:bg-neutral-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-150 select-none group',
                isOverdueItem && 'bg-red-500/[0.02] dark:bg-red-500/[0.04]'
              )}
            >
              {/* Left: Checkbox & Task Details */}
              <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-2 sm:mr-3">
                <Checkbox
                  checked={isDone}
                  onChange={() => toggleTaskCompleted(task.id, task.completed)}
                  ariaLabel={`Toggle ${task.title}`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    onClick={() => toggleTaskCompleted(task.id, task.completed)}
                    className={cn(
                      'text-sm font-medium transition-all duration-150 truncate cursor-pointer',
                      isDone
                        ? 'text-[#6B7280] dark:text-zinc-500 line-through decoration-neutral-400 dark:decoration-zinc-600'
                        : 'text-[#111827] dark:text-[#F4F4F5] hover:text-neutral-900 dark:hover:text-white'
                    )}
                  >
                    {task.title}
                  </div>

                  {/* Date Status & Duration Subline */}
                  <div className="flex items-center space-x-2 text-[11px] font-medium text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">
                    {isOverdueItem ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {dateStatus.label}
                      </span>
                    ) : (
                      <span>{dateStatus.label || task.dueDate}</span>
                    )}
                    <span>·</span>
                    <span className="tabular-nums">{task.estimatedTime}</span>
                  </div>
                </div>
              </div>

              {/* Right: Category, Edit & Delete */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
                <Badge category={task.category} className="hidden xs:inline-flex" />

                <button
                  type="button"
                  onClick={() => openEditTaskModal(task)}
                  title="Edit task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                  aria-label={`Edit ${task.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(task)}
                  title="Delete task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                  aria-label={`Delete ${task.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}

        {displayTasks.length === 0 && (
          <div className="py-12 text-center text-xs text-[#9CA3AF] dark:text-zinc-500">
            {filterTab === 'overdue'
              ? 'No overdue tasks pending. Great work keeping on schedule!'
              : filterTab === 'today_only'
              ? 'No tasks scheduled specifically for today.'
              : 'No tasks scheduled for today. Add one using Quick Add.'}
          </div>
        )}
      </div>
    </Card>
  )
}
