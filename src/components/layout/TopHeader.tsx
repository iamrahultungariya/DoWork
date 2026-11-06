import { useLiveQuery } from 'dexie-react-hooks'
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { db } from '@/db/db'
import { formatGreetingDate, getContextualGreeting } from '@/lib/date'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'

export function TopHeader() {
  const isCommandPaletteOpen = useUIStore((s) => s.isCommandPaletteOpen)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen)
  const soundEnabled = useUIStore((s) => s.soundEnabled)
  const toggleSound = useUIStore((s) => s.toggleSound)
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const setActiveSettingsTab = useUIStore((s) => s.setActiveSettingsTab)

  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])
  const currentUserName = profile?.userName || 'Rahul'

  const { heading, emoji, subtitle: homeSubtitle } = getContextualGreeting(currentUserName)
  const dateFormatted = formatGreetingDate()

  let pageTitle = heading
  let pageSubtitle = homeSubtitle

  if (activeTab === 'today') {
    pageTitle = 'Today'
    pageSubtitle = `Your plan for ${dateFormatted}`
  } else if (activeTab === 'my-tasks') {
    pageTitle = 'My Tasks'
    pageSubtitle = 'Manage, organize and get things done.'
  } else if (activeTab === 'stats') {
    pageTitle = 'Stats'
    pageSubtitle = 'Track your progress and stay consistent.'
  } else if (activeTab === 'projects') {
    pageTitle = 'Projects'
    pageSubtitle = 'Plan big, break it down, and make progress.'
  } else if (activeTab === 'settings') {
    pageTitle = 'Settings'
    pageSubtitle = 'Customize your space, the way you work best.'
  }

  const handleNotificationBellClick = () => {
    setActiveTab('settings')
    setActiveSettingsTab('notifications')
  }

  const handleAvatarClick = () => {
    setActiveTab('settings')
    setActiveSettingsTab('general')
  }

  return (
    <header className="flex items-center justify-between w-full pt-4 pb-4 px-4 sm:px-6 md:px-8 md:pt-8 md:pb-6 select-none gap-3">
      {/* Left: Mobile Menu Toggle & Titles */}
      <div className="flex items-center space-x-3 min-w-0">
        {/* Hamburger Menu on Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-1 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-200/50 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col space-y-0.5 min-w-0">
          {activeTab === 'home' && (
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B7280] tracking-wide truncate">
              {dateFormatted}
            </span>
          )}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] flex items-center space-x-2 truncate">
            <span className="truncate">{pageTitle}</span>
            {activeTab === 'home' && (
              <span className="text-xl sm:text-2xl shrink-0" role="img" aria-label="plant">
                {emoji}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] truncate hidden xs:block">{pageSubtitle}</p>
        </div>
      </div>

      {/* Center Date Navigator (for Today view) */}
      {activeTab === 'today' && (
        <div className="hidden lg:flex items-center space-x-1.5 bg-white border border-black/[0.06] rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 px-2 text-xs font-bold text-[#18181B]">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{dateFormatted}</span>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Center Period Dropdown (for Stats view as in image 1) */}
      {activeTab === 'stats' && (
        <div className="hidden lg:flex items-center space-x-1.5 bg-white border border-black/[0.06] rounded-xl px-3 py-1.5 shadow-2xs cursor-pointer hover:bg-neutral-50 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-bold text-[#18181B]">Last 7 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </div>
      )}

      {/* Right: Sound, Search, Notification & Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute micro-audio' : 'Unmute micro-audio'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white border border-black/[0.06] text-[#6B7280] hover:text-[#111827] hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {/* Search / Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(!isCommandPaletteOpen)}
          title="Search (Ctrl + K)"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white border border-black/[0.06] text-[#6B7280] hover:text-[#111827] hover:bg-neutral-50 transition-colors shadow-2xs"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={handleNotificationBellClick}
          title="Notification Settings"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white border border-black/[0.06] text-[#6B7280] hover:text-[#111827] hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={handleAvatarClick}
          title={`Profile: ${currentUserName} (Click to open settings)`}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-black/[0.08] shadow-2xs cursor-pointer hover:ring-2 hover:ring-neutral-900 transition-all shrink-0"
        >
          <img
            src={cheerfulBoyImg}
            alt={`${currentUserName} Avatar`}
            className="w-full h-full object-cover scale-150 translate-y-1"
          />
        </div>
      </div>
    </header>
  )
}
