import { useLiveQuery } from 'dexie-react-hooks'
import { Folder, Plus, ArrowRight } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'

export function MyTasksProjectsCard() {
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []
  const dbProjects = useLiveQuery(() => db.projects.toArray(), []) || []

  // Combine projects from db or categories from tasks
  const projectList =
    dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          name: p.name,
          count: tasks.filter((t) => t.category === p.name).length,
        }))
      : Array.from(new Set(tasks.map((t) => t.category))).map((cat) => ({
          id: cat,
          name: cat,
          count: tasks.filter((t) => t.category === cat).length,
        }))

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.08]">
        <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Projects</h3>
        <button
          type="button"
          onClick={() => setNewProjectModalOpen(true)}
          title="Create New Project"
          className="w-6 h-6 rounded-lg border border-black/[0.06] dark:border-white/[0.1] flex items-center justify-center text-neutral-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col space-y-2 py-3">
        {projectList.map((proj) => (
          <div
            key={proj.id}
            onClick={() => setActiveTab('projects')}
            className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <Folder className="w-4 h-4 text-neutral-500 dark:text-zinc-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              <span className="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]">{proj.name}</span>
            </div>
            <span className="text-xs font-bold text-[#6B7280] dark:text-[#A1A1AA] bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {proj.count}
            </span>
          </div>
        ))}

        {projectList.length === 0 && (
          <div className="py-4 text-center text-xs text-[#9CA3AF] dark:text-zinc-500">
            No projects created yet.
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.08] flex justify-center">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] hover:text-neutral-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  )
}
