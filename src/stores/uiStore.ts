import { create } from 'zustand'
import { sound } from '@/lib/sound'
import type { Task } from '@/db/db'

export type NavTabId = 'home' | 'my-tasks' | 'today' | 'projects' | 'stats' | 'settings'

export type TaskFilterType = 'all' | 'todo' | 'in_progress' | 'done'
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

  focusSecondsLeft: 25 * 60,
  isFocusRunning: false,

  setActiveTab: (tab) => {
    sound.playClick()
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
    sound.playClick()
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
    if (next) sound.playClick()
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
    sound.playClick()
    set({ taskSort })
  },

  setProjectFilter: (projectFilter) => {
    sound.playClick()
    set({ projectFilter })
  },

  setStatsRange: (statsRange) => {
    sound.playClick()
    set({ statsRange })
  },

  setActiveSettingsTab: (activeSettingsTab) => {
    sound.playClick()
    set({ activeSettingsTab })
  },

  startFocusTimer: () => {
    sound.playAction()
    set({ isFocusRunning: true })
  },

  pauseFocusTimer: () => {
    sound.playClick()
    set({ isFocusRunning: false })
  },

  resetFocusTimer: () => {
    sound.playClick()
    set({ focusSecondsLeft: 25 * 60, isFocusRunning: false })
  },

  tickFocusTimer: () => {
    const current = get().focusSecondsLeft
    if (current <= 1) {
      sound.playComplete()
      set({ focusSecondsLeft: 25 * 60, isFocusRunning: false })
    } else {
      set({ focusSecondsLeft: current - 1 })
    }
  },
}))
