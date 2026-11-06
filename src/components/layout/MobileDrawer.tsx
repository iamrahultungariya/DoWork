import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  CheckSquare,
  Calendar,
  Folder,
  BarChart2,
  Settings,
  Check,
  X,
} from 'lucide-react'
import { useUIStore, type NavTabId } from '@/stores/uiStore'
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

export function MobileDrawer() {
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen)
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen)
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen, setMobileMenuOpen])

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-72 max-w-[85vw] h-full bg-[#F8F9FA] border-r border-black/[0.08] shadow-2xl p-5 flex flex-col justify-between z-10 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              {/* Header with Brand & Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-[#18181B] block leading-tight">
                      Personal Space
                    </span>
                    <span className="text-[10px] text-[#6B7280]">TaskComp v0.2.1</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Navigation */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2 block">
                  Workspace
                </span>
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
                          'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'text-[#18181B] font-semibold bg-[#E4E4E7]/80 shadow-2xs'
                            : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-200/40'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B]' : 'text-[#6B7280]')} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Secondary Navigation */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2 block">
                  Preferences
                </span>
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
                          'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'text-[#18181B] font-semibold bg-[#E4E4E7]/80 shadow-2xs'
                            : 'text-[#6B7280] hover:text-[#18181B] hover:bg-neutral-200/40'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', isActive ? 'text-[#18181B]' : 'text-[#6B7280]')} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom Mascot */}
            <div className="pt-6 pb-2 px-1 flex flex-col items-center pointer-events-none">
              <div className="w-full max-w-[150px]">
                <img
                  src={sleepingCatImg}
                  alt="Sleeping Cat Sticker"
                  className="w-full h-auto object-contain drop-shadow-xs"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
