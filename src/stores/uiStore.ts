import { create } from 'zustand'
import { sound } from '@/lib/sound'
import { db, type Task } from '@/db/db'

export type ThemeMode = 'light' | 'dark' | 'system'

export function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#09090B')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#F8F9FA')
  }
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('taskcomp_theme') as ThemeMode
  if (saved === 'dark' || saved === 'light' || saved === 'system') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const FOCUS_STORAGE_KEY = 'taskcomp_focus_timer'

interface PersistedFocus {
  secondsLeft: number
  lastUpdated: number
  isRunning: boolean
}

function getInitialFocusTimer(): { secondsLeft: number; isRunning: boolean } {
  if (typeof window === 'undefined') return { secondsLeft: 25 * 60, isRunning: false }
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY)
    if (!raw) return { secondsLeft: 25 * 60, isRunning: false }
    const parsed: PersistedFocus = JSON.parse(raw)
    if (parsed.isRunning && parsed.lastUpdated) {
      const elapsed = Math.floor((Date.now() - parsed.lastUpdated) / 1000)
      const remaining = Math.max(0, parsed.secondsLeft - elapsed)
      return { secondsLeft: remaining, isRunning: remaining > 0 }
    }
    return { secondsLeft: parsed.secondsLeft ?? 25 * 60, isRunning: false }
  } catch {
    return { secondsLeft: 25 * 60, isRunning: false }
  }
}

function saveFocusTimer(secondsLeft: number, isRunning: boolean) {
  if (typeof window === 'undefined') return
  try {
    const payload: PersistedFocus = {
      secondsLeft,
      lastUpdated: Date.now(),
      isRunning,
    }
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage quota
  }
}

const initialFocus = getInitialFocusTimer()

export type NavTabId = 'home' | 'my-tasks' | 'today' | 'projects' | 'stats' | 'settings'

export type TaskFilterType = 'all' | 'today' | 'overdue' | 'todo' | 'in_progress' | 'done'
export type TaskSortType = 'priority' | 'date' | 'title'
export type ProjectFilterType = 'all' | 'active' | 'completed' | 'archived'

export interface ToastItem {
  id: string
  message: string
  type?: 'info' | 'success' | 'warning'
}

export interface ConfirmModalState {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
}

interface UIStoreState {
  activeTab: NavTabId
  isCommandPaletteOpen: boolean
  isAddTaskModalOpen: boolean
  isNewProjectModalOpen: boolean
  editingTask: Task | null
  soundEnabled: boolean
  volume: number
  searchQuery: string
  selectedCategory: string | null
  isMobileMenuOpen: boolean

  // Confirmation Modal State
  confirmModal: ConfirmModalState

  // Toasts
  toasts: ToastItem[]

  // Notification Preferences
  notificationsEnabled: boolean
  notificationSound: 'chime' | 'bell' | 'pop' | 'mute'

  // My Tasks Filters
  taskFilter: TaskFilterType
  taskSort: TaskSortType

  // Projects State
  projectFilter: ProjectFilterType

  // Stats State
  statsRange: string

  // Settings State
  activeSettingsTab: string
  theme: ThemeMode

  // Focus Timer State
  focusSecondsLeft: number
  isFocusRunning: boolean

  // Actions
  setActiveTab: (tab: NavTabId) => void
  setMobileMenuOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setAddTaskModalOpen: (open: boolean) => void
  openEditTaskModal: (task: Task) => void
  closeEditTaskModal: () => void
  setNewProjectModalOpen: (open: boolean) => void
  requestConfirm: (opts: {
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
  }) => void
  closeConfirm: () => void
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void
  removeToast: (id: string) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setNotificationSound: (sound: 'chime' | 'bell' | 'pop' | 'mute') => void
  toggleSound: () => void
  setVolume: (volume: number) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  setTaskFilter: (filter: TaskFilterType) => void
  setTaskSort: (sort: TaskSortType) => void
  setProjectFilter: (filter: ProjectFilterType) => void
  setStatsRange: (range: string) => void
  setActiveSettingsTab: (tab: string) => void
  setTheme: (theme: ThemeMode) => void
  startFocusTimer: () => void
  pauseFocusTimer: () => void
  resetFocusTimer: () => void
  tickFocusTimer: () => void
}

