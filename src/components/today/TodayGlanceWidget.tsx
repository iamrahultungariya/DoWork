import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import {
  isTaskDueTodayOrOverdue,
  isTaskStrictlyToday,
  toCalendarDateString,
  parseEstimatedMinutes,
  formatMinutesToDisplay,
} from '@/lib/date'

export function TodayGlanceWidget() {
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  const todayStr = toCalendarDateString(new Date())

  // Tasks scheduled for today + overdue carryover
  const todayTasks = tasks.filter((t) => isTaskDueTodayOrOverdue(t.dueDate, t.createdAt, t.completed))

  // Completed today
  const completedTodayTasks = tasks.filter((t) => {
    if (t.completed !== 1) return false
    if (t.completedAt) {
      return toCalendarDateString(new Date(t.completedAt)) === todayStr
    }
    return isTaskStrictlyToday(t.dueDate, t.createdAt)
  })

  // Calculate estimated focus time dynamically from today's tasks
  const focusTimeString = useMemo(() => {
    if (todayTasks.length === 0) return '0m'
    const totalMinutes = todayTasks.reduce((acc, t) => acc + parseEstimatedMinutes(t.estimatedTime), 0)
    return formatMinutesToDisplay(totalMinutes)
  }, [todayTasks])

  // Next incomplete task
  const nextIncompleteTask = todayTasks.find((t) => t.completed === 0)
  const nextTaskTitle = nextIncompleteTask?.title || 'No pending tasks'

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl">
      <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F4F4F5] tracking-tight mb-3">
        Today at a Glance
      </h3>

      <div className="flex flex-col space-y-3 text-xs">
        {/* Total Tasks */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-neutral-600 dark:text-zinc-400">Total Tasks</span>
          <span className="font-bold text-[#111827] dark:text-[#F4F4F5] tabular-nums">{todayTasks.length}</span>
        </div>

        {/* Completed */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-neutral-600 dark:text-zinc-400">Completed</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{completedTodayTasks.length}</span>
        </div>

        {/* Focus Time */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-neutral-600 dark:text-zinc-400">Planned Time</span>
          <span className="font-bold text-[#111827] dark:text-[#F4F4F5] tabular-nums">{focusTimeString}</span>
        </div>

        {/* Next Task */}
        <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.08]">
          <span className="font-medium text-neutral-600 dark:text-zinc-400">Next Task</span>
          <div
            onClick={() => nextIncompleteTask && openEditTaskModal(nextIncompleteTask)}
            className="inline-flex items-center space-x-1 text-[#18181B] dark:text-[#F4F4F5] font-semibold truncate max-w-[140px] hover:underline cursor-pointer"
          >
            <span className="truncate">{nextTaskTitle}</span>
            {nextIncompleteTask && <ArrowRight className="w-3 h-3 shrink-0" />}
          </div>
        </div>
      </div>
    </Card>
  )
}
