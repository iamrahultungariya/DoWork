import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { sound } from '@/lib/sound'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disableSound?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      disableSound = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disableSound) {
        sound.playClick()
      }
      onClick?.(e)
    }

    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl sm:rounded-2xl border transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]'

    const variantStyles = {
      primary:
        'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] hover:bg-[#27272A] dark:hover:bg-neutral-100 border-transparent shadow-xs hover:shadow-sm',
      secondary:
        'bg-neutral-100 dark:bg-zinc-800 text-[#18181B] dark:text-[#F4F4F5] hover:bg-neutral-200/80 dark:hover:bg-zinc-700 border-black/[0.04] dark:border-white/[0.08] shadow-2xs',
      ghost:
        'bg-transparent text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 border-transparent',
      outline:
        'bg-white dark:bg-[#18181B] border-neutral-200/90 dark:border-white/[0.12] text-[#18181B] dark:text-[#F4F4F5] hover:bg-neutral-50 dark:hover:bg-zinc-800 hover:border-neutral-300 dark:hover:border-white/[0.2] shadow-2xs',
      danger:
        'bg-rose-600 dark:bg-rose-600 text-white hover:bg-rose-700 dark:hover:bg-rose-500 border-transparent shadow-xs',
    }

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-2 rounded-xl gap-1.5',
      md: 'text-sm px-4.5 py-2.5 rounded-xl sm:rounded-2xl gap-2',
      lg: 'text-base px-6 py-3 rounded-2xl gap-2.5',
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
