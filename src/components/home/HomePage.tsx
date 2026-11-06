import { MetricCardsRow } from './MetricCardsRow'
import { TodayTasksCard } from './TodayTasksCard'
import { TodayProgressCard } from './TodayProgressCard'
import { QuickActionsCard } from './QuickActionsCard'

export function HomePage() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Metric Cards Row */}
      <MetricCardsRow />

      {/* Main 2-Column Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Left Column: Today's Tasks Card (Spans 2 columns on lg) */}
        <div className="lg:col-span-2">
          <TodayTasksCard />
        </div>

        {/* Right Column: Progress & Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          <TodayProgressCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  )
}
