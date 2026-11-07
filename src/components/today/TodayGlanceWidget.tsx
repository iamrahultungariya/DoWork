import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { CheckSquare, CheckCircle2, Clock, Target, ArrowRight } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'

export function TodayGlanceWidget() {
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const tasks = useLiveQuery(() => db.tasks.toArray(), [])

  const totalTasks = tasks ? tasks.length : 0
  const completedTasks = tasks ? tasks.filter((t) => t.completed === 1).length : 0

  // Calculate estimated focus time dynamically from tasks
  const focusTimeString = useMemo(() => {
    if (!tasks || tasks.length === 0) return '0 min'

    const totalMinutes = tasks.reduce((acc, t) => {
      const match = t.estimatedTime.match(/(\d+)\s*(hr|min|h|m)/gi)
      if (!match) return acc + 30
      let mins = 0
      for (const m of match) {
        if (/hr|h/i.test(m)) mins += parseInt(m) * 60
        else if (/min|m/i.test(m)) mins += parseInt(m)
      }
      return acc + (mins || 30)
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const remMinutes = totalMinutes % 60
    return totalMinutes === 0
      ? '0 min'
      : hours > 0
      ? `${hours}h${remMinutes > 0 ? ` ${remMinutes}m` : ''}`
      : `${remMinutes} min`
  }, [tasks])

  // Next incomplete task
  const nextIncompleteTask = tasks?.find((t) => t.completed === 0)
  const nextTaskTitle = nextIncompleteTask?.title || 'No pending tasks'

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl">
      <h3 className="text-sm font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight mb-3">Today at a Glance</h3>

      <div className="flex flex-col space-y-3 text-xs">
        {/* Total Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280] dark:text-[#A1A1AA]">
            <CheckSquare className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
            <span className="font-medium text-[#111827] dark:text-[#E4E4E7]">Total Tasks</span>
          </div>
          <span className="font-bold text-[#111827] dark:text-[#F4F4F5]">{totalTasks}</span>
        </div>

        {/* Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280] dark:text-[#A1A1AA]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-[#111827] dark:text-[#E4E4E7]">Completed</span>
          </div>
          <span className="font-bold text-[#111827] dark:text-[#F4F4F5]">{completedTasks}</span>
        </div>

        {/* Focus Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280] dark:text-[#A1A1AA]">
            <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
            <span className="font-medium text-[#111827] dark:text-[#E4E4E7]">Planned Time</span>
          </div>
          <span className="font-bold text-[#111827] dark:text-[#F4F4F5]">{focusTimeString}</span>
        </div>

        {/* Next Task */}
        <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.08]">
          <div className="flex items-center space-x-2 text-[#6B7280] dark:text-[#A1A1AA]">
            <Target className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
            <span className="font-medium text-[#111827] dark:text-[#E4E4E7]">Next Task</span>
          </div>
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
