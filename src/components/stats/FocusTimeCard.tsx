import { useLiveQuery } from 'dexie-react-hooks'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function FocusTimeCard() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  // Calculate completed task minutes by day
  const dayMinutes = DAYS.map((day, idx) => {
    const jsDay = idx === 6 ? 0 : idx + 1
    const dayTasks = tasks.filter((t) => {
      if (t.completed !== 1) return false
      const d = new Date(t.updatedAt || t.createdAt)
      return d.getDay() === jsDay
    })

    const minutes = dayTasks.reduce((acc, t) => {
      const match = t.estimatedTime.match(/(\d+)\s*(hr|min|h|m)/gi)
      if (!match) return acc + 30
      let mins = 0
      for (const m of match) {
        if (/hr|h/i.test(m)) mins += parseInt(m) * 60
        else if (/min|m/i.test(m)) mins += parseInt(m)
      }
      return acc + (mins || 30)
    }, 0)

    return { day, minutes }
  })

  const totalMinutes = dayMinutes.reduce((acc, d) => acc + d.minutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const remMinutes = totalMinutes % 60
  const focusTimeString =
    totalMinutes === 0
      ? '0m'
      : hours > 0
      ? `${hours}h${remMinutes > 0 ? ` ${remMinutes}m` : ''}`
      : `${remMinutes}m`

  const maxDayMinutes = Math.max(...dayMinutes.map((d) => d.minutes), 60)

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight mb-2">Completed Time</h3>

      <div className="flex items-center justify-between gap-4 sm:gap-6 py-2">
        {/* Left: Value & Label */}
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F4F4F5] tracking-tight">
            {focusTimeString}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Total task time completed
          </div>
        </div>

        {/* Right: Mini Bar Visualization */}
        <div className="flex items-end space-x-1 xs:space-x-1.5 h-16 pt-2 shrink-0">
          {dayMinutes.map((item) => {
            const heightPct =
              item.minutes > 0 ? Math.max(15, (item.minutes / maxDayMinutes) * 100) : 8
            return (
              <div key={item.day} className="flex flex-col items-center">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-2.5 xs:w-3.5 rounded-full transition-all duration-300 ${
                    item.minutes > 0 ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-zinc-800'
                  }`}
                />
                <span className="text-[9px] xs:text-[10px] font-semibold text-[#9CA3AF] dark:text-zinc-500 mt-1.5">{item.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
