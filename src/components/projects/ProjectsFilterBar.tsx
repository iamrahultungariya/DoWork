import { useLiveQuery } from 'dexie-react-hooks'
import { Plus } from 'lucide-react'
import { db } from '@/db/db'
import { useUIStore, type ProjectFilterType } from '@/stores/uiStore'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

export function ProjectsFilterBar() {
  const projectFilter = useUIStore((s) => s.projectFilter)
  const setProjectFilter = useUIStore((s) => s.setProjectFilter)
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const projects = useLiveQuery(() => db.projects.toArray(), []) || []

  const allCount = projects.length
  const activeCount = projects.filter((p) => p.status === 'active').length
  const completedCount = projects.filter((p) => p.status === 'completed').length
  const archivedCount = projects.filter((p) => p.status === 'archived').length

  const filters: { id: ProjectFilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Projects', count: allCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'archived', label: 'Archived', count: archivedCount },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-2 max-w-full">
      {/* Left: Filter Squircle Pills */}
      <div className="flex items-center space-x-1.5 p-1.5 bg-neutral-100/80 dark:bg-zinc-800/80 border border-black/[0.04] dark:border-white/[0.08] rounded-xl sm:rounded-2xl max-w-full overflow-x-auto no-scrollbar shrink-0">
        {filters.map((f) => {
          const isActive = projectFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setProjectFilter(f.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-2 shrink-0 whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs'
                  : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-zinc-700/60'
              )}
            >
              <span>{f.label}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-md font-bold',
                  isActive ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#09090B]' : 'text-[#6B7280] dark:text-[#A1A1AA]'
                )}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right: + New Project Button */}
      <Button
        size="sm"
        onClick={() => setNewProjectModalOpen(true)}
        className="rounded-xl sm:rounded-2xl px-4 py-2 text-xs font-bold bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs shrink-0 self-end sm:self-auto cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>New Project</span>
      </Button>
    </div>
  )
}
