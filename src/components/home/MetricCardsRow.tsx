import { useLiveQuery } from 'dexie-react-hooks'
import { CheckSquare, Calendar, Flame } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'

export function MetricCardsRow() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [])
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])

  const totalTasks = tasks ? tasks.length : 0
  const completedTasks = tasks ? tasks.filter((t) => t.completed === 1).length : 0
  const remainingTasks = Math.max(0, totalTasks - completedTasks)
  const streakDays = profile?.streakDays ?? 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Tasks Today */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs">
          <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">{totalTasks}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5 truncate">Tasks Today</div>
        </div>
      </Card>

      {/* 2. Completed */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shadow-2xs">
          {/* Circular ring icon */}
          <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40 20" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">{completedTasks}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5 truncate">Completed</div>
        </div>
      </Card>

      {/* 3. Remaining */}
      <Card className="col-span-1 flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100/60 shadow-2xs">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">{remainingTasks}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5 truncate">Remaining</div>
        </div>
      </Card>

      {/* 4. Current Streak (Spans remaining column on mobile or 2 cols on lg) */}
      <Card className="col-span-1 sm:col-span-1 lg:col-span-2 flex items-center justify-between p-4 sm:p-5 rounded-2xl h-32 sm:h-36 overflow-hidden relative">
        <div className="flex flex-col justify-between h-full z-10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100/60 shadow-2xs">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] fill-orange-500/20" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight whitespace-nowrap">
              {streakDays} days
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] mt-0.5 truncate">Current Streak</div>
          </div>
        </div>

        {/* Cheerful Boy with Headphones and Plant Illustration */}
        <div className="absolute right-0 bottom-0 h-full w-[110px] sm:w-[130px] lg:w-[160px] pointer-events-none flex items-end justify-end">
          <img
            src={cheerfulBoyImg}
            alt="Cheerful Boy with Headphones and Plant"
            className="h-[96px] sm:h-[115px] lg:h-[128px] w-auto object-contain object-bottom select-none drop-shadow-2xs"
          />
        </div>
      </Card>
    </div>
  )
}
