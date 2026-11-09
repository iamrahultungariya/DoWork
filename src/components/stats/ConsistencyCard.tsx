import { useLiveQuery } from 'dexie-react-hooks'
import { Check } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'
import { toCalendarDateString } from '@/lib/date'

export function ConsistencyCard() {
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const streakDays = profile?.streakDays ?? 0

  // Calculate Monday through Sunday for current week
  const today = new Date()
  const dayOfWeek = today.getDay()
  const distanceToMonday = (dayOfWeek + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - distanceToMonday)

  const activeDates = new Set(
    tasks
      .filter((t) => t.completed === 1)
      .map((t) => toCalendarDateString(new Date(t.completedAt || t.updatedAt || t.createdAt)))
  )

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + idx)
    const dateStr = toCalendarDateString(d)
    const isToday = dateStr === toCalendarDateString(today)
    return {
      day,
      dateNum: d.getDate(),
      active: activeDates.has(dateStr),
      isToday,
    }
  })

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-[#111827] dark:text-[#F4F4F5] tracking-tight">
          Consistency & Streak
        </h3>
        <span className="text-xs text-neutral-500 dark:text-zinc-400">Current Week</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-2">
        {/* Days Row */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-1.5 xs:space-x-2 sm:space-x-3">
          {days.map((d) => (
            <div key={d.day} className="flex flex-col items-center space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 dark:text-zinc-500">
                {d.day}
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-semibold ${
                  d.active
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : d.isToday
                    ? 'border-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white bg-neutral-50 dark:bg-zinc-800'
                    : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-zinc-600 border border-neutral-200/60 dark:border-white/[0.08]'
                }`}
              >
                {d.active ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span className="tabular-nums text-[11px]">{d.dateNum}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Streak Badge */}
        <div className="flex items-center space-x-3 w-full sm:w-auto pt-3 sm:pt-0 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-neutral-200/60 dark:border-zinc-800">
          <div className="flex flex-col">
            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
              {streakDays} <span className="text-xs font-normal text-neutral-500 dark:text-zinc-400">days</span>
            </div>
            <div className="text-[11px] font-medium text-neutral-500 dark:text-zinc-400">
              {streakDays > 0 ? 'Active consecutive streak' : 'No active streak'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
