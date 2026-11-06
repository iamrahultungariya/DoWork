/**
 * Formats current date to match the reference UI: e.g. "Thu, Nov 6"
 */
export function formatGreetingDate(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${weekday}, ${month} ${day}`
}

/**
 * Returns dynamic contextual greeting based on local time
 */
export function getContextualGreeting(name: string = 'Rahul'): {
  heading: string
  emoji: string
  subtitle: string
} {
  const hour = new Date().getHours()
  let heading = `Good Morning, ${name}`
  let emoji = '🌱'
  let subtitle = "Let's make today a productive one."

  if (hour >= 12 && hour < 17) {
    heading = `Good Afternoon, ${name}`
    emoji = '☀️'
    subtitle = 'Keep up the strong momentum today.'
  } else if (hour >= 17) {
    heading = `Good Evening, ${name}`
    emoji = '✨'
    subtitle = 'Wrap up your remaining tasks and relax.'
  }

  return { heading, emoji, subtitle }
}
