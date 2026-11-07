import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function TaskProgressChartCard() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  // Aggregate tasks by day of week based on creation timestamp
  const dayStats = DAYS.map((day, idx) => {
    // JavaScript getDay() returns 0 for Sunday, 1 for Monday...
    const jsDay = idx === 6 ? 0 : idx + 1

    const created = tasks.filter((t) => {
      const d = new Date(t.createdAt)
      return d.getDay() === jsDay
    }).length

    const completed = tasks.filter((t) => {
      if (t.completed !== 1) return false
      const d = new Date(t.updatedAt || t.createdAt)
      return d.getDay() === jsDay
    }).length

    return { day, created, completed }
  })

  const rawMax = Math.max(...dayStats.map((d) => Math.max(d.created, d.completed)), 4)
  const maxVal = Math.ceil(rawMax / 4) * 4
  const step = maxVal / 4
  const yTicks = [maxVal, maxVal - step, maxVal - step * 2, step, 0]

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl h-full">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.08]">
        <h2 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Task Progress</h2>
        <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E2E8F0] dark:bg-zinc-700" />
            <span>Created</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-6 pb-2 flex-1 flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[11px] font-semibold text-[#9CA3AF] dark:text-zinc-500 pr-2.5 sm:pr-4 select-none h-44">
          {yTicks.map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>

        {/* Bars Container */}
        <div className="flex-1 relative flex flex-col justify-between h-44">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yTicks.map((val) => (
              <div key={val} className="w-full border-b border-black/[0.04] dark:border-white/[0.06]" />
            ))}
          </div>

          {/* Bar Columns */}
          <div className="relative h-full flex items-end justify-between px-1 xs:px-3 sm:px-6 z-10">
            {dayStats.map((item) => {
              const createdHeight = maxVal > 0 ? (item.created / maxVal) * 100 : 0
              const completedHeight = maxVal > 0 ? (item.completed / maxVal) * 100 : 0

              return (
                <div key={item.day} className="flex flex-col items-center group cursor-pointer">
                  {/* Bars Stack */}
                  <div className="relative w-5 xs:w-7 sm:w-9 h-40 flex items-end justify-center">
                    {/* Created (Background Bar) */}
                    <div
                      style={{ height: `${createdHeight}%` }}
                      className="w-full bg-[#E2E8F0] dark:bg-zinc-700 rounded-t-lg transition-all duration-300"
                    />
                    {/* Completed (Foreground Bar) */}
                    <div
                      style={{ height: `${completedHeight}%` }}
                      className="absolute bottom-0 w-full bg-[#10B981] rounded-t-lg transition-all duration-300 shadow-2xs"
                    />
                  </div>
                  {/* X-Axis Day Label */}
                  <span className="text-[10px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-3 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
