import { useLiveQuery } from 'dexie-react-hooks'
import { Folder, Plus, ArrowRight } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'
import { useUIStore } from '@/stores/uiStore'

export function ProjectsSettingsCard() {
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const projects = useLiveQuery(() => db.projects.toArray(), []) || []

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Projects</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Manage your project folders, default organization, and workspace categories.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-2xs">
          <Folder className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.06]">
        {/* Projects List */}
        <div className="py-5 select-none space-y-3">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Active Projects ({projects.length})</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                All projects currently registered in your workspace.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNewProjectModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs self-start xs:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3 bg-neutral-50 dark:bg-zinc-800/80 rounded-xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    style={{ backgroundColor: proj.color }}
                    className="w-3 h-3 rounded-full shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5] truncate">{proj.name}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-zinc-400 capitalize">{proj.status}</div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-neutral-600 dark:text-zinc-300 bg-white dark:bg-[#18181B] px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/[0.1]">
                  {proj.dueDate}
                </span>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-neutral-400 dark:text-zinc-500">
                No projects created yet. Click "+ New Project" above to organize your tasks.
              </div>
            )}
          </div>
        </div>

        {/* Link to Full Projects Grid */}
        <div className="pt-4 flex items-center justify-between text-xs">
          <span className="text-neutral-500 dark:text-zinc-400">View progress bars and detailed project cards</span>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] hover:underline cursor-pointer"
          >
            <span>Go to Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}
