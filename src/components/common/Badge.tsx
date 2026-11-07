import { memo, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { TaskCategory } from '@/db/db'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category?: TaskCategory
}

const CATEGORY_STYLES: Record<string, string> = {
  Study: 'bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 border-[#DBEAFE] dark:border-blue-900/50',
  Project: 'bg-[#F5F3FF] dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-400 border-[#EDE9FE] dark:border-purple-900/50',
  Exam: 'bg-[#FFF1F2] dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400 border-[#FFE4E6] dark:border-rose-900/50',
  Design: 'bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 border-[#FEF3C7] dark:border-amber-900/50',
  Learning: 'bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border-[#D1FAE5] dark:border-emerald-900/50',
  Personal: 'bg-[#FFF7ED] dark:bg-orange-950/40 text-[#EA580C] dark:text-orange-400 border-[#FFEDD5] dark:border-orange-900/50',
  Routine: 'bg-[#F8FAFC] dark:bg-slate-900/50 text-[#64748B] dark:text-slate-400 border-[#E2E8F0] dark:border-slate-800',
}

/**
 * Reusable Category Tag Badge
 * Tints with saturated text, crisp subtle border, rounded-full pill.
 */
export const Badge = memo(function Badge({ category = 'Study', className, children, ...props }: BadgeProps) {
  const style = CATEGORY_STYLES[category] || 'bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        style,
        className
      )}
      {...props}
    >
      {children || category}
    </span>
  )
})
