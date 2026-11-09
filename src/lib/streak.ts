import { db, type Task } from '@/db/db'
import { toCalendarDateString } from './date'
import { supabase, isSupabaseConfigured } from './supabase'

export interface StreakStats {
  currentStreak: number
  longestStreak: number
  isActiveToday: boolean
  lastActiveDate: string
  activeDates: string[]
}

/**
 * Computes current streak, longest streak, and active days dynamically from tasks.
 */
export function computeStreakFromTasks(tasks: Task[]): StreakStats {
  const completedTasks = tasks.filter((t) => t.completed === 1)
  const activeDateSet = new Set<string>()

  for (const t of completedTasks) {
    const timestamp = t.completedAt || t.updatedAt || t.createdAt
    if (timestamp) {
      activeDateSet.add(toCalendarDateString(new Date(timestamp)))
    }
  }

  const activeDates = Array.from(activeDateSet).sort()
  const today = new Date()
  const todayStr = toCalendarDateString(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = toCalendarDateString(yesterday)

  const isActiveToday = activeDateSet.has(todayStr)
  const isActiveYesterday = activeDateSet.has(yesterdayStr)

  let currentStreak = 0

  if (isActiveToday) {
    // Count consecutive days backward from today
    const checkDate = new Date(today)
    while (activeDateSet.has(toCalendarDateString(checkDate))) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  } else if (isActiveYesterday) {
    // User completed tasks yesterday; streak is still valid for today until the day ends
    const checkDate = new Date(yesterday)
    while (activeDateSet.has(toCalendarDateString(checkDate))) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  // Calculate historic longest streak
  let longestStreak = currentStreak
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const dateStr of activeDates) {
    const currDate = new Date(`${dateStr}T00:00:00`)
    if (!prevDate) {
      tempStreak = 1
    } else {
      const diffMs = currDate.getTime() - prevDate.getTime()
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        tempStreak++
      } else if (diffDays > 1) {
        tempStreak = 1
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }
    prevDate = currDate
  }

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    lastActiveDate: activeDates.length > 0 ? activeDates[activeDates.length - 1] : todayStr,
    activeDates,
  }
}

/**
 * Calculates user streak from tasks and updates Dexie and Supabase profile
 */
export async function recalculateAndPersistStreak(): Promise<number> {
  try {
    const allTasks = await db.tasks.toArray()
    const stats = computeStreakFromTasks(allTasks)

    const profile = await db.userProfile.get('default-profile')
    if (profile) {
      await db.userProfile.update('default-profile', {
        streakDays: stats.currentStreak,
        lastActiveDate: stats.lastActiveDate,
      })
    }

    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          try {
            await supabase
              .from('user_profiles')
              .update({
                streak_days: stats.currentStreak,
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id)
          } catch {
            // Silently ignore remote sync error
          }
        }
      }).catch(() => {})
    }

    return stats.currentStreak
  } catch (err) {
    console.warn('Streak calculation error:', err)
    return 0
  }
}
