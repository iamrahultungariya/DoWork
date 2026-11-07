import { useState, useRef, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

export interface DropdownOption<T extends string = string> {
  id: T
  label: string
  icon?: ReactNode
  description?: string
}

interface CustomDropdownProps<T extends string = string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (val: T) => void
  prefixLabel?: string
  className?: string
  align?: 'left' | 'right'
  disableSound?: boolean
}

export function CustomDropdown<T extends string = string>({
  value,
  options,
  onChange,
  prefixLabel,
  className,
  align = 'left', // Default to left alignment so it extends rightward safely
  disableSound = true,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [effectiveAlign, setEffectiveAlign] = useState<'left' | 'right'>(align)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.id === value)

  // Dynamically ensure the menu never overflows the screen on either side
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceRight = window.innerWidth - rect.left
      const spaceLeft = rect.right

      if (spaceRight < 230 && spaceLeft >= 230) {
        setEffectiveAlign('right')
      } else if (spaceLeft < 230 && spaceRight >= 230) {
        setEffectiveAlign('left')
      } else {
        setEffectiveAlign(align)
      }
    }
  }, [isOpen, align])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const toggleOpen = () => {
    if (!disableSound) sound.playClick()
    setIsOpen(!isOpen)
  }

  const handleSelect = (id: T) => {
    if (!disableSound) sound.playClick()
    onChange(id)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      {/* Trigger Button with Squircle Radius & Comfortable Padding */}
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          'flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl sm:rounded-2xl bg-white dark:bg-[#18181B] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs text-[#18181B] dark:text-[#F4F4F5] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/15',
          isOpen && 'border-black/20 dark:border-white/20 ring-2 ring-neutral-900/10 dark:ring-white/10 bg-neutral-50/80 dark:bg-zinc-800/80',
          className
        )}
      >
        {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
        <span className="truncate">
          {prefixLabel ? `${prefixLabel}: ` : ''}
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 transition-transform duration-200 shrink-0',
            isOpen && 'transform rotate-180 text-neutral-700 dark:text-zinc-200'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={cn(
              'absolute mt-1.5 min-w-[210px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#202024] rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xl shadow-black/8 dark:shadow-black/50 p-1.5 z-50 overflow-hidden',
              effectiveAlign === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="flex flex-col space-y-0.5 max-h-64 overflow-y-auto">
              {options.map((opt) => {
                const isSelected = opt.id === value
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      'flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer',
                      isSelected
                        ? 'bg-neutral-100 dark:bg-zinc-800 text-[#18181B] dark:text-white font-bold shadow-2xs'
                        : 'text-[#4B5563] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800/60'
                    )}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <div className={cn(isSelected && 'text-[#111827] dark:text-white')}>{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-normal">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0 ml-2 stroke-[2.5]" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
