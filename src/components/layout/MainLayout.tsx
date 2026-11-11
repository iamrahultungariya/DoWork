import type { ReactNode } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'
import { MobileDrawer } from './MobileDrawer'
import { MobileBottomNav } from './MobileBottomNav'
import { LenisProvider } from './LenisProvider'
import { useUIStore } from '@/stores/uiStore'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const isCommandPaletteOpen = useUIStore((s) => s.isCommandPaletteOpen)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setAddTaskModalOpen = useUIStore((s) => s.setAddTaskModalOpen)

  // Global Keyboard Shortcuts
  useHotkeys('ctrl+k, meta+k', (e) => {
    e.preventDefault()
    setCommandPaletteOpen(!isCommandPaletteOpen)
  })

  useHotkeys('c, n', (e) => {
    // Only trigger if not typing inside an input or textarea
    const target = e.target as HTMLElement
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      setAddTaskModalOpen(true)
    }
  })

  return (
    <LenisProvider>
      <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#09090B] text-[#111827] dark:text-[#F4F4F5] font-sans antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-150">
        {/* Desktop Left Sidebar (hidden on mobile) */}
        <Sidebar />

        {/* Mobile Slide-over Drawer */}
        <MobileDrawer />

        {/* Right Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-16">
          <TopHeader />
          <main className="flex-1 px-3.5 xs:px-4 sm:px-6 md:px-8 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (hidden on desktop) */}
        <MobileBottomNav />
      </div>
    </LenisProvider>
  )
}
