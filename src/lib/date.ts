/**
 * Date & Calendar Utilities for TaskComp
 * High-precision, zero-hallucination date parsing, formatting, and classification.
 */

export function toCalendarDateString(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayFormattedDate(): string {
  const d = new Date()
  const monthShort = d.toLocaleString('en-US', { month: 'short' })
  return `${d.getDate()} ${monthShort} ${d.getFullYear()}`
}

export function formatGreetingDate(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${weekday}, ${month} ${day}`
}

/**
 * Parses any task dueDate string, taking into account creation timestamp
 * for contextual values like 'Today' or 'Tomorrow'.
 */
export function parseTaskDueDate(dueDate: string | undefined | null, createdAt?: number): Date | null {
  if (!dueDate) return null
  const clean = dueDate.trim()
  if (!clean || clean === 'No due date' || clean === 'No date') return null

  const lower = clean.toLowerCase()
  if (lower === 'today') {
    if (createdAt) {
      return new Date(createdAt)
    }
    return new Date()
  }

  if (lower === 'yesterday') {
    const base = createdAt ? new Date(createdAt) : new Date()
    base.setDate(base.getDate() - 1)
    return base
  }

  if (lower === 'tomorrow') {
    const base = createdAt ? new Date(createdAt) : new Date()
    base.setDate(base.getDate() + 1)
    return base
  }

  const parsed = new Date(clean)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }

  return null
}

export interface TaskDateStatus {
  category: 'overdue' | 'today' | 'upcoming' | 'someday'
  label: string
  diffDays: number
  dateString: string
}

/**
 * Evaluates whether a task is overdue, due today, or upcoming,
 * comparing against the user's current local date.
 */
export function getTaskDateStatus(
  dueDate: string | undefined | null,
  createdAt?: number,
  isCompleted: boolean = false
): TaskDateStatus {
  const parsed = parseTaskDueDate(dueDate, createdAt)
  if (!parsed) {
    return {
      category: 'someday',
      label: 'No due date',
      diffDays: 0,
      dateString: '',
    }
  }

  const todayStr = toCalendarDateString(new Date())
  const targetStr = toCalendarDateString(parsed)

  const todayDate = new Date(`${todayStr}T00:00:00`)
  const targetDate = new Date(`${targetStr}T00:00:00`)
  const diffTime = targetDate.getTime() - todayDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  const monthShort = parsed.toLocaleString('en-US', { month: 'short' })
  const dateFormatted = `${parsed.getDate()} ${monthShort}`

  if (diffDays < 0) {
    if (isCompleted) {
      return {
        category: 'today',
        label: `Completed · ${dateFormatted}`,
        diffDays,
        dateString: targetStr,
      }
    }
    const daysAgo = Math.abs(diffDays)
    const overdueLabel =
      daysAgo === 1
        ? 'Overdue · Yesterday'
        : daysAgo === 2
        ? 'Overdue · 2 days ago'
        : `Overdue · ${daysAgo}d ago (${dateFormatted})`

    return {
      category: 'overdue',
      label: overdueLabel,
      diffDays,
      dateString: targetStr,
    }
  }

  if (diffDays === 0) {
    return {
      category: 'today',
      label: 'Due Today',
      diffDays: 0,
      dateString: targetStr,
    }
  }

  // Future
  const upcomingLabel =
    diffDays === 1
      ? 'Due Tomorrow'
      : diffDays <= 7
      ? `Due in ${diffDays} days`
      : `Due ${dateFormatted}`

  return {
    category: 'upcoming',
    label: upcomingLabel,
    diffDays,
    dateString: targetStr,
  }
}

export function isTaskDueTodayOrOverdue(
  dueDate: string | undefined | null,
  createdAt?: number,
  completed: number = 0
): boolean {
  const status = getTaskDateStatus(dueDate, createdAt, completed === 1)
  return status.category === 'today' || (status.category === 'overdue' && completed === 0)
}

export function isTaskStrictlyToday(
  dueDate: string | undefined | null,
  createdAt?: number
): boolean {
  const status = getTaskDateStatus(dueDate, createdAt, false)
  return status.category === 'today'
}

export function isTaskOverdue(
  dueDate: string | undefined | null,
  createdAt?: number,
  completed: number = 0
): boolean {
  if (completed === 1) return false
  const status = getTaskDateStatus(dueDate, createdAt, false)
  return status.category === 'overdue'
}

/**
 * Returns contextual greeting
 */
export function getContextualGreeting(name: string = 'Rahul'): {
  heading: string
  subtitle: string
} {
  const hour = new Date().getHours()
  let heading = `Good Morning, ${name}`
  let subtitle = "Here's what is on your agenda today."

  if (hour >= 12 && hour < 17) {
    heading = `Good Afternoon, ${name}`
    subtitle = "Review your progress and keep up the momentum."
  } else if (hour >= 17) {
    heading = `Good Evening, ${name}`
    subtitle = "Wrap up remaining items and review your accomplishments."
  }

  return { heading, subtitle }
}
