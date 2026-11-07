import { db, type Task, type TaskCategory, type TaskStatus, type Project } from './db'
import { sound } from '@/lib/sound'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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
 * Sync all user data from Supabase into local Dexie store
 */
export async function syncFromSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured() || !userId) return

  try {
    // 1. Fetch Remote Tasks
    const { data: remoteTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)

    if (!tasksError && remoteTasks && remoteTasks.length > 0) {
      const mappedTasks: Task[] = remoteTasks.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        completed: t.completed,
        status: t.status,
        flagged: t.flagged,
        starred: t.starred,
        dueDate: t.due_date,
        estimatedTime: t.estimated_time,
        order: t.order_index ?? 0,
        createdAt: new Date(t.created_at).getTime(),
        updatedAt: new Date(t.updated_at).getTime(),
      }))
      await db.tasks.bulkPut(mappedTasks)
    }

    // 2. Fetch Remote Projects
    const { data: remoteProjects, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)

    if (!projError && remoteProjects && remoteProjects.length > 0) {
      const mappedProjects: Project[] = remoteProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        color: p.color,
        icon: p.icon,
        totalTasks: p.total_tasks ?? 0,
        completedTasks: p.completed_tasks ?? 0,
        dueDate: p.due_date,
        order: p.order_index ?? 0,
      }))
      await db.projects.bulkPut(mappedProjects)
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err)
  }
}

/**
 * Creates a new task in Dexie DB and syncs to Supabase if authenticated
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

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          await supabase.from('tasks').insert({
            id: newTask.id,
            user_id: user.id,
            title: newTask.title,
            category: newTask.category,
            completed: newTask.completed,
            status: newTask.status,
            flagged: newTask.flagged,
            starred: newTask.starred,
            due_date: newTask.dueDate,
            estimated_time: newTask.estimatedTime,
            order_index: newTask.order,
          })
        }
      })
      .catch((err) => console.warn('Supabase task insert error:', err))
  }

  return id
}

/**
 * Updates an existing task
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const now = Date.now()
  await db.tasks.update(id, {
    ...updates,
    updatedAt: now,
  })
  sound.playClick()

  // Background Supabase Sync
  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          const payload: Record<string, unknown> = {}
          if (updates.title !== undefined) payload.title = updates.title
          if (updates.category !== undefined) payload.category = updates.category
          if (updates.completed !== undefined) payload.completed = updates.completed
          if (updates.status !== undefined) payload.status = updates.status
          if (updates.flagged !== undefined) payload.flagged = updates.flagged
          if (updates.starred !== undefined) payload.starred = updates.starred
          if (updates.dueDate !== undefined) payload.due_date = updates.dueDate
          if (updates.estimatedTime !== undefined) payload.estimated_time = updates.estimatedTime
          if (updates.order !== undefined) payload.order_index = updates.order

          await supabase
            .from('tasks')
            .update(payload)
            .eq('id', id)
            .eq('user_id', user.id)
        }
      })
      .catch((err) => console.warn('Supabase task update error:', err))
  }
}

/**
 * Toggles completion status and triggers audio feedback
 */
export async function toggleTaskCompleted(id: string, currentCompleted: number): Promise<void> {
  const newCompleted = currentCompleted === 1 ? 0 : 1
  const newStatus: TaskStatus = newCompleted === 1 ? 'done' : 'todo'

  await updateTask(id, {
    completed: newCompleted,
    status: newStatus,
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
  await updateTask(id, {
    starred: !currentStarred,
  })
}

/**
 * Toggles priority flag
 */
export async function toggleTaskFlagged(id: string, currentFlagged: boolean): Promise<void> {
  await updateTask(id, {
    flagged: !currentFlagged,
  })
}

/**
 * Removes a task by ID
 */
export async function deleteTask(id: string): Promise<void> {
  await db.tasks.delete(id)
  sound.playClick()

  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
        }
      })
      .catch((err) => console.warn('Supabase task delete error:', err))
  }
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

  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          await supabase.from('projects').insert({
            id: newProject.id,
            user_id: user.id,
            name: newProject.name,
            description: newProject.description,
            status: newProject.status,
            color: newProject.color,
            icon: newProject.icon,
            total_tasks: newProject.totalTasks,
            completed_tasks: newProject.completedTasks,
            due_date: newProject.dueDate,
            order_index: newProject.order,
          })
        }
      })
      .catch((err) => console.warn('Supabase project insert error:', err))
  }

  return id
}

/**
 * Updates an existing project
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  await db.projects.update(id, updates)
  sound.playClick()

  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          const payload: Record<string, unknown> = {}
          if (updates.name !== undefined) payload.name = updates.name
          if (updates.description !== undefined) payload.description = updates.description
          if (updates.status !== undefined) payload.status = updates.status
          if (updates.color !== undefined) payload.color = updates.color
          if (updates.icon !== undefined) payload.icon = updates.icon
          if (updates.dueDate !== undefined) payload.due_date = updates.dueDate

          await supabase
            .from('projects')
            .update(payload)
            .eq('id', id)
            .eq('user_id', user.id)
        }
      })
      .catch((err) => console.warn('Supabase project update error:', err))
  }
}

/**
 * Deletes a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id)
  sound.playClick()

  if (isSupabaseConfigured()) {
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (user) {
          await supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)
        }
      })
      .catch((err) => console.warn('Supabase project delete error:', err))
  }
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
