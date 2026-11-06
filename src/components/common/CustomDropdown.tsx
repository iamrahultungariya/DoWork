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
}

export function CustomDropdown<T extends string = string>({
  value,
  options,
  onChange,
  prefixLabel,
  className,
  align = 'right',
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.id === value)

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
    sound.playClick()
    setIsOpen(!isOpen)
  }

  const handleSelect = (id: T) => {
    sound.playClick()
    onChange(id)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          'flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B] transition-all',
          isOpen && 'border-black/20 ring-2 ring-neutral-900/10',
          className
        )}
      >
        {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
        <span>
          {prefixLabel ? `${prefixLabel}: ` : ''}
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200',
            isOpen && 'transform rotate-180 text-neutral-700'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute mt-1.5 min-w-[180px] max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-black/[0.08] shadow-lg shadow-black/5 p-1 z-40',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="flex flex-col space-y-0.5">
              {options.map((opt) => {
                const isSelected = opt.id === value
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                      isSelected
                        ? 'bg-neutral-100 text-[#18181B] font-semibold'
                        : 'text-[#4B5563] hover:text-[#18181B] hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <div>{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-neutral-400 font-normal">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
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
