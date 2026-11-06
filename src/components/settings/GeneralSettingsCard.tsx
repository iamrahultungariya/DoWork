import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  User,
  Calendar,
  Globe,
  Target,
  CheckCircle2,
  Archive,
  ChevronDown,
  List,
  LayoutGrid,
  Check,
} from 'lucide-react'
import { Card } from '@/components/common/Card'
import { db } from '@/db/db'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'
import { sound } from '@/lib/sound'
import { useUIStore } from '@/stores/uiStore'

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
    sound.playClick()
    showToast('Profile name updated', 'success')
  }

  const handleToggleAutoMark = async () => {
    sound.playClick()
    const next = !autoMarkDone
    setAutoMarkDone(next)
    await db.userProfile.update('default-profile', { autoMarkDone: next })
  }

  const handleToggleArchive = async () => {
    sound.playClick()
    const next = !archiveCompleted
    setArchiveCompleted(next)
    await db.userProfile.update('default-profile', { archiveCompleted: next })
  }

  const handleUpdatePreference = async (field: string, value: unknown) => {
    sound.playClick()
    await db.userProfile.update('default-profile', { [field]: value })
  }

  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl relative overflow-hidden flex-1">
      {/* Header with Title and Mascot */}
      <div className="flex items-start justify-between pb-5 sm:pb-6 border-b border-black/[0.04] relative">
        <div className="z-10">
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">General</h2>
          <p className="text-xs text-[#6B7280] mt-1">Basic preferences for your Personal Space.</p>
        </div>

        {/* Mascot in Top Right Corner */}
        <div className="hidden xs:block w-24 sm:w-32 h-16 sm:h-20 relative pointer-events-none -mt-4 -mr-2">
          <img
            src={cheerfulBoyImg}
            alt="Mascot"
            className="w-full h-full object-contain object-right drop-shadow-2xs select-none"
          />
        </div>
      </div>

      {/* Settings Rows */}
      <div className="flex flex-col divide-y divide-black/[0.04]">
        {/* 1. Profile Name */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between py-3.5 sm:py-4 gap-2.5 sm:gap-4 select-none">
          <div className="flex items-start space-x-3.5">
            <User className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Profile Name</div>
              <div className="text-[11px] text-[#6B7280]">
                Currently addressing you as: <strong>{userName}</strong>
              </div>
            </div>
          </div>

          {isEditingName ? (
            <div className="flex items-center space-x-2 self-start xs:self-auto">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1.5 rounded-lg bg-neutral-900 text-white text-xs hover:bg-neutral-800"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B] self-start xs:self-auto"
            >
              <span>Edit Name</span>
            </button>
          )}
        </div>

        {/* 2. Start of Week */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between py-3.5 sm:py-4 gap-2.5 sm:gap-4 select-none">
          <div className="flex items-start space-x-3.5">
            <Calendar className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Start of Week</div>
              <div className="text-[11px] text-[#6B7280]">Choose which day your week starts on.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = startOfWeek === 'Monday' ? 'Sunday' : 'Monday'
              setStartOfWeek(next)
              handleUpdatePreference('startOfWeek', next)
            }}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B] self-start xs:self-auto"
          >
            <span>{startOfWeek}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* 3. Date & Time Format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 sm:py-4 gap-2.5 sm:gap-4 select-none">
          <div className="flex items-start space-x-3.5">
            <Calendar className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Date & Time Format</div>
              <div className="text-[11px] text-[#6B7280]">Set how date and time are displayed.</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                const next = dateFormat === 'DD MMM, YYYY' ? 'YYYY-MM-DD' : 'DD MMM, YYYY'
                setDateFormat(next)
                handleUpdatePreference('dateFormat', next)
              }}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B]"
            >
              <span>{dateFormat}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                const next = timeFormat === '12-hour' ? '24-hour' : '12-hour'
                setTimeFormat(next)
                handleUpdatePreference('timeFormat', next)
              }}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B]"
            >
              <span>{timeFormat}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* 4. Language */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between py-3.5 sm:py-4 gap-2.5 sm:gap-4 select-none">
          <div className="flex items-start space-x-3.5">
            <Globe className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Language</div>
              <div className="text-[11px] text-[#6B7280]">Choose your preferred language.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = language === 'English' ? 'Spanish' : 'English'
              setLanguage(next)
              handleUpdatePreference('language', next)
            }}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-black/[0.06] hover:bg-neutral-50 shadow-2xs text-[#18181B] self-start xs:self-auto"
          >
            <span>{language}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* 5. Default Task View */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between py-3.5 sm:py-4 gap-2.5 sm:gap-4 select-none">
          <div className="flex items-start space-x-3.5">
            <Target className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Default Task View</div>
              <div className="text-[11px] text-[#6B7280]">Choose how you want to view tasks.</div>
            </div>
          </div>
          <div className="flex items-center p-0.5 bg-neutral-100 rounded-xl border border-black/[0.04] self-start xs:self-auto">
            <button
              type="button"
              onClick={() => {
                setDefaultTaskView('list')
                handleUpdatePreference('defaultTaskView', 'list')
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                defaultTaskView === 'list'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#18181B]'
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
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                defaultTaskView === 'board'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#18181B]'
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
            <CheckCircle2 className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Auto Mark as Done</div>
              <div className="text-[11px] text-[#6B7280]">
                Automatically complete tasks when all checkboxes are checked.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleAutoMark}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              autoMarkDone ? 'bg-[#18181B]' : 'bg-neutral-300'
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
            <Archive className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#111827]">Archive Completed Tasks</div>
              <div className="text-[11px] text-[#6B7280]">
                Move completed tasks to archive after 7 days.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleArchive}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              archiveCompleted ? 'bg-[#18181B]' : 'bg-neutral-300'
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
