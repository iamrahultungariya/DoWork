import { useRef, type ChangeEvent } from 'react'
import { Cloud, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, LogIn } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'
import { clearAllData, syncFromSupabase } from '@/db/taskService'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { isSupabaseConfigured } from '@/lib/supabase'

export function BackupSyncSettingsCard() {
  const requestConfirm = useUIStore((s) => s.requestConfirm)
  const showToast = useUIStore((s) => s.showToast)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const user = useAuthStore((s) => s.user)
  const openAuthModal = useAuthStore((s) => s.openAuthModal)

  // 1. Export JSON Data
  const handleExport = async () => {
    try {
      const tasks = await db.tasks.toArray()
      const projects = await db.projects.toArray()
      const scheduleItems = await db.scheduleItems.toArray()
      const userProfile = await db.userProfile.toArray()

      const exportData = {
        version: '0.2.2',
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
  const handleCloudSync = async () => {
    if (!isSupabaseConfigured()) {
      showToast('Set VITE_SUPABASE_URL & ANON_KEY in .env to enable Cloud Sync', 'warning')
      return
    }

    if (!user) {
      openAuthModal('login')
      return
    }

    try {
      await syncFromSupabase(user.id)
      showToast('Cloud database synchronized successfully', 'success')
    } catch {
      showToast('Failed to sync with cloud', 'warning')
    }
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
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative flex-1">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">Backup & Sync</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Export your tasks to JSON, restore backups, and manage Supabase cloud synchronizations.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-2xs">
          <Cloud className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.08]">
        {/* 1. Local JSON Backup & Restore */}
        <div className="py-5 select-none space-y-4">
          <div>
            <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Local Data Management</div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              Keep an offline copy of your entire task database on your computer.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#202024] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs text-[#18181B] dark:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
              <span>Export JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#202024] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs text-[#18181B] dark:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-neutral-600 dark:text-zinc-400" />
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

        {/* 2. Supabase Cloud Sync */}
        <div className="py-5 select-none space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5] flex items-center space-x-2">
                <span>Supabase Cloud Sync</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  user
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                    : isSupabaseConfigured()
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                }`}>
                  {user ? 'Connected' : isSupabaseConfigured() ? 'Ready for Login' : 'Offline / Standalone'}
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">
                {user
                  ? `Signed in as ${user.email}. Tasks sync automatically with PostgreSQL.`
                  : 'Sign in to sync your tasks across devices with encrypted cloud storage.'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloudSync}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] hover:bg-[#27272A] dark:hover:bg-neutral-100 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              {user ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Now</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs text-neutral-600 dark:text-zinc-300">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className={`w-4 h-4 ${user ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-zinc-500'}`} />
              <span>
                {user ? `Cloud Account: ${user.email}` : 'Sync Status: Local IndexedDB (Active)'}
              </span>
            </span>
            <span className="font-semibold text-neutral-400 dark:text-zinc-500">
              {user ? 'Auto-Sync On' : 'Offline Mode'}
            </span>
          </div>
        </div>

        {/* 3. Reset Zone */}
        <div className="py-5 select-none space-y-3">
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">Danger Zone</div>
            <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
              Clear all tasks and projects to start completely from scratch.
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
