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
import { useUIStore } from '@/stores/uiStore'

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

  return (
    <MainLayout>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'today' && <TodayPage />}
      {activeTab === 'my-tasks' && <MyTasksPage />}
      {activeTab === 'stats' && <StatsPage />}
      {activeTab === 'projects' && <ProjectsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {/* Global Modals, Palette & Toasts */}
      <CommandPalette />
      <AddTaskModal />
      <NewProjectModal />
      <ConfirmationModal />
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
