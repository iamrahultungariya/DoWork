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
      {/* Left: Filter Squircle Pills */}
      <div className="flex items-center space-x-1.5 p-1.5 bg-neutral-100/80 dark:bg-zinc-800/80 border border-black/[0.04] dark:border-white/[0.08] rounded-xl sm:rounded-2xl max-w-full overflow-x-auto no-scrollbar shrink-0">
        {filters.map((f) => {
          const isActive = taskFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setTaskFilter(f.id)}
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

      {/* Right: Custom Sort Dropdown & Add Task Button */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
        {/* Custom Sort Dropdown */}
        <CustomDropdown<TaskSortType>
          value={taskSort}
          options={SORT_OPTIONS}
          onChange={setTaskSort}
          prefixLabel="Sort"
          align="right"
          disableSound={true}
        />

        {/* Add Task Button */}
        <Button
          size="sm"
          onClick={() => setAddTaskModalOpen(true)}
          className="rounded-xl sm:rounded-2xl px-4 py-2 text-xs font-bold bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  )
}
