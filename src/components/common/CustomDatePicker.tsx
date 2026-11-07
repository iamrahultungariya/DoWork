import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomDatePickerProps {
  value: string
  onChange: (dateStr: string) => void
  className?: string
  placeholder?: string
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CustomDatePicker({
  value,
  onChange,
  className,
  placeholder = 'Select due date...',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Memoize today once
  const today = useMemo(() => new Date(), [])

  // Parse initial date from value or fallback to today
  const parsedDate = useMemo(() => {
    if (!value || value === 'No date' || value === 'No due date') {
      return new Date()
    }
    const d = new Date(value)
    return isNaN(d.getTime()) ? new Date() : d
  }, [value])

  const [currentYear, setCurrentYear] = useState(() => parsedDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(() => parsedDate.getMonth())

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const isTodayDate = (year: number, month: number, day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!value || value === 'No date' || value === 'No due date') return false
    const parsed = new Date(value)
    if (isNaN(parsed.getTime())) return false
    return (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month &&
      parsed.getDate() === day
    )
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day)
    const monthShort = selected.toLocaleString('en-US', { month: 'short' })
    const formatted = `${day} ${monthShort} ${currentYear}`
    onChange(formatted)
    setIsOpen(false)
  }

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    const monthShort = today.toLocaleString('en-US', { month: 'short' })
    onChange(`${today.getDate()} ${monthShort} ${today.getFullYear()}`)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('No due date')
  }

  // Days calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  const prevMonthDays: number[] = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i)
  }

  const currentMonthDays: number[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i)
  }

  const totalCells = Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7
  const nextMonthDaysCount = totalCells - (prevMonthDays.length + currentMonthDays.length)
  const nextMonthDays: number[] = []
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i)
  }

  const hasValue = value && value !== 'No date' && value !== 'No due date'

  return (
    <div ref={containerRef} className={cn('w-full select-none', className)}>
      {/* 1. Sleek Single-Row Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl sm:rounded-2xl border bg-white dark:bg-[#18181B] text-left transition-all cursor-pointer shadow-2xs',
          isOpen
            ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/10'
            : 'border-neutral-200 dark:border-white/[0.1] hover:border-neutral-300 dark:hover:border-white/[0.2] hover:bg-neutral-50/50 dark:hover:bg-zinc-800/50'
        )}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-700 dark:text-zinc-200 shrink-0">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span
            className={cn(
              'text-xs font-semibold truncate',
              hasValue ? 'text-[#111827] dark:text-[#F4F4F5]' : 'text-neutral-400 dark:text-zinc-500'
            )}
          >
            {hasValue ? value : placeholder}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {hasValue && (
            <span
              onClick={handleClear}
              title="Clear date"
              className="p-1 rounded-md text-neutral-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-neutral-400 dark:text-zinc-500 transition-transform duration-200',
              isOpen && 'transform rotate-180 text-neutral-800 dark:text-zinc-200'
            )}
          />
        </div>
      </button>

      {/* 2. Dropdown Mini-Calendar (Attached directly below trigger & calendar icon) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 w-full bg-white dark:bg-[#202024] rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm dark:shadow-black/50 p-3 sm:p-3.5">
              {/* Header: Month & Year Navigator */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.05] dark:border-white/[0.08]">
                <span className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-6 h-6 rounded-lg border border-neutral-200 dark:border-white/[0.1] flex items-center justify-center text-neutral-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-6 h-6 rounded-lg border border-neutral-200 dark:border-white/[0.1] flex items-center justify-center text-neutral-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Weekdays Row */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {DAYS_OF_WEEK.map((day) => (
                  <span key={day} className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 py-0.5">
                    {day}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Previous Month Days */}
                {prevMonthDays.map((day, idx) => (
                  <span
                    key={`prev-${idx}`}
                    className="h-7 flex items-center justify-center text-[11px] font-medium text-neutral-300 dark:text-zinc-700 pointer-events-none"
                  >
                    {day}
                  </span>
                ))}

                {/* Current Month Days */}
                {currentMonthDays.map((day) => {
                  const isSelected = isSelectedDate(currentYear, currentMonth, day)
                  const isToday = isTodayDate(currentYear, currentMonth, day)

                  return (
                    <button
                      key={`curr-${day}`}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={cn(
                        'h-7 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all relative cursor-pointer',
                        isSelected
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs font-bold'
                          : 'text-[#1F2937] dark:text-[#E4E4E7] hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white',
                        !isSelected && isToday && 'ring-1.5 ring-neutral-900 dark:ring-white font-bold'
                      )}
                    >
                      <span>{day}</span>
                      {isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-neutral-900 dark:bg-white absolute bottom-0.5" />
                      )}
                    </button>
                  )
                })}

                {/* Next Month Days */}
                {nextMonthDays.map((day, idx) => (
                  <span
                    key={`next-${idx}`}
                    className="h-7 flex items-center justify-center text-[11px] font-medium text-neutral-300 dark:text-zinc-700 pointer-events-none"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-black/[0.05] dark:border-white/[0.08] text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectToday}
                  className="font-bold text-[#18181B] dark:text-[#F4F4F5] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Today</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300 font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
