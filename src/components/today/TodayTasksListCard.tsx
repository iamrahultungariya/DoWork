import { useLiveQuery } from 'dexie-react-hooks'
import { Pencil, Trash2 } from 'lucide-react'
import { db, type Task } from '@/db/db'
import { Card } from '@/components/common/Card'
import { Checkbox } from '@/components/common/Checkbox'
import { Badge } from '@/components/common/Badge'
import { toggleTaskCompleted, deleteTask } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function TodayTasksListCard() {
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), []) || []

  const handleDelete = (task: Task) => {
    requestConfirm({
      title: 'Delete Task?',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Task',
      onConfirm: async () => {
        await deleteTask(task.id)
        showToast('Task deleted', 'info')
      },
    })
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl h-full">
      <h2 className="text-lg font-bold text-[#111827] tracking-tight mb-4">
        Today's Tasks ({tasks.length})
      </h2>

      <div className="flex flex-col divide-y divide-black/[0.04]">
        {tasks.map((task) => {
          const isDone = task.completed === 1

          return (
            <div
              key={task.id}
              className="flex items-center justify-between py-2.5 sm:py-3 px-1 rounded-xl hover:bg-neutral-50/80 transition-colors duration-150 select-none group"
            >
              {/* Left: Checkbox & Task Title */}
              <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-2 sm:mr-3">
                <Checkbox
                  checked={isDone}
                  onChange={() => toggleTaskCompleted(task.id, task.completed)}
                  ariaLabel={`Toggle ${task.title}`}
                />
                <span
                  onClick={() => toggleTaskCompleted(task.id, task.completed)}
                  className={cn(
                    'text-sm font-medium transition-all duration-150 truncate cursor-pointer',
                    isDone
                      ? 'text-[#6B7280] line-through decoration-neutral-400'
                      : 'text-[#111827] hover:text-neutral-900'
                  )}
                >
                  {task.title}
                </span>
              </div>

              {/* Right: Badge, Edit & Delete */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
                <Badge category={task.category} className="hidden xs:inline-flex" />

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => openEditTaskModal(task)}
                  title="Edit Task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4 stroke-[1.8]" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(task)}
                  title="Delete Task"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            </div>
          )
        })}

        {tasks.length === 0 && (
          <div className="py-12 text-center text-xs text-[#9CA3AF]">
            No tasks scheduled for today. Add one using Quick Add above.
          </div>
        )}
      </div>
    </Card>
  )
}
