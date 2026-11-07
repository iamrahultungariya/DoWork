import { useLiveQuery } from 'dexie-react-hooks'
import { BookOpen, Code, FileText, Utensils, Monitor, Plus } from 'lucide-react'
import { db, type ScheduleItem } from '@/db/db'
import { toggleScheduleCompleted } from '@/db/taskService'
import { Card } from '@/components/common/Card'
import { Checkbox } from '@/components/common/Checkbox'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function TodayScheduleCard() {
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)
  const scheduleItems = useLiveQuery(() => db.scheduleItems.orderBy('order').toArray(), [])

  const getIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'study':
        return <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
      case 'project':
        return <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      case 'exam':
        return <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
      case 'break':
        return <Utensils className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
      case 'design':
        return <Monitor className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const hasItems = scheduleItems && scheduleItems.length > 0

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-6 rounded-2xl h-full">
      <div>
        <h2 className="text-lg font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight mb-4 sm:mb-5">Today's Schedule</h2>

        {/* Timeline items list */}
        {hasItems ? (
          <div className="relative pl-1 sm:pl-6 space-y-3.5 sm:space-y-4">
            {/* Vertical connecting line */}
            <div className="absolute left-[54px] sm:left-[72px] top-4 bottom-4 w-px bg-neutral-200 dark:bg-zinc-800" />

            {scheduleItems.map((item) => {
              const isDone = item.completed === 1
              const isHighlight = item.type === 'study'
              const isBreak = item.type === 'break'

              return (
                <div key={item.id} className="relative flex items-center space-x-2 sm:space-x-4">
                  {/* Time Indicator & Bullet */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 w-12 sm:w-16">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-zinc-600 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] dark:text-[#A1A1AA]">{item.time}</span>
                  </div>

                  {/* Event Card */}
                  <div
                    className={cn(
                      'flex-1 flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-150 min-w-0',
                      isHighlight
                        ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 border-[#D1FAE5] dark:border-emerald-900/50'
                        : isBreak
                        ? 'bg-neutral-100/80 dark:bg-zinc-800/80 border-neutral-200/70 dark:border-white/[0.08]'
                        : 'bg-white dark:bg-[#202024] border-black/[0.06] dark:border-white/[0.08] shadow-2xs hover:bg-neutral-50/50 dark:hover:bg-zinc-800/60'
                    )}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="p-1 rounded-lg shrink-0">{getIcon(item.type)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5] truncate">{item.title}</div>
                        <div className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] dark:text-[#A1A1AA]">{item.duration}</div>
                      </div>
                    </div>

                    {!isBreak && (
                      <Checkbox
                        checked={isDone}
                        onChange={() => toggleScheduleCompleted(item.id, item.completed)}
                        ariaLabel={`Mark schedule ${item.title}`}
                        className="ml-2 shrink-0"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#9CA3AF] dark:text-zinc-500">
            No schedule items planned for today.
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="pt-5 mt-4 border-t border-black/[0.04] dark:border-white/[0.08] flex justify-center">
        <button
          type="button"
          onClick={() => setAddTaskModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/[0.1] text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5] bg-white dark:bg-[#18181B] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add to Schedule</span>
        </button>
      </div>
    </Card>
  )
}
