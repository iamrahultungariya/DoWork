import { db, type Task, type TaskCategory, type TaskStatus, type Project } from './db'
import { sound } from '@/lib/sound'

export interface CreateTaskPayload {
  title: string
  category?: TaskCategory
  flagged?: boolean
  starred?: boolean
  dueDate?: string
  estimatedTime?: string
  status?: TaskStatus
}

export interface CreateProjectPayload {
  name: string
  description: string
  status?: 'active' | 'completed' | 'archived'
  color?: string
  icon?: 'laptop' | 'code' | 'palette' | 'book' | 'target'
  dueDate?: string
}

/**
 * Creates a new task in Dexie DB
 */
export async function addTask(payload: CreateTaskPayload): Promise<string> {
  const count = await db.tasks.count()
  const now = Date.now()
  const id = `task-${now}-${Math.random().toString(36).substring(2, 7)}`

  const newTask: Task = {
    id,
    title: payload.title.trim(),
    category: payload.category || 'Study',
    completed: 0,
    status: payload.status || 'todo',
    flagged: payload.flagged ?? false,
    starred: payload.starred ?? false,
    dueDate: payload.dueDate || 'Today',
    estimatedTime: payload.estimatedTime || '30 min',
    order: count + 1,
    createdAt: now,
    updatedAt: now,
  }

  await db.tasks.add(newTask)
  sound.playClick()
  return id
}

/**
 * Updates an existing task
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await db.tasks.update(id, {
    ...updates,
    updatedAt: Date.now(),
  })
  sound.playClick()
}

/**
 * Toggles completion status and triggers audio feedback
 */
export async function toggleTaskCompleted(id: string, currentCompleted: number): Promise<void> {
  const newCompleted = currentCompleted === 1 ? 0 : 1
  const newStatus: TaskStatus = newCompleted === 1 ? 'done' : 'todo'

  await db.tasks.update(id, {
    completed: newCompleted,
    status: newStatus,
    updatedAt: Date.now(),
  })

  if (newCompleted === 1) {
    sound.playComplete()
  } else {
    sound.playUncheck()
  }
}

/**
 * Toggles starred / favorite status
 */
export async function toggleTaskStarred(id: string, currentStarred: boolean): Promise<void> {
  await db.tasks.update(id, {
    starred: !currentStarred,
    updatedAt: Date.now(),
  })
  sound.playClick()
}

/**
 * Toggles priority flag
 */
export async function toggleTaskFlagged(id: string, currentFlagged: boolean): Promise<void> {
  await db.tasks.update(id, {
    flagged: !currentFlagged,
    updatedAt: Date.now(),
  })
  sound.playClick()
}

/**
 * Removes a task by ID
 */
export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id)
  sound.playClick()
}

/**
 * Creates a new project in Dexie DB
 */
export async function addProject(payload: CreateProjectPayload): Promise<string> {
  const count = await db.projects.count()
  const now = Date.now()
  const id = `proj-${now}-${Math.random().toString(36).substring(2, 7)}`

  const newProject: Project = {
    id,
    name: payload.name.trim(),
    description: payload.description.trim() || 'Project overview and objectives',
    status: payload.status || 'active',
    color: payload.color || '#2563EB',
    icon: payload.icon || 'laptop',
    totalTasks: 0,
    completedTasks: 0,
    dueDate: payload.dueDate || 'No due date',
    order: count + 1,
  }

  await db.projects.add(newProject)
  sound.playClick()
  return id
}

/**
 * Updates an existing project
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  await db.projects.update(id, updates)
  sound.playClick()
}

/**
 * Deletes a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id)
  sound.playClick()
}

/**
 * Clears all user tasks, projects, and schedule items
 */
export async function clearAllData(): Promise<void> {
  await db.tasks.clear()
  await db.projects.clear()
  await db.scheduleItems.clear()
  sound.playClick()
}

/**
 * Toggles schedule item completion
 */
export async function toggleScheduleCompleted(id: string, currentCompleted: number): Promise<void> {
  const newCompleted = currentCompleted === 1 ? 0 : 1
  await db.scheduleItems.update(id, {
    completed: newCompleted,
  })

  if (newCompleted === 1) {
    sound.playComplete()
  } else {
    sound.playUncheck()
  }
}
