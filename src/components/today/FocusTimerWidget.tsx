import { useEffect } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'

export function FocusTimerWidget() {
  const focusSecondsLeft = useUIStore((s) => s.focusSecondsLeft)
  const isFocusRunning = useUIStore((s) => s.isFocusRunning)
  const startFocusTimer = useUIStore((s) => s.startFocusTimer)
  const pauseFocusTimer = useUIStore((s) => s.pauseFocusTimer)
  const resetFocusTimer = useUIStore((s) => s.resetFocusTimer)
  const tickFocusTimer = useUIStore((s) => s.tickFocusTimer)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isFocusRunning) {
      interval = setInterval(() => {
        tickFocusTimer()
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isFocusRunning, tickFocusTimer])

  const mins = Math.floor(focusSecondsLeft / 60)
  const secs = focusSecondsLeft % 60
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <Card className="flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F4F4F5] tabular-nums">
            {timeFormatted}
          </div>
          <div className="text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">Focus Session</div>
        </div>

        {/* Right: Controls with Squircle Buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Play / Pause Button */}
          <button
            type="button"
            onClick={isFocusRunning ? pauseFocusTimer : startFocusTimer}
            className="w-11 h-11 rounded-xl sm:rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center hover:bg-[#27272A] dark:hover:bg-neutral-100 shadow-xs transition-transform active:scale-95 cursor-pointer"
            title={isFocusRunning ? 'Pause Focus' : 'Start Focus'}
          >
            {isFocusRunning ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Reset / Stop Button */}
          <button
            type="button"
            onClick={resetFocusTimer}
            className="w-11 h-11 rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-200 hover:bg-neutral-200 dark:hover:bg-zinc-700 flex items-center justify-center border border-black/[0.04] dark:border-white/[0.08] transition-all cursor-pointer active:scale-95"
            title="Reset Timer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>
    </Card>
  )
}
