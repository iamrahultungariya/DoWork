import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, Clock } from 'lucide-react'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface CustomTimePickerProps {
  value: string
  onChange: (timeStr: string) => void
  className?: string
}

export function CustomTimePicker({ value, onChange, className }: CustomTimePickerProps) {
  // Parse incoming value: expected format "HH:MM:SS AM" or fallback
  const parseTime = (str: string) => {
    const match = str.match(/^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      return {
        hours: Math.min(12, Math.max(1, parseInt(match[1]))),
        minutes: Math.min(59, Math.max(0, parseInt(match[2]))),
        seconds: Math.min(59, Math.max(0, parseInt(match[3]))),
        period: match[4].toUpperCase() as 'AM' | 'PM',
      }
    }

    // If it was in duration format like "45 min" or "1 hr 30 min"
    let totalMins = 30
    const hrMatch = str.match(/(\d+)\s*hr/i)
    const minMatch = str.match(/(\d+)\s*min/i)
    if (hrMatch || minMatch) {
      totalMins = (hrMatch ? parseInt(hrMatch[1]) * 60 : 0) + (minMatch ? parseInt(minMatch[1]) : 0)
    }
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    return {
      hours: h > 0 ? (h % 12 || 12) : 10,
      minutes: m,
      seconds: 0,
      period: (h >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    }
  }

  const initial = parseTime(value || '10:00:00 AM')
  const [hours, setHours] = useState(initial.hours)
  const [minutes, setMinutes] = useState(initial.minutes)
  const [seconds, setSeconds] = useState(initial.seconds)
  const [period, setPeriod] = useState<'AM' | 'PM'>(initial.period)

  // Synchronize when value changes externally
  useEffect(() => {
    if (value) {
      const parsed = parseTime(value)
      setHours(parsed.hours)
      setMinutes(parsed.minutes)
      setSeconds(parsed.seconds)
      setPeriod(parsed.period)
    }
  }, [value])

  const notifyChange = (h: number, m: number, s: number, p: 'AM' | 'PM') => {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const ss = String(s).padStart(2, '0')
    const formatted = `${hh}:${mm}:${ss} ${p}`
    onChange(formatted)
  }

  // Hours step
  const stepHours = (delta: number) => {
    sound.playClick()
    let next = hours + delta
    if (next > 12) next = 1
    if (next < 1) next = 12
    setHours(next)
    notifyChange(next, minutes, seconds, period)
  }

  // Minutes step
  const stepMinutes = (delta: number) => {
    sound.playClick()
    let next = minutes + delta
    if (next > 59) next = 0
    if (next < 0) next = 59
    setMinutes(next)
    notifyChange(hours, next, seconds, period)
  }

  // Seconds step
  const stepSeconds = (delta: number) => {
    sound.playClick()
    let next = seconds + delta
    if (next > 59) next = 0
    if (next < 0) next = 59
    setSeconds(next)
    notifyChange(hours, minutes, next, period)
  }

  // Period toggle
  const togglePeriod = () => {
    sound.playClick()
    const next = period === 'AM' ? 'PM' : 'AM'
    setPeriod(next)
    notifyChange(hours, minutes, seconds, next)
  }

  // Format display numbers
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-neutral-200/80 p-3 sm:p-4 shadow-xs select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.04]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#111827]">Estimated / Scheduled Time</span>
        </div>

        <span className="text-xs font-extrabold text-[#111827] bg-neutral-100 px-2.5 py-1 rounded-lg">
          {formattedHours}:{formattedMinutes}:{formattedSeconds} {period}
        </span>
      </div>

      {/* Time Picker Columns */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 py-1">
        {/* Hours Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-neutral-400 mb-1">HH</span>
          <button
            type="button"
            onClick={() => stepHours(1)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center text-lg font-extrabold text-[#111827]">
            {formattedHours}
          </div>
          <button
            type="button"
            onClick={() => stepHours(-1)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <span className="text-lg font-extrabold text-neutral-300 pb-1 self-center">:</span>

        {/* Minutes Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-neutral-400 mb-1">MM</span>
          <button
            type="button"
            onClick={() => stepMinutes(5)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center text-lg font-extrabold text-[#111827]">
            {formattedMinutes}
          </div>
          <button
            type="button"
            onClick={() => stepMinutes(-5)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <span className="text-lg font-extrabold text-neutral-300 pb-1 self-center">:</span>

        {/* Seconds Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-neutral-400 mb-1">SS</span>
          <button
            type="button"
            onClick={() => stepSeconds(10)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center text-lg font-extrabold text-[#111827]">
            {formattedSeconds}
          </div>
          <button
            type="button"
            onClick={() => stepSeconds(-10)}
            className="w-10 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* AM / PM Segmented Switch */}
        <div className="flex flex-col justify-center ml-2 space-y-1 self-center pt-3">
          <button
            type="button"
            onClick={() => {
              if (period !== 'AM') togglePeriod()
            }}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all',
              period === 'AM'
                ? 'bg-[#18181B] text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-500 hover:text-black'
            )}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => {
              if (period !== 'PM') togglePeriod()
            }}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all',
              period === 'PM'
                ? 'bg-[#18181B] text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-500 hover:text-black'
            )}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  )
}