export const useUIStore = create<UIStoreState>((set, get) => ({
  activeTab: 'home', // Default view is Home
  isCommandPaletteOpen: false,
  isAddTaskModalOpen: false,
  isNewProjectModalOpen: false,
  editingTask: null,
  soundEnabled: true,
  volume: 0.35,
  searchQuery: '',
  selectedCategory: null,
  isMobileMenuOpen: false,

  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Delete',
    onConfirm: () => {},
  },

  toasts: [],

  notificationsEnabled: true,
  notificationSound: 'chime',

  taskFilter: 'all',
  taskSort: 'priority',
  projectFilter: 'all',
  statsRange: 'Last 7 Days',
  activeSettingsTab: 'general',
  theme: getInitialTheme(),

  focusSecondsLeft: initialFocus.secondsLeft,
  isFocusRunning: initialFocus.isRunning,

  setActiveTab: (tab) => {
    set({ activeTab: tab, isMobileMenuOpen: false })
  },

  setMobileMenuOpen: (open) => {
    if (open) sound.playOpen()
    else sound.playClose()
    set({ isMobileMenuOpen: open })
  },

  setCommandPaletteOpen: (open) => {
    if (open) sound.playOpen()
    else sound.playClose()
    set({ isCommandPaletteOpen: open })
  },

  setAddTaskModalOpen: (open) => {
    if (open) {
      sound.playOpen()
      set({ isAddTaskModalOpen: true, editingTask: null })
    } else {
      sound.playClose()
      set({ isAddTaskModalOpen: false, editingTask: null })
    }
  },

  openEditTaskModal: (task) => {
    sound.playOpen()
    set({ isAddTaskModalOpen: true, editingTask: task })
  },

  closeEditTaskModal: () => {
    sound.playClose()
    set({ isAddTaskModalOpen: false, editingTask: null })
  },

  setNewProjectModalOpen: (open) => {
    if (open) sound.playOpen()
    else sound.playClose()
    set({ isNewProjectModalOpen: open })
  },

  requestConfirm: ({ title, message, confirmLabel, onConfirm }) => {
    sound.playOpen()
    set({
      confirmModal: {
        isOpen: true,
        title,
        message,
        confirmLabel: confirmLabel || 'Delete',
        onConfirm,
      },
    })
  },

  closeConfirm: () => {
    sound.playClose()
    set((state) => ({
      confirmModal: { ...state.confirmModal, isOpen: false },
    }))
  },

  showToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      get().removeToast(id)
    }, 3200)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  setNotificationsEnabled: (enabled) => {
    set({ notificationsEnabled: enabled })
  },

  setNotificationSound: (notificationSound) => {
    sound.playNotification(notificationSound)
    set({ notificationSound })
  },

  toggleSound: () => {
    const next = !get().soundEnabled
    sound.setEnabled(next)
    set({ soundEnabled: next })
  },

  setVolume: (volume) => {
    sound.setVolume(volume)
    set({ volume })
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setSelectedCategory: (selectedCategory) => {
    sound.playClick()
    set({ selectedCategory })
  },

  setTaskFilter: (taskFilter) => {
    sound.playClick()
    set({ taskFilter })
  },

  setTaskSort: (taskSort) => {
    set({ taskSort })
  },

  setProjectFilter: (projectFilter) => {
    sound.playClick()
    set({ projectFilter })
  },

  setStatsRange: (statsRange) => {
    set({ statsRange })
  },

  setActiveSettingsTab: (activeSettingsTab) => {
    set({ activeSettingsTab })
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskcomp_theme', theme)
    }
    applyTheme(theme)
    set({ theme })
    db.userProfile.update('default-profile', { theme }).catch(() => {})
  },

  startFocusTimer: () => {
    sound.playAction()
    saveFocusTimer(get().focusSecondsLeft, true)
    set({ isFocusRunning: true })
  },

  pauseFocusTimer: () => {
    sound.playClick()
    saveFocusTimer(get().focusSecondsLeft, false)
    set({ isFocusRunning: false })
  },

  resetFocusTimer: () => {
    sound.playClick()
    saveFocusTimer(25 * 60, false)
    set({ focusSecondsLeft: 25 * 60, isFocusRunning: false })
  },

  tickFocusTimer: () => {
    const current = get().focusSecondsLeft
    if (current <= 1) {
      sound.playComplete()
      saveFocusTimer(25 * 60, false)
      set({ focusSecondsLeft: 25 * 60, isFocusRunning: false })
    } else {
      const next = current - 1
      // Save periodically to avoid excess writes
      if (next % 5 === 0) {
        saveFocusTimer(next, true)
      }
      set({ focusSecondsLeft: next })
    }
  },
}))

if (typeof window !== 'undefined') {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', () => {
    const current = useUIStore.getState().theme
    if (current === 'system') {
      applyTheme('system')
    }
  })
}
