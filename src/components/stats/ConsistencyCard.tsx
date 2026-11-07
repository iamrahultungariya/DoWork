import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Flame } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'

export function ConsistencyCard() {
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const streakDays = profile?.streakDays ?? 0

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
    const jsDay = idx === 6 ? 0 : idx + 1
    const hasActivity = tasks.some((t) => {
      const d = new Date(t.updatedAt || t.createdAt)
      return d.getDay() === jsDay && t.completed === 1
    })
    return { day, active: hasActivity }
  })

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight mb-2">Consistency</h3>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-2">
        {/* Days Row */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-1 xs:space-x-2 sm:space-x-3">
          {days.map((d) => (
            <div key={d.day} className="flex flex-col items-center space-y-1.5 xs:space-y-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#9CA3AF] dark:text-zinc-500">{d.day}</span>
              <div
                className={`w-6 h-6 xs:w-7 xs:h-7 rounded-lg flex items-center justify-center transition-all ${
                  d.active
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-300 dark:text-zinc-600 border border-neutral-200/60 dark:border-white/[0.08]'
                }`}
              >
                {d.active ? (
                  <Check className="w-3.5 h-3.5 xs:w-4 xs:h-4 stroke-[2.8]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-zinc-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Streak Badge */}
        <div className="flex items-center space-x-2 w-full sm:w-auto pt-3 sm:pt-0 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-black/[0.04] dark:border-white/[0.08]">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center border border-orange-100/60 dark:border-orange-900/40 shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] fill-orange-500/20" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F4F4F5]">{streakDays} days</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] dark:text-[#A1A1AA]">Current Streak</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
