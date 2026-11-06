import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

/**
 * Reusable Card Primitive
 * Pure white canvas, crisp 1px border, subtle grounded shadow.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 transition-all duration-150',
          hoverEffect && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-[1px]',
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
