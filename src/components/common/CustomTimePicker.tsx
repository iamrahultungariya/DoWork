import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomTimePickerProps {
  value: string
  onChange: (timeStr: string) => void
  className?: string
}

export function CustomTimePicker({ value, onChange, className }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Track which input is actively being edited by user to prevent external sync overwrites
  const editingFieldRef = useRef<'hours' | 'minutes' | 'seconds' | null>(null)

  // Local raw input string buffers for seamless typing, backspacing & clearing
  const [inputH, setInputH] = useState(String(initial.hours).padStart(2, '0'))
  const [inputM, setInputM] = useState(String(initial.minutes).padStart(2, '0'))
  const [inputS, setInputS] = useState(String(initial.seconds).padStart(2, '0'))

  // Synchronize when value changes externally (ignoring currently focused field)
  useEffect(() => {
    if (value) {
      const parsed = parseTime(value)
      setHours(parsed.hours)
      setMinutes(parsed.minutes)
      setSeconds(parsed.seconds)
      setPeriod(parsed.period)
      if (editingFieldRef.current !== 'hours') {
        setInputH(String(parsed.hours).padStart(2, '0'))
      }
      if (editingFieldRef.current !== 'minutes') {
        setInputM(String(parsed.minutes).padStart(2, '0'))
      }
      if (editingFieldRef.current !== 'seconds') {
        setInputS(String(parsed.seconds).padStart(2, '0'))
      }
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
    let next = hours + delta
    if (next > 12) next = 1
    if (next < 1) next = 12
    setHours(next)
    setInputH(String(next).padStart(2, '0'))
    notifyChange(next, minutes, seconds, period)
  }

  // Minutes step
  const stepMinutes = (delta: number) => {
    let next = minutes + delta
    if (next > 59) next = 0
    if (next < 0) next = 59
    setMinutes(next)
    setInputM(String(next).padStart(2, '0'))
    notifyChange(hours, next, seconds, period)
  }

  // Seconds step
  const stepSeconds = (delta: number) => {
    let next = seconds + delta
    if (next > 59) next = 0
    if (next < 0) next = 59
    setSeconds(next)
    setInputS(String(next).padStart(2, '0'))
    notifyChange(hours, minutes, next, period)
  }

  // Period toggle
  const togglePeriod = () => {
    const next = period === 'AM' ? 'PM' : 'AM'
    setPeriod(next)
    notifyChange(hours, minutes, seconds, next)
  }

  // --- Smooth, Natural Number Entry Handlers (No forced 0 prefix while typing) ---

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    editingFieldRef.current = 'hours'
    const raw = e.target.value.replace(/\D/g, '') // only digits allowed
    setInputH(raw)
    if (raw === '') {
      return
    }
    const val = parseInt(raw, 10)
    if (val >= 1 && val <= 12) {
      setHours(val)
      notifyChange(val, minutes, seconds, period)
    }
  }

  const handleHoursBlur = () => {
    editingFieldRef.current = null
    if (inputH === '' || isNaN(parseInt(inputH, 10))) {
      setInputH(String(hours).padStart(2, '0'))
      notifyChange(hours, minutes, seconds, period)
    } else {
      let val = parseInt(inputH, 10)
      if (val < 1) val = 1
      if (val > 12) val = 12
      setHours(val)
      setInputH(String(val).padStart(2, '0'))
      notifyChange(val, minutes, seconds, period)
    }
  }

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    editingFieldRef.current = 'minutes'
    const raw = e.target.value.replace(/\D/g, '')
    setInputM(raw)
    if (raw === '') {
      return
    }
    const val = parseInt(raw, 10)
    if (val >= 0 && val <= 59) {
      setMinutes(val)
      notifyChange(hours, val, seconds, period)
    }
  }

  const handleMinutesBlur = () => {
    editingFieldRef.current = null
    if (inputM === '' || isNaN(parseInt(inputM, 10))) {
      setInputM(String(minutes).padStart(2, '0'))
      notifyChange(hours, minutes, seconds, period)
    } else {
      let val = parseInt(inputM, 10)
      if (val < 0) val = 0
      if (val > 59) val = 59
      setMinutes(val)
      setInputM(String(val).padStart(2, '0'))
      notifyChange(hours, val, seconds, period)
    }
  }

  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    editingFieldRef.current = 'seconds'
    const raw = e.target.value.replace(/\D/g, '')
    setInputS(raw)
    if (raw === '') {
      return
    }
    const val = parseInt(raw, 10)
    if (val >= 0 && val <= 59) {
      setSeconds(val)
      notifyChange(hours, minutes, val, period)
    }
  }

  const handleSecondsBlur = () => {
    editingFieldRef.current = null
    if (inputS === '' || isNaN(parseInt(inputS, 10))) {
      setInputS(String(seconds).padStart(2, '0'))
      notifyChange(hours, minutes, seconds, period)
    } else {
      let val = parseInt(inputS, 10)
      if (val < 0) val = 0
      if (val > 59) val = 59
      setSeconds(val)
      setInputS(String(val).padStart(2, '0'))
      notifyChange(hours, minutes, val, period)
    }
  }

  // Keyboard Up/Down arrow step keys
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    stepFn: (delta: number) => void
  ) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      stepFn(1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      stepFn(-1)
    }
  }

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')
  const displayTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`

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
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#111827] dark:text-[#F4F4F5] truncate">
            {displayTime}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300">
            {period}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-neutral-400 dark:text-zinc-500 transition-transform duration-200',
              isOpen && 'transform rotate-180 text-neutral-800 dark:text-zinc-200'
            )}
          />
        </div>
      </button>

      {/* 2. Inline Accordion Time Picker (Never Clipped by Modal Overflow!) */}
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
              {/* Header info */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-black/[0.05] dark:border-white/[0.08]">
                <span className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Set Time</span>
                <span className="text-xs font-extrabold text-[#111827] dark:text-[#F4F4F5] bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">
                  {displayTime}
                </span>
              </div>

              {/* Columns Row */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 py-1">
                {/* Hours Column */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 mb-1">HH</span>
                  <button
                    type="button"
                    onClick={() => stepHours(1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={inputH}
                    onFocus={(e) => {
                      editingFieldRef.current = 'hours'
                      e.target.select()
                    }}
                    onChange={handleHoursChange}
                    onBlur={handleHoursBlur}
                    onKeyDown={(e) => handleKeyDown(e, stepHours)}
                    className="w-10 h-10 text-center text-lg font-extrabold text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:bg-neutral-100 dark:focus:bg-zinc-800 bg-transparent rounded-lg selection:bg-neutral-300 dark:selection:bg-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => stepHours(-1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-lg font-bold text-neutral-300 dark:text-zinc-700 mt-5">:</span>

                {/* Minutes Column */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 mb-1">MM</span>
                  <button
                    type="button"
                    onClick={() => stepMinutes(1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={inputM}
                    onFocus={(e) => {
                      editingFieldRef.current = 'minutes'
                      e.target.select()
                    }}
                    onChange={handleMinutesChange}
                    onBlur={handleMinutesBlur}
                    onKeyDown={(e) => handleKeyDown(e, stepMinutes)}
                    className="w-10 h-10 text-center text-lg font-extrabold text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:bg-neutral-100 dark:focus:bg-zinc-800 bg-transparent rounded-lg selection:bg-neutral-300 dark:selection:bg-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => stepMinutes(-1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-lg font-bold text-neutral-300 dark:text-zinc-700 mt-5">:</span>

                {/* Seconds Column */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 mb-1">SS</span>
                  <button
                    type="button"
                    onClick={() => stepSeconds(1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={inputS}
                    onFocus={(e) => {
                      editingFieldRef.current = 'seconds'
                      e.target.select()
                    }}
                    onChange={handleSecondsChange}
                    onBlur={handleSecondsBlur}
                    onKeyDown={(e) => handleKeyDown(e, stepSeconds)}
                    className="w-10 h-10 text-center text-lg font-extrabold text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:bg-neutral-100 dark:focus:bg-zinc-800 bg-transparent rounded-lg selection:bg-neutral-300 dark:selection:bg-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => stepSeconds(-1)}
                    className="w-10 h-7 rounded-lg bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* AM / PM Toggle */}
                <div className="flex flex-col items-center ml-1">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 mb-1">AM/PM</span>
                  <div className="flex flex-col space-y-1 mt-0.5">
                    <button
                      type="button"
                      onClick={togglePeriod}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        period === 'AM'
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs'
                          : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 hover:bg-neutral-200 dark:hover:bg-zinc-700'
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={togglePeriod}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        period === 'PM'
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs'
                          : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 hover:bg-neutral-200 dark:hover:bg-zinc-700'
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Done button */}
              <div className="pt-2.5 mt-2.5 border-t border-black/[0.05] dark:border-white/[0.08] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] rounded-xl text-xs font-semibold hover:bg-[#27272A] dark:hover:bg-neutral-100 transition-all cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
