import { memo, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { TaskCategory } from '@/db/db'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category?: TaskCategory
}

const CATEGORY_STYLES: Record<string, string> = {
  Study: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
  Project: 'bg-[#F5F3FF] text-[#7C3AED] border-[#EDE9FE]',
  Exam: 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]',
  Design: 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]',
  Learning: 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]',
  Personal: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]',
  Routine: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
}

/**
 * Reusable Category Tag Badge
 * Tints with saturated text, crisp subtle border, rounded-full pill.
 */
export const Badge = memo(function Badge({ category = 'Study', className, children, ...props }: BadgeProps) {
  const style = CATEGORY_STYLES[category] || 'bg-neutral-100 text-neutral-700 border-neutral-200'

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
