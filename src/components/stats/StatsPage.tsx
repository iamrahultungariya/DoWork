import { StatsMetricsRow } from './StatsMetricsRow'
import { TaskProgressChartCard } from './TaskProgressChartCard'
import { TaskDistributionCard } from './TaskDistributionCard'
import { FocusTimeCard } from './FocusTimeCard'
import { ConsistencyCard } from './ConsistencyCard'

export function StatsPage() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top 4 Metrics Cards */}
      <StatsMetricsRow />

      {/* Middle Row: Task Progress (Bar Chart) & Task Distribution (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-7">
          <TaskProgressChartCard />
        </div>
        <div className="lg:col-span-5">
          <TaskDistributionCard />
        </div>
      </div>

      {/* Bottom Row: Focus Time & Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        <FocusTimeCard />
        <ConsistencyCard />
      </div>
    </div>
  )
}
