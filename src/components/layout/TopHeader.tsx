import { useState, useRef, useEffect } from 'react'
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
  LogIn,
  LogOut,
  User,
  Sun,
  Moon,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
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
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const user = useAuthStore((s) => s.user)
  const openAuthModal = useAuthStore((s) => s.openAuthModal)
  const signOut = useAuthStore((s) => s.signOut)

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])
  const currentUserName = user?.user_metadata?.full_name || profile?.userName || 'Rahul'

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

  const isDarkModeActive =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    setTheme(isDarkModeActive ? 'light' : 'dark')
  }

  return (
    <header className="flex items-center justify-between w-full pt-4 pb-4 px-4 sm:px-6 md:px-8 md:pt-8 md:pb-6 select-none gap-3">
      {/* Left: Mobile Menu Toggle & Titles */}
      <div className="flex items-center space-x-3 min-w-0">
        {/* Hamburger Menu on Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2.5 -ml-1 rounded-xl text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col space-y-0.5 min-w-0">
          {activeTab === 'home' && (
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] tracking-wide truncate">
              {dateFormatted}
            </span>
          )}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F4F4F5] flex items-center space-x-2 truncate">
            <span className="truncate">{pageTitle}</span>
            {activeTab === 'home' && (
              <span className="text-xl sm:text-2xl shrink-0" role="img" aria-label="plant">
                {emoji}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A1A1AA] truncate hidden xs:block">{pageSubtitle}</p>
        </div>
      </div>

      {/* Center Date Navigator (for Today view) */}
      {activeTab === 'today' && (
        <div className="hidden lg:flex items-center space-x-1.5 bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] rounded-xl sm:rounded-2xl p-1.5 shadow-2xs">
          <button
            type="button"
            className="p-1.5 rounded-lg sm:rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 px-2.5 text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
            <Calendar className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
            <span>{dateFormatted}</span>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg sm:rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right Controls: Theme, Sound, Search, Bell, Auth & Avatar with Squircle Styling */}
      <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkModeActive ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          {isDarkModeActive ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-700" />
          )}
        </button>

        {/* Sound Toggle (Squircle) */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute micro-audio' : 'Unmute micro-audio'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
          )}
        </button>

        {/* Search / Command Palette Trigger (Squircle) */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(!isCommandPaletteOpen)}
          title="Search (Ctrl + K)"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Bell (Squircle) */}
        <button
          type="button"
          onClick={handleNotificationBellClick}
          title="Notification Settings"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#18181B]" />
        </button>

        {/* Auth / User Profile Button */}
        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl sm:rounded-2xl bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] shadow-2xs hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shrink-0 bg-neutral-100 dark:bg-zinc-800">
                <img
                  src={cheerfulBoyImg}
                  alt={currentUserName}
                  className="w-full h-full object-cover scale-150 translate-y-1"
                />
              </div>
              <span className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5] hidden md:inline max-w-[100px] truncate">
                {currentUserName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#202024] rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xl p-1.5 z-50">
                <div className="px-3 py-2 border-b border-black/[0.04] dark:border-white/[0.06]">
                  <p className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5] truncate">{currentUserName}</p>
                  <p className="text-[10px] text-neutral-400 dark:text-zinc-500 truncate">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    setActiveTab('settings')
                    setActiveSettingsTab('general')
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Account Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    signOut()
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] text-xs font-bold hover:bg-[#27272A] dark:hover:bg-neutral-100 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  )
}
