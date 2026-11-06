import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

export function TodayProgressCard() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [])

  const totalCount = tasks ? tasks.length : 0
  const doneCount = tasks ? tasks.filter((t) => t.completed === 1).length : 0
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  // SVG Circular progress math
  const radius = 38
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  // Segmented bar representation (up to 8 segments matching the reference design)
  const segmentCount = 8
  const filledSegments = totalCount > 0 ? Math.round((doneCount / totalCount) * segmentCount) : 0

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl">
      <h3 className="text-base font-bold text-[#111827] tracking-tight">Today's Progress</h3>

      <div className="flex items-center space-x-4 sm:space-x-6 py-2">
        {/* Left: Circular Progress Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="50"
              cy="50"
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

          {/* Center Percentage Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-[#111827]">{percent}%</span>
          </div>
        </div>

        {/* Right: Summary Text & Segmented Indicator */}
        <div className="flex flex-col space-y-2.5">
          <span className="text-xs font-semibold text-[#18181B]">
            {doneCount} of {totalCount} tasks done
          </span>

          {/* Segmented Progress Pills */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: segmentCount }).map((_, idx) => {
              const isFilled = idx < filledSegments
              return (
                <div
                  key={idx}
                  className={`h-2 w-3 rounded-full transition-colors duration-300 ${
                    isFilled ? 'bg-[#059669]' : 'bg-[#E5E7EB]'
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
