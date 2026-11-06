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
      <h3 className="text-sm font-bold text-[#111827] tracking-tight mb-3">Today at a Glance</h3>

      <div className="flex flex-col space-y-3 text-xs">
        {/* Total Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280]">
            <CheckSquare className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-medium text-[#111827]">Total Tasks</span>
          </div>
          <span className="font-bold text-[#111827]">{totalTasks}</span>
        </div>

        {/* Completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-[#111827]">Completed</span>
          </div>
          <span className="font-bold text-[#111827]">{completedTasks}</span>
        </div>

        {/* Focus Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#6B7280]">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-medium text-[#111827]">Planned Time</span>
          </div>
          <span className="font-bold text-[#111827]">{focusTimeString}</span>
        </div>

        {/* Next Task */}
        <div className="flex items-center justify-between pt-1 border-t border-black/[0.04]">
          <div className="flex items-center space-x-2 text-[#6B7280]">
            <Target className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-medium text-[#111827]">Next Task</span>
          </div>
          <div
            onClick={() => nextIncompleteTask && openEditTaskModal(nextIncompleteTask)}
            className="inline-flex items-center space-x-1 text-[#18181B] font-semibold truncate max-w-[140px] hover:underline cursor-pointer"
          >
            <span className="truncate">{nextTaskTitle}</span>
            {nextIncompleteTask && <ArrowRight className="w-3 h-3 shrink-0" />}
          </div>
        </div>
      </div>
    </Card>
  )
}
