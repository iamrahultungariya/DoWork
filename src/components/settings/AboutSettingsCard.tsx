import { Sparkles, Database, Heart, Moon } from 'lucide-react'
import { Card } from '@/components/common/Card'
import cheerfulBoyImg from '@/assets/cheerful-boy.png'

export function AboutSettingsCard() {
  return (
    <Card className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.08] relative">
        <div className="z-10">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">About TaskComp</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-[#09090B] shadow-2xs">
              v0.3.0
            </span>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
            Modern, minimal, and high-performance productivity companion.
          </p>
        </div>

        {/* Mascot in Header */}
        <div className="hidden sm:block w-24 sm:w-28 h-16 sm:h-20 relative pointer-events-none -mt-4 -mr-2">
          <img
            src={cheerfulBoyImg}
            alt="TaskComp Mascot"
            className="w-full h-full object-contain object-right drop-shadow-2xs dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)] select-none"
          />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.08]">
        {/* 1. App Version & Build Information */}
        <div className="py-5 select-none space-y-3">
          <div className="text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">Application Details</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-neutral-500 dark:text-zinc-400 font-medium">App Version</span>
              <span className="font-extrabold text-[#111827] dark:text-[#F4F4F5] bg-white dark:bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-neutral-200 dark:border-white/[0.1]">
                0.3.0
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-neutral-500 dark:text-zinc-400 font-medium">Release Channel</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                Production Stable (Vercel Ready)
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-neutral-500 dark:text-zinc-400 font-medium">Database Engines</span>
              <span className="font-semibold text-neutral-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Dexie + Supabase</span>
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-neutral-500 dark:text-zinc-400 font-medium">Theme Engine</span>
              <span className="font-semibold text-neutral-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Zero-Flicker Studio Dark</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. What's New in v0.3.0 */}
        <div className="py-5 select-none space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#111827] dark:text-[#F4F4F5]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>What's New in Version 0.3.0</span>
          </div>

          <ul className="space-y-2 text-xs text-[#4B5563] dark:text-[#D4D4D8]">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-zinc-400 mt-1.5 shrink-0" />
              <span>
                <strong>Studio Obsidian Dark Mode:</strong> Zero-flicker startup with warm zinc tones, high-contrast typography, and smooth theme switching across all views.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-zinc-400 mt-1.5 shrink-0" />
              <span>
                <strong>Vercel Production Deployment Configuration:</strong> Dedicated <code className="text-xs bg-neutral-100 dark:bg-zinc-800 px-1 py-0.5 rounded">vercel.json</code> with SPA routing rewrites, security headers, and asset caching rules.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-zinc-400 mt-1.5 shrink-0" />
              <span>
                <strong>Sleek Single-Row Date & Time Pickers:</strong> Accordion drawers with direct numeric typing, arrow stepping, and boundary protection against modal clipping.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-zinc-400 mt-1.5 shrink-0" />
              <span>
                <strong>Compact Auth Flow:</strong> Modern squircle login/signup modal with guest restrictions isolated exclusively to development environments.
              </span>
            </li>
          </ul>
        </div>

        {/* 3. Tech Stack Credits */}
        <div className="pt-5 select-none">
          <div className="flex items-center space-x-1.5 text-xs text-[#6B7280] dark:text-[#A1A1AA]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>using React 19, Tailwind CSS v4, Zustand, Dexie, and Supabase.</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
