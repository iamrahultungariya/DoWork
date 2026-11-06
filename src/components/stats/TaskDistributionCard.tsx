import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

const CATEGORY_COLORS: Record<string, string> = {
  Study: '#10B981', // green
  Project: '#A855F7', // purple
  Design: '#F59E0B', // amber
  Exam: '#F43F5E', // rose
  Learning: '#38BDF8', // sky blue
  Personal: '#FB923C', // orange
  Routine: '#94A3B8', // slate
  Plan: '#6366F1', // indigo
}

export function TaskDistributionCard() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const totalTasks = tasks.length

  // Dynamically compute category counts and percentages
  const categoryCounts = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  }, {})

  const distribution = Object.entries(categoryCounts).map(([name, count]) => {
    const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
    const color = CATEGORY_COLORS[name] || '#94A3B8'
    return { name, count, percentage, color }
  })

  const radius = 50
  const circumference = 2 * Math.PI * radius
  let accumulatedOffset = 0

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <h2 className="text-base font-bold text-[#111827] tracking-tight pb-3 border-b border-black/[0.04]">
        Task Distribution
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
        {/* Donut SVG */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="18"
              fill="transparent"
            />

            {distribution.map((cat) => {
              const strokeLength = (cat.percentage / 100) * circumference
              const offset = -accumulatedOffset
              accumulatedOffset += strokeLength

              return (
                <circle
                  key={cat.name}
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={cat.color}
                  strokeWidth="18"
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={offset}
                  fill="transparent"
                  className="transition-all duration-300 hover:opacity-85"
                />
              )
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-[#111827] leading-none">
              {totalTasks}
            </span>
            <span className="text-xs font-semibold text-[#6B7280] mt-1">Tasks</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col space-y-2.5 flex-1 w-full text-xs">
          {distribution.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  style={{ backgroundColor: cat.color }}
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                />
                <span className="font-semibold text-[#18181B]">{cat.name}</span>
              </div>
              <span className="font-bold text-[#6B7280]">
                {cat.percentage}% ({cat.count})
              </span>
            </div>
          ))}

          {distribution.length === 0 && (
            <div className="text-center py-6 text-xs text-neutral-400">
              No task category data available yet.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
