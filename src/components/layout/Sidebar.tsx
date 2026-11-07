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
  Cloud,
} from 'lucide-react'
import { useUIStore, type NavTabId } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import sleepingCatImg from '@/assets/sleeping-cat.png'

interface NavItem {
  id: NavTabId
  label: string
  icon: typeof Home
}

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
  const user = useAuthStore((s) => s.user)
  const openAuthModal = useAuthStore((s) => s.openAuthModal)

  return (
    <aside className="hidden md:flex md:w-64 h-screen sticky top-0 flex-col justify-between p-4 bg-[#F8F9FA] dark:bg-[#0F0F12] border-r border-black/[0.04] dark:border-white/[0.06] select-none shrink-0 transition-colors duration-150">
      {/* Top Workspace Selector & Navigation */}
      <div className="flex flex-col space-y-6">
        {/* Workspace Brand / Selector */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
              Personal Space
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] dark:text-zinc-500 cursor-pointer hover:text-[#18181B] dark:hover:text-white" />
        </div>

        {/* Primary Navigation Items with Squircle Styling */}
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
                  'relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'text-[#18181B] dark:text-white bg-[#E4E4E7]/80 dark:bg-zinc-800 shadow-2xs'
                    : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-zinc-800/50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B] dark:text-white' : 'text-[#6B7280] dark:text-[#A1A1AA]')} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-neutral-200/70 dark:border-white/[0.08] mx-1" />

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
                  'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'text-[#18181B] dark:text-white bg-[#E4E4E7]/80 dark:bg-zinc-800 shadow-2xs'
                    : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-zinc-800/50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B] dark:text-white' : 'text-[#6B7280] dark:text-[#A1A1AA]')} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Cloud Status & Bottom Sticker */}
      <div className="flex flex-col space-y-3">
        {/* Cloud Account Status Badge */}
        <div
          onClick={() => {
            if (!user) openAuthModal('login')
          }}
          className={cn(
            'flex items-center justify-between px-3.5 py-2.5 rounded-xl sm:rounded-2xl border text-xs transition-all cursor-pointer select-none',
            user
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-white dark:bg-[#18181B] border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs'
          )}
        >
          <div className="flex items-center space-x-2 min-w-0">
            <Cloud className={cn('w-4 h-4 shrink-0', user ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-zinc-500')} />
            <div className="truncate">
              <span className="font-bold block truncate">
                {user ? 'Cloud Synced' : isSupabaseConfigured() ? 'Cloud Ready' : 'Local Mode'}
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block truncate">
                {user?.email || 'Tap to sign in'}
              </span>
            </div>
          </div>
        </div>

        {/* Sleeping Cat Sticker */}
        <div className="relative pt-2 pb-1 px-1 flex flex-col items-start pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-[190px]"
          >
            <img
              src={sleepingCatImg}
              alt="Sleeping Cat Sticker"
              className="w-full h-auto object-contain drop-shadow-xs dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)]"
            />
          </motion.div>
        </div>
      </div>
    </aside>
  )
}
