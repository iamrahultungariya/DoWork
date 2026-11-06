import { MyTasksFilterBar } from './MyTasksFilterBar'
import { MyTasksOverviewCard } from './MyTasksOverviewCard'
import { MyTasksProjectsCard } from './MyTasksProjectsCard'
import { MyTasksListCard } from './MyTasksListCard'

export function MyTasksPage() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-5 max-w-7xl mx-auto">
      {/* Top Filter and Actions Row */}
      <MyTasksFilterBar />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Overview & Projects */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 order-2 lg:order-1">
          <MyTasksOverviewCard />
          <MyTasksProjectsCard />
        </div>

        {/* Right Column: Tasks List */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <MyTasksListCard />
        </div>
      </div>
    </div>
  )
}
