import { useLiveQuery } from 'dexie-react-hooks'
import { Check } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

export function MyTasksOverviewCard() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [])

  const total = tasks ? tasks.length : 0
  const done = tasks ? tasks.filter((t) => t.completed === 1).length : 0
  const inProgress = tasks ? tasks.filter((t) => t.status === 'in_progress').length : 0
  const todo = Math.max(0, total - done - inProgress)
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  // SVG Circular progress
  const radius = 34
  const strokeWidth = 7
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl">
      <h3 className="text-base font-bold text-[#111827] tracking-tight mb-3">Overview</h3>

      <div className="flex items-center space-x-5 py-2">
        {/* Left: Circular Progress Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="#059669"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-extrabold text-[#111827]">{percent}%</span>
          </div>
        </div>

        {/* Right: Breakdown list */}
        <div className="flex flex-col space-y-2 flex-1">
          <span className="text-xs font-semibold text-[#18181B] pb-1 border-b border-black/[0.04]">
            {done} of {total} tasks done
          </span>

          {/* Done */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#6B7280]">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="text-[#18181B] font-medium">Done</span>
            </div>
            <span className="font-bold text-[#111827]">{done}</span>
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#6B7280]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 flex items-center justify-center" />
              <span className="text-[#18181B] font-medium">In Progress</span>
            </div>
            <span className="font-bold text-[#111827]">{inProgress}</span>
          </div>

          {/* Todo */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#6B7280]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300" />
              <span className="text-[#18181B] font-medium">Todo</span>
            </div>
            <span className="font-bold text-[#111827]">{todo}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
