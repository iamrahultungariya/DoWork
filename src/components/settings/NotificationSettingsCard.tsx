import { Bell, Volume2, VolumeX, Play, Check } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { sound } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface SoundOption {
  id: 'chime' | 'bell' | 'pop' | 'mute'
  label: string
  description: string
  isMute?: boolean
}

const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'chime',
    label: 'Chime (Harmonic)',
    description: 'Ascending harmonic chord, warm and inspiring',
  },
  {
    id: 'bell',
    label: 'Bell (Resonant)',
    description: 'Crisp high-frequency resonant bell ping',
  },
  {
    id: 'pop',
    label: 'Pop (Airy Bubble)',
    description: 'Short, tactile bubble pop sound',
  },
  {
    id: 'mute',
    label: 'Mute (Silent)',
    description: 'Visual alerts appear on screen without playing any audio',
    isMute: true,
  },
]

export function NotificationSettingsCard() {
  const notificationsEnabled = useUIStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = useUIStore((s) => s.setNotificationsEnabled)
  const notificationSound = useUIStore((s) => s.notificationSound)
  const setNotificationSound = useUIStore((s) => s.setNotificationSound)
  const showToast = useUIStore((s) => s.showToast)

  const handleTestNotification = () => {
    sound.playNotification(notificationSound)
    showToast(`Test alert (${notificationSound === 'mute' ? 'Silent' : notificationSound})`, 'info')
  }

  const handlePlaySound = (soundId: 'chime' | 'bell' | 'pop' | 'mute') => {
    if (soundId === 'chime') sound.playChime()
    else if (soundId === 'bell') sound.playBell()
    else if (soundId === 'pop') sound.playPop()
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Notifications</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Configure how and when TaskComp alerts you for tasks and reminders.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shadow-2xs">
          <Bell className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.08]">
        {/* 1. Master Toggle */}
        <div className="flex items-center justify-between py-5 select-none">
          <div className="flex items-start space-x-3.5">
            <Bell className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Allow Notifications</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                Receive on-screen alerts when tasks reach due dates or reminders.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              notificationsEnabled ? 'bg-[#18181B] dark:bg-emerald-600' : 'bg-neutral-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Notification Sound Selection */}
        <div className="py-5 select-none space-y-3">
          <div className="flex items-start space-x-3.5">
            <Volume2 className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Notification Sound</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                Choose an audio cue or select Mute for non-intrusive silent alerts.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {SOUND_OPTIONS.map((opt) => {
              const isSelected = notificationSound === opt.id
              return (
                <div
                  key={opt.id}
                  onClick={() => setNotificationSound(opt.id)}
                  className={cn(
                    'flex flex-col justify-between p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all',
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-900/5 dark:bg-white/5 ring-1 ring-neutral-900/10 dark:ring-white/10'
                      : 'border-neutral-200 dark:border-white/[0.1] hover:border-neutral-300 dark:hover:border-white/[0.2] bg-white dark:bg-[#202024]'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {opt.isMute ? (
                        <VolumeX className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-neutral-600 dark:text-zinc-300" />
                      )}
                      <span className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA] mt-1.5 leading-relaxed">
                    {opt.description}
                  </p>

                  {/* Test Sound button (for non-mute options) */}
                  {!opt.isMute ? (
                    <div className="mt-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlaySound(opt.id)
                        }}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Test tone</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[10px] font-semibold text-neutral-400 dark:text-zinc-500">
                        Zero sound, visual toast only
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Send Test Notification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div>
            <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Preview Notification</div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              Send a sample alert to verify your chosen sound and display.
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestNotification}
            className="px-4 py-2 text-xs font-bold rounded-xl sm:rounded-2xl bg-white dark:bg-[#202024] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs text-[#18181B] dark:text-[#F4F4F5] transition-colors self-start sm:self-auto cursor-pointer"
          >
            Send Test Alert
          </button>
        </div>
      </div>
    </Card>
  )
}
