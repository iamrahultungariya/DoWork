import { memo } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  ariaLabel?: string
}

export const Checkbox = memo(function Checkbox({
  checked,
  onChange,
  className,
  ariaLabel,
}: CheckboxProps) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel || 'Toggle task'}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1',
        checked
          ? 'bg-[#18181B] text-white border border-[#18181B]'
          : 'bg-white border-2 border-neutral-300 hover:border-neutral-400',
        className
      )}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.8]" />
        </motion.div>
      )}
    </motion.button>
  )
})
