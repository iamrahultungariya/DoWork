import MiniSearch from 'minisearch'
import type { Task } from '@/db/db'

let miniSearchInstance: MiniSearch<Task> | null = null

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
  return miniSearch
}

/**
 * Queries the client-side search index
 */
export function searchTasksFuzzy(query: string, allTasks: Task[]): Task[] {
  if (!query.trim()) return allTasks
  if (!miniSearchInstance) {
    syncSearchIndex(allTasks)
  }

  const results = miniSearchInstance!.search(query)
  const matchedIds = new Set(results.map((r) => r.id))
  return allTasks.filter((t) => matchedIds.has(t.id))
}
