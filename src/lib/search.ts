import MiniSearch from 'minisearch'
import type { Task } from '@/db/db'

let miniSearchInstance: MiniSearch<Task> | null = null
let indexedTasksSignature = ''

function getTasksSignature(tasks: Task[]): string {
  let maxUpdated = 0
  for (const t of tasks) {
    if (t.updatedAt > maxUpdated) maxUpdated = t.updatedAt
  }
  return `${tasks.length}:${maxUpdated}`
}

/**
 * Initializes or updates the MiniSearch index from tasks array
 */
export function syncSearchIndex(tasks: Task[]): MiniSearch<Task> {
  const miniSearch = new MiniSearch<Task>({
    fields: ['title', 'category'],
    storeFields: ['id', 'title', 'category', 'completed', 'flagged'],
    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 2 },
    },
  })

  miniSearch.addAll(tasks)
  miniSearchInstance = miniSearch
  indexedTasksSignature = getTasksSignature(tasks)
  return miniSearch
}

/**
 * Queries the client-side search index
 */
export function searchTasksFuzzy(query: string, allTasks: Task[]): Task[] {
  const clean = query.trim()
  if (!clean) return allTasks

  const currentSig = getTasksSignature(allTasks)
  if (!miniSearchInstance || indexedTasksSignature !== currentSig) {
    syncSearchIndex(allTasks)
  }

  try {
    const results = miniSearchInstance!.search(clean)
    if (results.length > 0) {
      const matchedIds = new Set(results.map((r) => r.id))
      return allTasks.filter((t) => matchedIds.has(t.id))
    }
  } catch {
    // MiniSearch query syntax fallback
  }

  // Fallback substring search across title and category
  const lower = clean.toLowerCase()
  return allTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower)
  )
}
