import {
  Settings,
  Bell,
  Palette,
  Folder,
  Cloud,
  Info,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'backup', label: 'Backup & Sync', icon: Cloud },
  { id: 'about', label: 'About', icon: Info },
]

export function SettingsSidebar() {
  const activeSettingsTab = useUIStore((s) => s.activeSettingsTab)
  const setActiveSettingsTab = useUIStore((s) => s.setActiveSettingsTab)

  return (
    <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 lg:gap-0 lg:space-y-1 w-full lg:w-56 select-none shrink-0 no-scrollbar pb-1 lg:pb-0">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeSettingsTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSettingsTab(tab.id)}
            className={cn(
              'flex items-center space-x-2 lg:space-x-3 px-3 lg:px-3.5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-all duration-150 shrink-0 whitespace-nowrap',
              isActive
                ? 'text-[#18181B] font-semibold bg-[#E4E4E7]/80 shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-100/70'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B]' : 'text-neutral-500')} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
