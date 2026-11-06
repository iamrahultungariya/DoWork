import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface CustomDatePickerProps {
  value: string
  onChange: (dateStr: string) => void
  className?: string
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

export function CustomDatePicker({ value, onChange, className }: CustomDatePickerProps) {
  const today = useMemo(() => new Date(), [])

  // Parse initial date from value or fallback to today
  const initialDate = useMemo(() => {
    if (!value || value === 'No date' || value === 'No due date') {
      return new Date()
    }
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? new Date() : parsed
  }, [value])

  const [currentYear, setCurrentYear] = useState(() => initialDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(() => initialDate.getMonth())
  const isTodayDate = (year: number, month: number, day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!value || value === 'No date') return false
    const parsed = new Date(value)
    if (isNaN(parsed.getTime())) return false
    return (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month &&
      parsed.getDate() === day
    )
  }

  const handlePrevMonth = () => {
    sound.playClick()
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    sound.playClick()
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    sound.playClick()
    const selected = new Date(currentYear, currentMonth, day)
    // Format nicely: e.g. "15 Nov 2026"
    const monthShort = selected.toLocaleString('en-US', { month: 'short' })
    const formatted = `${day} ${monthShort} ${currentYear}`
    onChange(formatted)
  }

  const handleSelectToday = () => {
    sound.playClick()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    const monthShort = today.toLocaleString('en-US', { month: 'short' })
    onChange(`${today.getDate()} ${monthShort} ${today.getFullYear()}`)
  }

  const handleClear = () => {
    sound.playClick()
    onChange('No date')
  }

  // Days calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Trailing days from previous month
  const prevMonthDays = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i)
  }

  // Days in current month
  const currentMonthDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i)
  }

  // Leading days into next month to complete the grid (up to 35 or 42 cells)
  const totalCells = Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7
  const nextMonthDaysCount = totalCells - (prevMonthDays.length + currentMonthDays.length)
  const nextMonthDays = []
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i)
  }

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-neutral-200/80 p-3 sm:p-4 shadow-xs select-none',
        className
      )}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.04]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#111827]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            title="Previous Month"
            className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            title="Next Month"
            className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <span key={day} className="text-[10px] font-bold text-neutral-400 py-1">
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
            className="h-8 flex items-center justify-center text-xs font-medium text-neutral-300 pointer-events-none"
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
                'h-8 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all relative',
                isSelected
                  ? 'bg-[#18181B] text-white shadow-2xs font-bold'
                  : 'text-[#1F2937] hover:bg-neutral-100 hover:text-black',
                !isSelected && isToday && 'ring-1.5 ring-neutral-900 font-bold'
              )}
            >
              <span>{day}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-neutral-900 absolute bottom-1" />
              )}
            </button>
          )
        })}

        {/* Next Month Days */}
        {nextMonthDays.map((day, idx) => (
          <span
            key={`next-${idx}`}
            className="h-8 flex items-center justify-center text-xs font-medium text-neutral-300 pointer-events-none"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Footer Quick Controls */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/[0.04] text-[11px]">
        <button
          type="button"
          onClick={handleSelectToday}
          className="font-bold text-[#18181B] hover:underline flex items-center space-x-1"
        >
          <span>Jump to Today</span>
        </button>

        <div className="flex items-center space-x-2">
          {value && value !== 'No date' && (
            <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
              {value}
            </span>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-700 font-medium flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
