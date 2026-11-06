export interface DayProgress {
  day: string
  created: number
  completed: number
  focusMinutes: number
}

export interface CategoryDistribution {
  name: string
  percentage: number
  count: number
  color: string
}

export const WEEKLY_TASK_PROGRESS: DayProgress[] = [
  { day: 'Mon', created: 4, completed: 2, focusMinutes: 90 },
  { day: 'Tue', created: 9, completed: 5, focusMinutes: 120 },
  { day: 'Wed', created: 13, completed: 8, focusMinutes: 160 },
  { day: 'Thu', created: 9, completed: 5, focusMinutes: 100 },
  { day: 'Fri', created: 14, completed: 8, focusMinutes: 180 },
  { day: 'Sat', created: 8, completed: 4, focusMinutes: 50 },
  { day: 'Sun', created: 10, completed: 6, focusMinutes: 50 },
]

export const CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
  { name: 'Study', percentage: 33, count: 12, color: '#10B981' }, // green
  { name: 'Project', percentage: 25, count: 9, color: '#A855F7' }, // purple
  { name: 'Design', percentage: 14, count: 5, color: '#F59E0B' }, // amber
  { name: 'Learning', percentage: 14, count: 5, color: '#38BDF8' }, // light blue
  { name: 'Other', percentage: 14, count: 5, color: '#CBD5E1' }, // slate
]

export const CONSISTENCY_DAYS = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: true },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: false },
]
