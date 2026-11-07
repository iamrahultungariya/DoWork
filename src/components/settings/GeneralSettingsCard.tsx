import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  User,
  Calendar,
  Globe,
  Target,
  CheckCircle2,
  Archive,
  List,
  LayoutGrid,
  Check,
} from 'lucide-react'
import { Card } from '@/components/common/Card'
import { CustomDropdown, type DropdownOption } from '@/components/common/CustomDropdown'
import { db } from '@/db/db'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'
import { useUIStore } from '@/stores/uiStore'

const START_OF_WEEK_OPTIONS: DropdownOption[] = [
  { id: 'Monday', label: 'Monday (Default)' },
  { id: 'Sunday', label: 'Sunday' },
  { id: 'Saturday', label: 'Saturday' },
]

const DATE_FORMAT_OPTIONS: DropdownOption[] = [
  { id: 'DD MMM, YYYY', label: '15 Nov 2026 (DD MMM, YYYY)' },
  { id: 'YYYY-MM-DD', label: '2026-11-15 (YYYY-MM-DD)' },
  { id: 'MM/DD/YYYY', label: '11/15/2026 (MM/DD/YYYY)' },
  { id: 'DD/MM/YYYY', label: '15/11/2026 (DD/MM/YYYY)' },
]

const TIME_FORMAT_OPTIONS: DropdownOption[] = [
  { id: '12-hour', label: '12-Hour (10:00 AM)' },
  { id: '24-hour', label: '24-Hour (22:00)' },
]

const LANGUAGE_OPTIONS: DropdownOption[] = [
  { id: 'English', label: 'English (US)' },
  { id: 'Spanish', label: 'Español' },
  { id: 'French', label: 'Français' },
  { id: 'German', label: 'Deutsch' },
  { id: 'Hindi', label: 'हिन्दी (Hindi)' },
]

