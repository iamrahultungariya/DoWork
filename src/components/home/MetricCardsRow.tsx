import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import { isTaskDueTodayOrOverdue, isTaskStrictlyToday, toCalendarDateString } from '@/lib/date'

export function MetricCardsRow() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])

  const todayStr = toCalendarDateString(new Date())

  // Tasks scheduled for today + overdue carryover
  const todayTasks = tasks.filter((t) => isTaskDueTodayOrOverdue(t.dueDate, t.createdAt, t.completed))
  const overdueCount = tasks.filter((t) => t.completed === 0 && !isTaskStrictlyToday(t.dueDate, t.createdAt) && isTaskDueTodayOrOverdue(t.dueDate, t.createdAt, 0)).length

  // Completed today
  const completedTodayTasks = tasks.filter((t) => {
    if (t.completed !== 1) return false
    if (t.completedAt) {
      return toCalendarDateString(new Date(t.completedAt)) === todayStr
    }
    return isTaskStrictlyToday(t.dueDate, t.createdAt)
  })

  // Incomplete tasks due today
  const remainingToday = todayTasks.filter((t) => t.completed === 0).length
  const streakDays = profile?.streakDays ?? 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Tasks Today */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
          Tasks Today
        </span>
        <div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
            {todayTasks.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 truncate">
            {overdueCount > 0 ? `${overdueCount} carryover included` : 'Scheduled for today'}
          </div>
        </div>
      </Card>

      {/* 2. Completed Today */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Completed Today
        </span>
        <div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
            {completedTodayTasks.length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 truncate">
            Finished today
          </div>
        </div>
      </Card>

      {/* 3. Remaining */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
          Remaining
        </span>
        <div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
            {remainingToday}
          </div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 truncate">
            Pending completion
          </div>
        </div>
      </Card>

      {/* 4. Daily Streak */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Daily Streak
          </span>
          {streakDays > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Active
            </span>
          )}
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
            {streakDays} <span className="text-sm font-medium text-neutral-500 dark:text-zinc-400">days</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 truncate">
            {streakDays > 0 ? 'Consecutive active streak' : 'Finish tasks today to build streak'}
          </div>
        </div>
      </Card>
    </div>
  )
}
