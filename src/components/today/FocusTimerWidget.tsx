import { useEffect } from 'react'
import { Settings, Play, Pause, Square } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'

export function FocusTimerWidget() {
  const focusSecondsLeft = useUIStore((s) => s.focusSecondsLeft)
  const isFocusRunning = useUIStore((s) => s.isFocusRunning)
  const startFocusTimer = useUIStore((s) => s.startFocusTimer)
  const pauseFocusTimer = useUIStore((s) => s.pauseFocusTimer)
  const resetFocusTimer = useUIStore((s) => s.resetFocusTimer)
  const tickFocusTimer = useUIStore((s) => s.tickFocusTimer)

  // 1-second interval when running
  useEffect(() => {
    let timerId: number
    if (isFocusRunning) {
      timerId = window.setInterval(() => {
        tickFocusTimer()
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [isFocusRunning, tickFocusTimer])

  const minutes = Math.floor(focusSecondsLeft / 60)
  const seconds = focusSecondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <Card className="flex flex-col p-5 rounded-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-bold text-[#111827] tracking-tight">Focus Timer</h3>
        <button
          type="button"
          title="Timer Settings"
          className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Timer Display & Controls */}
      <div className="flex items-center justify-between py-3">
        {/* Left: Time & Subtitle */}
        <div>
          <div className="text-3xl font-extrabold text-[#111827] tracking-tight font-mono">
            {formattedTime}
          </div>
          <div className="text-xs font-semibold text-[#6B7280] mt-0.5">Focus</div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2">
          {/* Play / Pause Button */}
          <button
            type="button"
            onClick={isFocusRunning ? pauseFocusTimer : startFocusTimer}
            className="w-11 h-11 rounded-full bg-[#18181B] text-white flex items-center justify-center hover:bg-[#27272A] shadow-xs transition-transform active:scale-95"
            title={isFocusRunning ? 'Pause Focus' : 'Start Focus'}
          >
            {isFocusRunning ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Reset / Stop Button */}
          <button
            type="button"
            onClick={resetFocusTimer}
            className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 flex items-center justify-center border border-black/[0.04] transition-colors"
            title="Reset Timer"
          >
            <Square className="w-3.5 h-3.5 fill-neutral-700" />
          </button>
        </div>
      </div>
    </Card>
  )
}
