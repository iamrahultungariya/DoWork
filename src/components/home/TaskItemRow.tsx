import { memo } from 'react'
import { motion } from 'framer-motion'
import { Flag, Trash2, Pencil } from 'lucide-react'
import type { Task } from '@/db/db'
import { Checkbox } from '@/components/common/Checkbox'
import { Badge } from '@/components/common/Badge'
import { toggleTaskCompleted, toggleTaskFlagged, deleteTask } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

interface TaskItemRowProps {
  task: Task
}

export const TaskItemRow = memo(function TaskItemRow({ task }: TaskItemRowProps) {
  const openEditTaskModal = useUIStore((s) => s.openEditTaskModal)
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const isDone = task.completed === 1

  const handleDelete = () => {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="group flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-neutral-50/80 transition-colors duration-150 select-none"
    >
      {/* Left: Checkbox & Task Title */}
      <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-4">
        <Checkbox
          checked={isDone}
          onChange={() => toggleTaskCompleted(task.id, task.completed)}
          ariaLabel={`Mark "${task.title}" as ${isDone ? 'incomplete' : 'complete'}`}
        />
        <span
          className={cn(
            'text-sm font-medium transition-all duration-150 truncate cursor-pointer',
            isDone
              ? 'text-[#6B7280] line-through decoration-neutral-400'
              : 'text-[#111827] hover:text-neutral-900'
          )}
          onClick={() => toggleTaskCompleted(task.id, task.completed)}
        >
          {task.title}
        </span>
      </div>

      {/* Right: Category Badge & Edit & Flag & Delete */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        <Badge category={task.category} className="hidden xs:inline-flex" />

        {/* Flag Icon */}
        <button
          type="button"
          onClick={() => toggleTaskFlagged(task.id, task.flagged)}
          title={task.flagged ? 'High Priority' : 'Normal Priority'}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            task.flagged
              ? 'text-neutral-800 hover:text-black'
              : 'text-neutral-300 hover:text-neutral-500'
          )}
        >
          <Flag
            className={cn(
              'w-4 h-4 stroke-[1.8]',
              task.flagged && 'fill-neutral-800 text-neutral-800'
            )}
          />
        </button>

        {/* Edit Button (Visible on mobile/touch, reveals on hover on desktop) */}
        <button
          type="button"
          onClick={() => openEditTaskModal(task)}
          title="Edit Task"
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-opacity duration-150"
        >
          <Pencil className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Delete (Visible on mobile/touch, reveals on hover on desktop) */}
        <button
          type="button"
          onClick={handleDelete}
          title="Delete Task"
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-opacity duration-150"
        >
          <Trash2 className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </motion.div>
  )
})
