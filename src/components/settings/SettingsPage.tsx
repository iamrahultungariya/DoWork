import { SettingsSidebar } from './SettingsSidebar'
import { GeneralSettingsCard } from './GeneralSettingsCard'
import { NotificationSettingsCard } from './NotificationSettingsCard'
import { AppearanceSettingsCard } from './AppearanceSettingsCard'
import { BackupSyncSettingsCard } from './BackupSyncSettingsCard'
import { AboutSettingsCard } from './AboutSettingsCard'
import { useUIStore } from '@/stores/uiStore'

export function SettingsPage() {
  const activeSettingsTab = useUIStore((s) => s.activeSettingsTab)

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* Left Sub-Navigation */}
      <SettingsSidebar />

      {/* Right Settings Content Card */}
      <div className="flex-1 w-full">
        {activeSettingsTab === 'general' && <GeneralSettingsCard />}
        {activeSettingsTab === 'notifications' && <NotificationSettingsCard />}
        {activeSettingsTab === 'appearance' && <AppearanceSettingsCard />}
        {activeSettingsTab === 'backup' && <BackupSyncSettingsCard />}
        {activeSettingsTab === 'about' && <AboutSettingsCard />}
      </div>
    </div>
  )
}
