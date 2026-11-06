import { ProjectsFilterBar } from './ProjectsFilterBar'
import { ProjectsMetricsRow } from './ProjectsMetricsRow'
import { ProjectsGrid } from './ProjectsGrid'

export function ProjectsPage() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Filter and New Project Action */}
      <ProjectsFilterBar />

      {/* 4 Metric Cards */}
      <ProjectsMetricsRow />

      {/* Projects Grid */}
      <ProjectsGrid />
    </div>
  )
}
