import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/components/home/HomePage'
import { TodayPage } from '@/components/today/TodayPage'
import { MyTasksPage } from '@/components/mytasks/MyTasksPage'
import { StatsPage } from '@/components/stats/StatsPage'
import { ProjectsPage } from '@/components/projects/ProjectsPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { CommandPalette } from '@/components/command/CommandPalette'
import { AddTaskModal } from '@/components/tasks/AddTaskModal'
import { NewProjectModal } from '@/components/projects/NewProjectModal'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { ToastContainer } from '@/components/common/ToastContainer'
import { AuthModal } from '@/components/auth/AuthModal'
import { useUIStore, applyTheme } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { db, seedInitialTasksIfEmpty } from '@/db/db'
import { recalculateAndPersistStreak } from '@/lib/streak'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

function AppContent() {
  const activeTab = useUIStore((s) => s.activeTab)

  useEffect(() => {
    seedInitialTasksIfEmpty()
      .then(() => recalculateAndPersistStreak())
      .then(() => {
        useAuthStore.getState().initialize()
        return db.userProfile.get('default-profile')
      })
      .then((profile) => {
        if (profile?.theme) {
          useUIStore.getState().setTheme(profile.theme)
        } else {
          applyTheme(useUIStore.getState().theme)
        }
      })
      .catch((err) => {
        console.warn('App initialization warning:', err)
        applyTheme(useUIStore.getState().theme)
      })
  }, [])

  return (
    <MainLayout>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'today' && <TodayPage />}
      {activeTab === 'my-tasks' && <MyTasksPage />}
      {activeTab === 'stats' && <StatsPage />}
      {activeTab === 'projects' && <ProjectsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {/* Global Modals, Palette, Auth & Toasts */}
      <CommandPalette />
      <AddTaskModal />
      <NewProjectModal />
      <ConfirmationModal />
      <AuthModal />
      <ToastContainer />
    </MainLayout>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
