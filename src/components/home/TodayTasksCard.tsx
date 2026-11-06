import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, ArrowRight } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { TaskItemRow } from './TaskItemRow'
import { useUIStore } from '@/stores/uiStore'
import { sound } from '@/lib/sound'

export function TodayTasksCard() {
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const [showAll, setShowAll] = useState(false)

  const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), [])

  const totalCount = tasks ? tasks.length : 0
  const doneCount = tasks ? tasks.filter((t) => t.completed === 1).length : 0

  // By default display the top 5 tasks just like the reference screenshot
  const displayTasks = tasks ? (showAll ? tasks : tasks.slice(0, 5)) : []

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <div>
        {/* Header: Title, Counts & Add Task Button */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
          <div>
            <h2 className="text-lg font-bold text-[#111827] tracking-tight">Today's Tasks</h2>
            <p className="text-xs font-medium text-[#6B7280] mt-0.5">
              {totalCount} tasks · {doneCount} done
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setAddTaskModalOpen(true)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#18181B] text-white hover:bg-neutral-800 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Task</span>
          </Button>
        </div>

        {/* Tasks List */}
        <div className="flex flex-col divide-y divide-black/[0.03] pt-2">
          {displayTasks.map((task) => (
            <TaskItemRow key={task.id} task={task} />
          ))}

          {displayTasks.length === 0 && (
            <div className="py-8 text-center text-xs text-[#9CA3AF]">
              No tasks found. Click "+ Add Task" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Footer: See All Tasks Toggle */}
      {totalCount > 5 && (
        <div className="pt-4 border-t border-black/[0.04] flex justify-center">
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              setShowAll(!showAll)
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#18181B] hover:text-neutral-600 transition-colors"
          >
            <span>{showAll ? 'Show Fewer Tasks' : 'See All Tasks'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Card>
  )
}
