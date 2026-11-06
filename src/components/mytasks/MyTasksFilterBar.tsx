import { useLiveQuery } from 'dexie-react-hooks'
import { Plus } from 'lucide-react'
import { db } from '@/db/db'
import { useUIStore, type TaskFilterType, type TaskSortType } from '@/stores/uiStore'
import { Button } from '@/components/common/Button'
import { CustomDropdown, type DropdownOption } from '@/components/common/CustomDropdown'
import { cn } from '@/lib/utils'

const SORT_OPTIONS: DropdownOption<TaskSortType>[] = [
  { id: 'priority', label: 'Priority' },
  { id: 'date', label: 'Due Date' },
  { id: 'title', label: 'Task Title (A-Z)' },
]

export function MyTasksFilterBar() {
  const taskFilter = useUIStore((s) => s.taskFilter)
  const setTaskFilter = useUIStore((s) => s.setTaskFilter)
  const taskSort = useUIStore((s) => s.taskSort)
  const setTaskSort = useUIStore((s) => s.setTaskSort)
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || []

  const allCount = tasks.length
  const doneCount = tasks.filter((t) => t.completed === 1).length
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
  const todoCount = tasks.filter((t) => t.completed === 0 && t.status !== 'in_progress').length

  const filters: { id: TaskFilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: allCount },
    { id: 'todo', label: 'Todo', count: todoCount },
    { id: 'in_progress', label: 'In Progress', count: inProgressCount },
    { id: 'done', label: 'Done', count: doneCount },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-2 max-w-full">
      {/* Left: Filter Pills */}
      <div className="flex items-center space-x-1.5 p-1 bg-neutral-100/70 border border-black/[0.04] rounded-full max-w-full overflow-x-auto no-scrollbar shrink-0">
        {filters.map((f) => {
          const isActive = taskFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setTaskFilter(f.id)}
              className={cn(
                'px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 shrink-0 whitespace-nowrap',
                isActive
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-200/50'
              )}
            >
              <span>{f.label}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'text-[#6B7280]'
                )}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right: Custom Sort Dropdown & Add Task Button */}
      <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
        {/* Custom Sort Dropdown */}
        <CustomDropdown<TaskSortType>
          value={taskSort}
          options={SORT_OPTIONS}
          onChange={setTaskSort}
          prefixLabel="Sort"
          align="right"
        />

        {/* Add Task Button */}
        <Button
          size="sm"
          onClick={() => setAddTaskModalOpen(true)}
          className="rounded-xl px-3 sm:px-3.5 py-1.5 text-xs font-semibold bg-[#18181B] text-white hover:bg-neutral-800 shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  )
}
