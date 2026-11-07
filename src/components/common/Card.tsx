import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

/**
 * Reusable Card Primitive
 * Pure white canvas in light mode, obsidian surface (#18181B) in dark mode, crisp 1px borders.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-[#18181B] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none p-5 transition-all duration-150 text-[#111827] dark:text-[#F4F4F5]',
          hoverEffect && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:hover:border-white/[0.14] hover:-translate-y-[1px]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
