import { Sparkles, Database, ShieldCheck, Heart, Terminal } from 'lucide-react'
import { Card } from '@/components/common/Card'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'

export function AboutSettingsCard() {
  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl relative flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] relative">
        <div className="z-10">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">About TaskComp</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white shadow-2xs">
              v0.2.1
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Modern, minimal, and high-performance productivity companion.
          </p>
        </div>

        {/* Mascot in Header */}
        <div className="hidden xs:block w-24 sm:w-28 h-16 sm:h-20 relative pointer-events-none -mt-4 -mr-2">
          <img
            src={cheerfulBoyImg}
            alt="TaskComp Mascot"
            className="w-full h-full object-contain object-right drop-shadow-2xs select-none"
          />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04]">
        {/* 1. App Version & Build Information */}
        <div className="py-5 select-none space-y-3">
          <div className="text-xs font-bold text-[#111827]">Application Details</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
              <span className="text-neutral-500 font-medium">App Version</span>
              <span className="font-extrabold text-[#111827] bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                0.2.1
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Release Channel</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Production Stable (Optimized)
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Database Engine</span>
              <span className="font-semibold text-neutral-800 flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Dexie.js (IndexedDB)</span>
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Store Architecture</span>
              <span className="font-semibold text-neutral-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zustand Atomic Selectors</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. What's New in v0.2.1 */}
        <div className="py-5 select-none space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>What's New in Version 0.2.1</span>
          </div>

          <ul className="space-y-2 text-xs text-[#4B5563]">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 shrink-0" />
              <span>
                <strong>Custom Calendar Date Picker:</strong> Replaced preset date chips with a custom-designed full calendar picker featuring monthly navigation, weekday headers, trailing/leading days, and quick jump-to-today.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 shrink-0" />
              <span>
                <strong>Custom Precision Time Picker (hh:mm:ss am/pm):</strong> Direct interactive steppers for hours, minutes, seconds, and AM/PM segmented toggle with procedural audio tick feedback.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 shrink-0" />
              <span>
                <strong>Zero-Cascade Re-render Architecture:</strong> Eliminated all un-scoped store subscriptions across 17+ components in favor of atomic selectors (`useUIStore(s =&gt; s.foo)`).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 shrink-0" />
              <span>
                <strong>High-Efficiency Component Memoization:</strong> `TaskItemRow`, `Checkbox`, `Badge`, and filter computation pipelines are now protected by `React.memo` and `useMemo` hooks.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 shrink-0" />
              <span>
                <strong>Zero Added Dependencies:</strong> Date &amp; time pickers are authored natively in pure React &amp; Tailwind with 0 KB bloat and 60 FPS silky smooth UI response.
              </span>
            </li>
          </ul>
        </div>

        {/* 3. Tech Stack & Architecture */}
        <div className="py-5 select-none space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
            <Terminal className="w-3.5 h-3.5 text-neutral-600" />
            <span>Architecture & Performance</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            TaskComp is built with a zero-network-latency philosophy. All tasks and preferences stay on your machine using IndexedDB via Dexie.js. Audio feedback is synthesized procedurally in real-time through the Web Audio API without downloading external audio files.
          </p>
        </div>

        {/* 4. Footer */}
        <div className="pt-4 flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span>TaskComp Productivity Engine</span>
          <span className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
            <span>for focused work</span>
          </span>
        </div>
      </div>
    </Card>
  )
}
