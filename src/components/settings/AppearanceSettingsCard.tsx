import { Sun, Moon, Check, Sparkles } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore } from '@/stores/uiStore'
import { sound } from '@/lib/sound'

export function AppearanceSettingsCard() {
  const showToast = useUIStore((s) => s.showToast)

  const handleDarkModeClick = () => {
    sound.playClick()
    showToast('Dark mode is under development', 'info')
  }

  const handleLightModeClick = () => {
    sound.playClick()
    showToast('Light mode is active', 'success')
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] tracking-tight">Appearance</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Customize the visual presentation and theme of TaskComp.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="py-6 select-none space-y-4">
        <div>
          <h3 className="text-xs font-bold text-[#111827]">Interface Theme</h3>
          <p className="text-[11px] text-[#6B7280]">
            Choose between standard light aesthetic and dark mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* 1. Light Mode (Active) */}
          <div
            onClick={handleLightModeClick}
            className="flex flex-col justify-between p-4 rounded-2xl border-2 border-neutral-900 bg-white shadow-xs cursor-pointer relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <Sun className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">Light Mode</div>
                  <div className="text-[10px] text-[#6B7280]">Default warm paper theme</div>
                </div>
              </div>

              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
            </div>

            {/* Preview Mini Canvas */}
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5">
              <div className="h-2 w-16 bg-neutral-300 rounded-full" />
              <div className="h-1.5 w-full bg-neutral-200 rounded-full" />
              <div className="h-1.5 w-24 bg-neutral-200 rounded-full" />
            </div>
          </div>

          {/* 2. Dark Mode (Inactive / Under Development) */}
          <div
            onClick={handleDarkModeClick}
            className="flex flex-col justify-between p-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 hover:bg-neutral-100/70 transition-all cursor-pointer relative group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-500 flex items-center justify-center">
                  <Moon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 flex items-center space-x-1.5">
                    <span>Dark Mode</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Under Development
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Coming soon in v0.3.0</div>
                </div>
              </div>
            </div>

            {/* Preview Mini Canvas Dark */}
            <div className="mt-4 p-3 bg-neutral-800/80 rounded-xl border border-neutral-700/60 space-y-1.5 opacity-60 group-hover:opacity-80 transition-opacity">
              <div className="h-2 w-16 bg-neutral-600 rounded-full" />
              <div className="h-1.5 w-full bg-neutral-700 rounded-full" />
              <div className="h-1.5 w-24 bg-neutral-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