export function GeneralSettingsCard() {
  const showToast = useUIStore((s) => s.showToast)
  const profile = useLiveQuery(() => db.userProfile.get('default-profile'), [])

  const [isEditingName, setIsEditingName] = useState(false)
  const [userName, setUserName] = useState('Rahul')
  const [startOfWeek, setStartOfWeek] = useState('Monday')
  const [dateFormat, setDateFormat] = useState('DD MMM, YYYY')
  const [timeFormat, setTimeFormat] = useState('12-hour')
  const [language, setLanguage] = useState('English')
  const [defaultTaskView, setDefaultTaskView] = useState<'list' | 'board'>('list')
  const [autoMarkDone, setAutoMarkDone] = useState(true)
  const [archiveCompleted, setArchiveCompleted] = useState(false)

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName || 'Rahul')
      setStartOfWeek(profile.startOfWeek || 'Monday')
      setDateFormat(profile.dateFormat || 'DD MMM, YYYY')
      setTimeFormat(profile.timeFormat || '12-hour')
      setLanguage(profile.language || 'English')
      setDefaultTaskView(profile.defaultTaskView || 'list')
      setAutoMarkDone(profile.autoMarkDone ?? true)
      setArchiveCompleted(profile.archiveCompleted ?? false)
    }
  }, [profile])

  const handleSaveName = async () => {
    if (!userName.trim()) return
    await db.userProfile.update('default-profile', { userName: userName.trim() })
    setIsEditingName(false)
    showToast('Profile name updated', 'success')
  }

  const handleToggleAutoMark = async () => {
    const next = !autoMarkDone
    setAutoMarkDone(next)
    await db.userProfile.update('default-profile', { autoMarkDone: next })
  }

  const handleToggleArchive = async () => {
    const next = !archiveCompleted
    setArchiveCompleted(next)
    await db.userProfile.update('default-profile', { archiveCompleted: next })
  }

  const handleUpdatePreference = async (field: string, value: unknown) => {
    await db.userProfile.update('default-profile', { [field]: value })
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative overflow-visible flex-1">
      {/* Header with Title and Mascot */}
      <div className="flex items-start justify-between pb-5 sm:pb-6 border-b border-black/[0.04] dark:border-white/[0.08] relative">
        <div className="z-10">
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">General</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">Basic preferences for your Personal Space.</p>
        </div>

        {/* Mascot in Top Right Corner */}
        <div className="hidden sm:block w-24 sm:w-32 h-16 sm:h-20 relative pointer-events-none -mt-4 -mr-2">
          <img
            src={cheerfulBoyImg}
            alt="Mascot"
            className="w-full h-full object-contain object-right drop-shadow-2xs dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)] select-none"
          />
        </div>
      </div>

      {/* Settings Rows */}
      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.08]">
        {/* 1. Profile Name */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div className="flex items-start space-x-3.5">
            <User className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Profile Name</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                Currently addressing you as: <strong className="text-[#111827] dark:text-[#F4F4F5]">{userName}</strong>
              </div>
            </div>
          </div>

          {isEditingName ? (
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-neutral-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white bg-white dark:bg-zinc-800 text-[#111827] dark:text-[#F4F4F5]"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#202024] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-2xs text-[#18181B] dark:text-[#F4F4F5] self-start sm:self-auto cursor-pointer"
            >
              <span>Edit Name</span>
            </button>
          )}
        </div>

        {/* 2. Start of Week */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div className="flex items-start space-x-3.5">
            <Calendar className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Start of Week</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">Choose which day your week starts on.</div>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <CustomDropdown
              value={startOfWeek}
              options={START_OF_WEEK_OPTIONS}
              onChange={(next) => {
                setStartOfWeek(next)
                handleUpdatePreference('startOfWeek', next)
              }}
              align="left"
            />
          </div>
        </div>

        {/* 3. Date & Time Format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div className="flex items-start space-x-3.5">
            <Calendar className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Date & Time Format</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">Set how date and time are displayed.</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <CustomDropdown
              value={dateFormat}
              options={DATE_FORMAT_OPTIONS}
              onChange={(next) => {
                setDateFormat(next)
                handleUpdatePreference('dateFormat', next)
              }}
              align="left"
            />
            <CustomDropdown
              value={timeFormat}
              options={TIME_FORMAT_OPTIONS}
              onChange={(next) => {
                setTimeFormat(next)
                handleUpdatePreference('timeFormat', next)
              }}
              align="left"
            />
          </div>
        </div>

        {/* 4. Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div className="flex items-start space-x-3.5">
            <Globe className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Language</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">Choose your preferred language.</div>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <CustomDropdown
              value={language}
              options={LANGUAGE_OPTIONS}
              onChange={(next) => {
                setLanguage(next)
                handleUpdatePreference('language', next)
              }}
              align="left"
            />
          </div>
        </div>

        {/* 5. Default Task View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3 select-none">
          <div className="flex items-start space-x-3.5">
            <Target className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Default Task View</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">Choose how you want to view tasks.</div>
            </div>
          </div>
          <div className="flex items-center p-1 bg-neutral-100/90 dark:bg-zinc-800/80 rounded-xl sm:rounded-2xl border border-black/[0.04] dark:border-white/[0.08] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setDefaultTaskView('list')
                handleUpdatePreference('defaultTaskView', 'list')
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                defaultTaskView === 'list'
                  ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs'
                  : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDefaultTaskView('board')
                handleUpdatePreference('defaultTaskView', 'board')
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                defaultTaskView === 'board'
                  ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] shadow-2xs'
                  : 'text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>
        </div>

        {/* 6. Auto Mark as Done */}
        <div className="flex items-center justify-between py-4 select-none">
          <div className="flex items-start space-x-3.5">
            <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Auto Mark as Done</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                Automatically complete tasks when all checkboxes are checked.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleAutoMark}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              autoMarkDone ? 'bg-[#18181B] dark:bg-emerald-600' : 'bg-neutral-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                autoMarkDone ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 7. Archive Completed Tasks */}
        <div className="flex items-center justify-between py-4 select-none">
          <div className="flex items-start space-x-3.5">
            <Archive className="w-4 h-4 text-neutral-500 dark:text-zinc-400 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Archive Completed Tasks</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                Move completed tasks to archive after 7 days.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleArchive}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              archiveCompleted ? 'bg-[#18181B] dark:bg-emerald-600' : 'bg-neutral-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                archiveCompleted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  )
}
