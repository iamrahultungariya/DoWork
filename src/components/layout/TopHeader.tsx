import { useState, useRef, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
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

  const { heading, subtitle: homeSubtitle } = getContextualGreeting(currentUserName)
  const dateFormatted = formatGreetingDate()

  let pageTitle = heading
  let pageSubtitle = homeSubtitle

  if (activeTab === 'today') {
    pageTitle = 'Today'
    pageSubtitle = `Your plan for ${dateFormatted}`
  } else if (activeTab === 'my-tasks') {
    pageTitle = 'My Tasks'
    pageSubtitle = 'Manage, organize and prioritize your task list.'
  } else if (activeTab === 'stats') {
    pageTitle = 'Analytics'
    pageSubtitle = 'Review task completion metrics and consistency.'
  } else if (activeTab === 'projects') {
    pageTitle = 'Projects'
    pageSubtitle = 'Organize initiatives into structured milestones.'
  } else if (activeTab === 'settings') {
    pageTitle = 'Settings'
    pageSubtitle = 'Configure workspace preferences and account settings.'
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
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2.5 -ml-1 rounded-xl text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col space-y-0.5 min-w-0">
          {activeTab === 'home' && (
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] tracking-wide truncate">
              {dateFormatted}
            </span>
          )}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F4F4F5] truncate">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A1A1AA] truncate hidden xs:block">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Center Date Indicator (for Today view) */}
      {activeTab === 'today' && (
        <div className="hidden lg:flex items-center space-x-2 bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] rounded-xl px-3 py-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-neutral-500 dark:text-zinc-400" />
          <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">{dateFormatted}</span>
        </div>
      )}

      {/* Right Controls: Theme, Sound, Search, Bell, Auth & Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkModeActive ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme mode"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isDarkModeActive ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-700" />
          )}
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute micro-audio' : 'Unmute micro-audio'}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
          )}
        </button>

        {/* Search / Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(!isCommandPaletteOpen)}
          title="Search (Ctrl + K)"
          aria-label="Open command palette"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={handleNotificationBellClick}
          title="Notification preferences"
          aria-label="Notification settings"
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Auth / User Profile Button */}
        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.08] shadow-2xs hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shrink-0 bg-neutral-100 dark:bg-zinc-800">
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
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] text-xs font-bold hover:bg-[#27272A] dark:hover:bg-neutral-100 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  )
}
