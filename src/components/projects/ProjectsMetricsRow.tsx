import { useLiveQuery } from 'dexie-react-hooks'
import { Folder, Play, Check, Archive } from 'lucide-react'
import { db } from '@/db/db'
import { Card } from '@/components/common/Card'

export function ProjectsMetricsRow() {
  const projects = useLiveQuery(() => db.projects.toArray(), []) || []

  const total = projects.length
  const active = projects.filter((p) => p.status === 'active').length
  const completed = projects.filter((p) => p.status === 'completed').length
  const archived = projects.filter((p) => p.status === 'archived').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Projects */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-28 sm:h-32">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/60 dark:border-blue-900/40 shadow-2xs">
          <Folder className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F4F4F5] tracking-tight">{total}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">Total Projects</div>
        </div>
      </Card>

      {/* 2. Active */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-28 sm:h-32">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/60 dark:border-emerald-900/40 shadow-2xs">
          <Play className="w-4 h-4 stroke-[2.2] fill-emerald-600/20" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F4F4F5] tracking-tight">{active}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">Active</div>
        </div>
      </Card>

      {/* 3. Completed */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-28 sm:h-32">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100/60 dark:border-purple-900/40 shadow-2xs">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F4F4F5] tracking-tight">{completed}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">Completed</div>
        </div>
      </Card>

      {/* 4. Archived */}
      <Card className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl h-28 sm:h-32">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100/60 dark:border-amber-900/40 shadow-2xs">
          <Archive className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F4F4F5] tracking-tight">{archived}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">Archived</div>
        </div>
      </Card>
    </div>
  )
}
