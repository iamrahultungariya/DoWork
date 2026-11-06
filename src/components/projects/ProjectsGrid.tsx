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
        return <Laptop className="w-5 h-5 text-blue-600" />
      case 'code':
        return <Code className="w-5 h-5 text-purple-600" />
      case 'palette':
        return <Palette className="w-5 h-5 text-amber-600" />
      case 'book':
        return <BookOpen className="w-5 h-5 text-emerald-600" />
      case 'target':
        return <Target className="w-5 h-5 text-orange-600" />
      default:
        return <Folder className="w-5 h-5 text-blue-600" />
    }
  }

  const getIconBg = (icon: Project['icon']) => {
    switch (icon) {
      case 'laptop':
        return 'bg-blue-50 border-blue-100'
      case 'code':
        return 'bg-purple-50 border-purple-100'
      case 'palette':
        return 'bg-amber-50 border-amber-100'
      case 'book':
        return 'bg-emerald-50 border-emerald-100'
      case 'target':
        return 'bg-orange-50 border-orange-100'
      default:
        return 'bg-neutral-50 border-neutral-100'
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Sub-header with Sort & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827] tracking-tight">
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

          <div className="flex items-center space-x-1 p-0.5 bg-neutral-100 rounded-lg border border-black/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-[#18181B]' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white shadow-2xs text-[#18181B]' : 'text-neutral-400 hover:text-neutral-700'
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
              className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all group"
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
                      <h3 className="text-sm font-bold text-[#111827] group-hover:text-black truncate">
                        {proj.name}
                      </h3>
                      <p className="text-[11px] font-medium text-[#6B7280] line-clamp-1">
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
                      className={`p-1.5 rounded-lg border transition-all ${
                        proj.status === 'completed'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-transparent text-neutral-400 hover:text-emerald-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Project */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden mr-3">
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
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/[0.04] text-[11px] font-semibold text-[#6B7280]">
                <div className="flex items-center space-x-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {completedTasks} of {totalTasks} tasks
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {isDone ? (
                    <span className="inline-flex items-center text-emerald-600 font-bold">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
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
          className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/50 hover:bg-white min-h-[160px] group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-700 flex items-center justify-center mb-3 transition-colors shadow-2xs">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h4 className="text-sm font-bold text-[#111827]">Create New Project</h4>
          <p className="text-xs font-medium text-[#6B7280] mt-1 max-w-[200px]">
            Organize your tasks and goals in a project.
          </p>
        </div>
      </div>
    </div>
  )
}
