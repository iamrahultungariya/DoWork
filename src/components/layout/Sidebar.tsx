import { motion } from 'framer-motion'
import {
  Home,
  CheckSquare,
  Calendar,
  Folder,
  BarChart2,
  Settings,
  Check,
  ChevronDown,
} from 'lucide-react'
import { useUIStore, type NavTabId } from '@/stores/uiStore'
import { cn } from '@/lib/utils'
import sleepingCatImg from '@/assets/sleeping-cat.png'

interface NavItem {
  id: NavTabId
  label: string
  icon: typeof Home
}

// Notice: "Upcoming" and "Focus" pages removed as requested by user
const PRIMARY_NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
]

const SECONDARY_NAV: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  return (
    <aside className="hidden md:flex md:w-64 h-screen sticky top-0 flex-col justify-between p-4 bg-[#F8F9FA] border-r border-black/[0.04] select-none shrink-0">
      {/* Top Workspace Selector & Navigation */}
      <div className="flex flex-col space-y-6">
        {/* Workspace Brand / Selector */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-[#18181B] text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#18181B]">
              Personal Space
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] cursor-pointer hover:text-[#18181B]" />
        </div>

        {/* Primary Navigation Items */}
        <nav className="flex flex-col space-y-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'relative flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'text-[#18181B] font-semibold bg-[#E4E4E7]/70 shadow-xs'
                    : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-100/80'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B]' : 'text-[#6B7280]')} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-neutral-200/70 mx-1" />

        {/* Secondary Navigation Items */}
        <nav className="flex flex-col space-y-1">
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'text-[#18181B] font-semibold bg-[#E4E4E7]/70'
                    : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-100/80'
                )}
              >
                <Icon className="w-4 h-4 text-[#6B7280]" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Sticker (Sleeping Cat with Potted Plant) */}
      <div className="relative pt-6 pb-2 px-1 flex flex-col items-start pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-[190px]"
        >
          <img
            src={sleepingCatImg}
            alt="Sleeping Cat Sticker"
            className="w-full h-auto object-contain drop-shadow-xs"
          />
        </motion.div>
      </div>
    </aside>
  )
}
