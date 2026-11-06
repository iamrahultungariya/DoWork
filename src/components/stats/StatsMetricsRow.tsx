import { useLiveQuery } from 'dexie-react-hooks'
import { CheckSquare, ListChecks, Clock, Flame, ArrowUpRight } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

export function StatsMetricsRow() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])

  const completedCount = tasks.filter((t) => t.completed === 1).length
  const createdCount = tasks.length
  const streakDays = profile?.streakDays ?? 0

  const totalMinutes = tasks
    .filter((t) => t.completed === 1)
    .reduce((acc, t) => {
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
  const focusTimeString =
    totalMinutes === 0
      ? '0m'
      : hours > 0
      ? `${hours}h${remMinutes > 0 ? ` ${remMinutes}m` : ''}`
      : `${remMinutes}m`

  const completionRate =
    createdCount > 0 ? Math.round((completedCount / createdCount) * 100) : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Tasks Completed */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs">
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          {completedCount > 0 && (
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/80 px-1.5 sm:px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {completionRate}%
            </span>
          )}
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            {completedCount}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5">Tasks Completed</div>
        </div>
      </Card>

      {/* 2. Tasks Created */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs">
            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            {createdCount}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5">Tasks Created</div>
        </div>
      </Card>

      {/* 3. Focus Time Completed */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            {focusTimeString}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5">Completed Time</div>
        </div>
      </Card>

      {/* 4. Current Streak */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100/60 shadow-2xs">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] fill-orange-500/20" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            {streakDays} days
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5">Current Streak</div>
        </div>
      </Card>
    </div>
  )
}
