import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  Laptop,
  Code,
  Palette,
  BookOpen,
  Target,
  Calendar,
  CheckSquare,
  Plus,
  LayoutGrid,
  List,
  Check,
  Trash2,
  Folder,
} from 'lucide-react'
import { db, type Project } from '@/db/db'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { deleteProject, updateProject } from '@/db/taskService'
import { CustomDropdown, type DropdownOption } from '@/components/common/CustomDropdown'

type ProjectSort = 'order' | 'name' | 'progress'

const SORT_OPTIONS: DropdownOption<ProjectSort>[] = [
  { id: 'order', label: 'Default Order' },
  { id: 'name', label: 'Project Name (A-Z)' },
  { id: 'progress', label: 'Highest Progress' },
]

export function ProjectsGrid() {
  const projectFilter = useUIStore((s) => s.projectFilter)
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const setTaskFilter = useUIStore((s) => s.setTaskFilter)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<ProjectSort>('order')

  const projects = useLiveQuery(() => db.projects.orderBy('order').toArray(), []) || []
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        if (projectFilter === 'all') return true
        return p.status === projectFilter
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'progress') {
          const aTasks = tasks.filter((t) => t.category === a.name)
          const bTasks = tasks.filter((t) => t.category === b.name)
          const aPct = aTasks.length > 0 ? aTasks.filter((t) => t.completed === 1).length / aTasks.length : 0
          const bPct = bTasks.length > 0 ? bTasks.filter((t) => t.completed === 1).length / bTasks.length : 0
          return bPct - aPct
        }
        return a.order - b.order
      })
  }, [projects, projectFilter, sortBy, tasks])

  const handleDeleteProject = (proj: Project) => {
    requestConfirm({
      title: 'Delete Project?',
      message: `Are you sure you want to delete project "${proj.name}"? Tasks assigned to this project will be preserved.`,
      confirmLabel: 'Delete Project',
      onConfirm: async () => {
        await deleteProject(proj.id)
        showToast(`Project "${proj.name}" deleted`, 'info')
      },
    })
  }

  const handleToggleCompleted = async (proj: Project) => {
    const nextStatus = proj.status === 'completed' ? 'active' : 'completed'
    await updateProject(proj.id, { status: nextStatus })
    showToast(
      nextStatus === 'completed' ? `Project marked as Completed` : `Project marked as Active`,
      'success'
    )
  }

  const getProjectIcon = (icon: Project['icon']) => {
    switch (icon) {
      case 'laptop':
        return <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'code':
        return <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case 'palette':
        return <Palette className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'book':
        return <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case 'target':
        return <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      default:
        return <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  }

  const getIconBg = (icon: Project['icon']) => {
    switch (icon) {
      case 'laptop':
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40'
      case 'code':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40'
      case 'palette':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40'
      case 'book':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40'
      case 'target':
        return 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/40'
      default:
        return 'bg-neutral-50 dark:bg-zinc-800 border-neutral-100 dark:border-zinc-700'
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Sub-header with Sort & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">
          Projects ({filtered.length})
        </h2>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Custom Sort Dropdown */}
          <CustomDropdown<ProjectSort>
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={setSortBy}
            prefixLabel="Sort"
          />

          <div className="flex items-center space-x-1 p-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-lg border border-black/[0.04] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#18181B] shadow-2xs text-[#18181B] dark:text-white'
                  : 'text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#18181B] shadow-2xs text-[#18181B] dark:text-white'
                  : 'text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List of Project Cards */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            : 'flex flex-col space-y-3'
        }
      >
        {filtered.map((proj) => {
          // Dynamic calculation based on tasks linked to this project name
          const projectTasks = tasks.filter((t) => t.category === proj.name)
          const totalTasks = projectTasks.length
          const completedTasks = projectTasks.filter((t) => t.completed === 1).length
          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          const isDone = proj.status === 'completed' || (totalTasks > 0 && percent === 100)

          return (
            <Card
              key={proj.id}
              className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)] dark:hover:border-white/[0.14] transition-all group"
            >
              <div>
                {/* Top Row: Icon, Title & Actions */}
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => {
                      setTaskFilter('all')
                      setActiveTab('my-tasks')
                    }}
                    className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 mr-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs shrink-0 ${getIconBg(
                        proj.icon
                      )}`}
                    >
                      {getProjectIcon(proj.icon)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#111827] dark:text-[#F4F4F5] group-hover:text-black dark:group-hover:text-white truncate">
                        {proj.name}
                      </h3>
                      <p className="text-[11px] font-medium text-[#6B7280] dark:text-[#A1A1AA] line-clamp-1">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Toggle Done Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(proj)}
                      title={proj.status === 'completed' ? 'Mark as Active' : 'Mark as Completed'}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        proj.status === 'completed'
                          ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          : 'border-transparent text-neutral-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Project */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">
                    <div className="w-full bg-neutral-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mr-3">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="shrink-0">{percent}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Task count and Due Date */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/[0.04] dark:border-white/[0.08] text-[11px] font-semibold text-[#6B7280] dark:text-[#A1A1AA]">
                <div className="flex items-center space-x-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                  <span>
                    {completedTasks} of {totalTasks} tasks
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {isDone ? (
                    <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                      <span>{proj.dueDate}</span>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )
        })}

        {/* Create New Project Card */}
        <div
          onClick={() => setNewProjectModalOpen(true)}
          className="border-2 border-dashed border-neutral-300 dark:border-zinc-700 hover:border-neutral-900 dark:hover:border-zinc-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900/80 min-h-[160px] group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-800 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 text-neutral-700 dark:text-zinc-300 flex items-center justify-center mb-3 transition-colors shadow-2xs">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h4 className="text-sm font-bold text-[#111827] dark:text-[#F4F4F5]">Create New Project</h4>
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#A1A1AA] mt-1 max-w-[200px]">
            Organize your tasks and goals in a project.
          </p>
        </div>
      </div>
    </div>
  )
}
