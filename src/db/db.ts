import Dexie, { type Table } from 'dexie'

export type TaskCategory =
  | 'Study'
  | 'Project'
  | 'Exam'
  | 'Design'
  | 'Learning'
  | 'Plan'
  | 'Routine'
  | string

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  category: TaskCategory
  completed: number
  status: TaskStatus
  flagged: boolean
  starred: boolean
  dueDate: string
  estimatedTime: string
  order: number
  createdAt: number
  updatedAt: number
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  duration: string
  type: 'study' | 'project' | 'exam' | 'break' | 'design'
  completed: number
  order: number
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
  color: string
  icon: 'laptop' | 'code' | 'palette' | 'book' | 'target'
  totalTasks: number
  completedTasks: number
  dueDate: string
  order: number
}

export interface UserProfile {
  id: string
  userName: string
  currentSpace: string
  streakDays: number
  lastActiveDate: string
  startOfWeek?: 'Monday' | 'Sunday'
  dateFormat?: string
  timeFormat?: '12-hour' | '24-hour'
  language?: string
  defaultTaskView?: 'list' | 'board'
  autoMarkDone?: boolean
  archiveCompleted?: boolean
  theme?: 'light' | 'dark' | 'system'
}

export class TaskDatabase extends Dexie {
  tasks!: Table<Task, string>
  scheduleItems!: Table<ScheduleItem, string>
  projects!: Table<Project, string>
  userProfile!: Table<UserProfile, string>

  constructor() {
    super('TaskCompDB')
    this.version(3).stores({
      tasks: 'id, title, category, completed, status, flagged, starred, dueDate, order, createdAt',
      scheduleItems: 'id, time, title, duration, type, completed, order',
      projects: 'id, name, status, order',
      userProfile: 'id, userName, currentSpace, streakDays, lastActiveDate',
    })
  }
}

export const db = new TaskDatabase()

/**
 * Initializes default user profile if empty and clears any legacy demo seed data
 */
export async function seedInitialTasksIfEmpty() {
  // Legacy migration check: clear old demo seed tasks if they exist from v0.1.0 prototype
  const MIGRATION_KEY = 'taskcomp_v0_2_0_demo_purged'
  if (typeof window !== 'undefined' && !localStorage.getItem(MIGRATION_KEY)) {
    const demoTaskIds = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7', 'task-8']
    const demoSchedIds = ['sched-1', 'sched-2', 'sched-3', 'sched-4', 'sched-5']
    const demoProjIds = ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5']

    for (const id of demoTaskIds) {
      await db.tasks.delete(id).catch(() => {})
    }
    for (const id of demoSchedIds) {
      await db.scheduleItems.delete(id).catch(() => {})
    }
    for (const id of demoProjIds) {
      await db.projects.delete(id).catch(() => {})
    }
    localStorage.setItem(MIGRATION_KEY, 'true')
  }

  // Ensure default profile exists for user preferences
  const profileCount = await db.userProfile.count()
  if (profileCount === 0) {
    await db.userProfile.put({
      id: 'default-profile',
      userName: 'Rahul',
      currentSpace: 'Personal Space',
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      startOfWeek: 'Monday',
      dateFormat: 'DD MMM, YYYY',
      timeFormat: '12-hour',
      language: 'English',
      defaultTaskView: 'list',
      autoMarkDone: true,
      archiveCompleted: false,
    })
  }
}
