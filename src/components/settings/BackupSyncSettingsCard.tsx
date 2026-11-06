import { useRef, type ChangeEvent } from 'react'
import { Cloud, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'
import { clearAllData } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'

export function BackupSyncSettingsCard() {
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Export JSON Data
  const handleExport = async () => {
    try {
      const tasks = await db.tasks.toArray()
      const projects = await db.projects.toArray()
      const scheduleItems = await db.scheduleItems.toArray()
      const userProfile = await db.userProfile.toArray()

      const exportData = {
        version: '0.2.1',
        exportedAt: new Date().toISOString(),
        tasks,
        projects,
        scheduleItems,
        userProfile,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `taskcomp_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      showToast('Backup JSON exported successfully', 'success')
    } catch {
      showToast('Failed to export backup', 'warning')
    }
  }

  // 2. Import JSON Data
  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.tasks && Array.isArray(data.tasks)) {
        await db.tasks.clear()
        await db.tasks.bulkAdd(data.tasks)
      }
      if (data.projects && Array.isArray(data.projects)) {
        await db.projects.clear()
        await db.projects.bulkAdd(data.projects)
      }
      if (data.scheduleItems && Array.isArray(data.scheduleItems)) {
        await db.scheduleItems.clear()
        await db.scheduleItems.bulkAdd(data.scheduleItems)
      }

      showToast('Data restored from backup successfully', 'success')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      showToast('Invalid backup JSON format', 'warning')
    }
  }

  // 3. Cloud Sync Click
  const handleCloudSync = () => {
    showToast('Cloud synchronization is coming in a future update', 'info')
  }

  // 4. Reset All App Data
  const handleResetData = () => {
    requestConfirm({
      title: 'Clear All App Data?',
      message: 'This will delete all tasks, projects, and custom schedule entries. This action cannot be undone.',
      confirmLabel: 'Clear All Data',
      onConfirm: async () => {
        await clearAllData()
        showToast('All app data has been cleared', 'info')
      },
    })
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] tracking-tight">Backup & Sync</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Export your tasks to JSON, restore backups, and manage future cloud synchronizations.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
          <Cloud className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04]">
        {/* 1. Local JSON Backup & Restore */}
        <div className="py-5 select-none space-y-4">
          <div>
            <div className="text-xs font-bold text-[#111827]">Local Data Management</div>
            <div className="text-[11px] text-[#6B7280]">
              Keep an offline copy of your entire task database on your computer.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-black/[0.08] hover:bg-neutral-50 shadow-2xs text-[#18181B] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span>Export JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-black/[0.08] hover:bg-neutral-50 shadow-2xs text-[#18181B] transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-600" />
              <span>Restore from JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* 2. Cloud Sync (Future Version Section) */}
        <div className="py-5 select-none space-y-3">
          <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2.5">
            <div>
              <div className="text-xs font-bold text-[#111827] flex items-center space-x-2">
                <span>Cloud Synchronization</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Coming in v0.3.0
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">
                Seamless multi-device synchronization via encrypted cloud storage.
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloudSync}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors self-start xs:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sync Status: Offline / Local Only</span>
            </span>
            <span className="font-semibold text-neutral-400">Last Synced: Never</span>
          </div>
        </div>

        {/* 3. Reset Zone */}
        <div className="py-5 select-none space-y-3">
          <div>
            <div className="text-xs font-bold text-rose-600">Danger Zone</div>
            <div className="text-[11px] text-[#6B7280]">
              Clear all tasks and projects to start completely from scratch.
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Clear All App Data</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
