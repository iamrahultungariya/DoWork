import { TodayMetricsRow } from './TodayMetricsRow'
import { TodayScheduleCard } from './TodayScheduleCard'
import { TodayTasksListCard } from './TodayTasksListCard'
import { QuickAddWidget } from './QuickAddWidget'
import { TodayGlanceWidget } from './TodayGlanceWidget'

export function TodayPage() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top 4 Metrics Cards */}
      <TodayMetricsRow />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Column 1: Today's Schedule (spans 4 on lg) */}
        <div className="lg:col-span-4 h-full">
          <TodayScheduleCard />
        </div>

        {/* Column 2: Today's Tasks (spans 5 on lg) */}
        <div className="lg:col-span-5 h-full">
          <TodayTasksListCard />
        </div>

        {/* Column 3: Quick Add & Glance (spans 3 on lg) */}
        <div className="md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-5">
          <QuickAddWidget />
          <TodayGlanceWidget />
        </div>
      </div>
    </div>
  )
}
