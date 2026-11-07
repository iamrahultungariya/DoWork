import {
  Home,
  CheckSquare,
  Calendar,
  Folder,
  BarChart2,
} from 'lucide-react'
import { useUIStore, type NavTabId } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  id: NavTabId
  label: string
  icon: typeof Home
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'my-tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
]

export function MobileBottomNav() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.5)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] select-none transition-colors duration-150"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 relative min-w-0',
                isActive
                  ? 'text-[#18181B] dark:text-white font-bold'
                  : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white font-medium'
              )}
            >
              <div
                className={cn(
                  'w-9 h-7 rounded-xl flex items-center justify-center transition-all duration-150',
                  isActive ? 'bg-[#E4E4E7]/90 dark:bg-zinc-800 text-[#18181B] dark:text-white' : 'text-[#6B7280] dark:text-[#A1A1AA]'
                )}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-[10px] mt-0.5 truncate tracking-tight">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
