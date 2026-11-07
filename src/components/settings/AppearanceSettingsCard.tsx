import { Sun, Moon, Monitor, Check, Sparkles } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { useUIStore, type ThemeMode } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AppearanceSettingsCard() {
  const showToast = useUIStore((s) => s.showToast)
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const handleThemeChange = (mode: ThemeMode, label: string) => {
    setTheme(mode)
    showToast(`${label} is active`, 'success')
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Appearance</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Customize the visual presentation and theme of TaskComp.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-800/50 shadow-2xs">
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="py-6 select-none space-y-4">
        <div>
          <h3 className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Interface Theme</h3>
          <p className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
            Choose between standard light aesthetic, studio obsidian dark mode, or system sync.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* 1. Light Mode */}
          <div
            onClick={() => handleThemeChange('light', 'Light Mode')}
            className={cn(
              'flex flex-col justify-between p-4.5 rounded-2xl sm:rounded-3xl transition-all cursor-pointer relative',
              theme === 'light'
                ? 'border-2 border-neutral-900 dark:border-white bg-white dark:bg-[#18181B] shadow-xs'
                : 'border border-neutral-200 dark:border-white/[0.1] bg-white/70 dark:bg-zinc-900/40 hover:border-neutral-400 dark:hover:border-white/[0.2]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-900/40">
                  <Sun className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Light</div>
                  <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">Warm paper</div>
                </div>
              </div>

              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
              )}
            </div>

            {/* Preview Mini Canvas Light */}
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5">
              <div className="h-2 w-14 bg-neutral-300 rounded-full" />
              <div className="h-1.5 w-full bg-neutral-200 rounded-full" />
              <div className="h-1.5 w-20 bg-neutral-200 rounded-full" />
            </div>
          </div>

          {/* 2. Dark Mode */}
          <div
            onClick={() => handleThemeChange('dark', 'Dark Mode')}
            className={cn(
              'flex flex-col justify-between p-4.5 rounded-2xl sm:rounded-3xl transition-all cursor-pointer relative',
              theme === 'dark'
                ? 'border-2 border-neutral-900 dark:border-white bg-white dark:bg-[#18181B] shadow-xs'
                : 'border border-neutral-200 dark:border-white/[0.1] bg-white/70 dark:bg-zinc-900/40 hover:border-neutral-400 dark:hover:border-white/[0.2]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/50 dark:border-purple-900/40">
                  <Moon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Dark</div>
                  <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">Studio obsidian</div>
                </div>
              </div>

              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
              )}
            </div>

            {/* Preview Mini Canvas Dark */}
            <div className="mt-4 p-3 bg-[#09090B] rounded-xl border border-white/[0.1] space-y-1.5">
              <div className="h-2 w-14 bg-zinc-700 rounded-full" />
              <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
              <div className="h-1.5 w-20 bg-zinc-800 rounded-full" />
            </div>
          </div>

          {/* 3. System Sync */}
          <div
            onClick={() => handleThemeChange('system', 'System Sync')}
            className={cn(
              'flex flex-col justify-between p-4.5 rounded-2xl sm:rounded-3xl transition-all cursor-pointer relative',
              theme === 'system'
                ? 'border-2 border-neutral-900 dark:border-white bg-white dark:bg-[#18181B] shadow-xs'
                : 'border border-neutral-200 dark:border-white/[0.1] bg-white/70 dark:bg-zinc-900/40 hover:border-neutral-400 dark:hover:border-white/[0.2]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/50 dark:border-blue-900/40">
                  <Monitor className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">System</div>
                  <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">Follow device</div>
                </div>
              </div>

              {theme === 'system' && (
                <span className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
              )}
            </div>

            {/* Preview Mini Canvas Dual Split */}
            <div className="mt-4 p-3 bg-gradient-to-r from-neutral-100 to-[#09090B] rounded-xl border border-neutral-200 dark:border-white/[0.1] space-y-1.5">
              <div className="h-2 w-14 bg-neutral-400 dark:bg-zinc-600 rounded-full" />
              <div className="h-1.5 w-full bg-neutral-300 dark:bg-zinc-700 rounded-full" />
              <div className="h-1.5 w-20 bg-neutral-300 dark:bg-zinc-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
