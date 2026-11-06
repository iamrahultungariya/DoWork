# TaskComp: Functions Directory & Catalog

This document indexes all functions, signatures, parameters, return types, and files.
Check this file before writing new utilities or modifying existing function signatures.

---

## 1. Procedural Audio Functions (`src/lib/sound.ts`)
| Function | Signature | Parameters | Returns | Description |
|---|---|---|---|---|
| `sound.playClick` | `() => void` | none | `void` | Plays crisp tactile click for buttons/nav |
| `sound.playComplete` | `() => void` | none | `void` | Plays 4-note ascending chord chime on task completion |
| `sound.playUncheck` | `() => void` | none | `void` | Plays gentle descending tone on task untick |
| `sound.playOpen` | `() => void` | none | `void` | Plays airy pop on modal / command palette open |
| `sound.playClose` | `() => void` | none | `void` | Plays soft dismiss tap on modal close |
| `sound.playAction` | `() => void` | none | `void` | Plays upbeat chime for Quick Actions |
| `sound.playTimerBeep` | `() => void` | none | `void` | Plays chime when focus timer finishes |

---

## 2. Database & Service Functions (`src/db/taskService.ts` & `src/db/projectService.ts`)
| Function | Signature | Parameters | Returns | Description |
|---|---|---|---|---|
| `seedInitialTasksIfEmpty` | `() => Promise<void>` | none | `Promise<void>` | Populates default tasks, projects, stats, and profile if empty |
| `toggleTaskCompleted` | `(id: string, current: number) => Promise<void>` | `id, current` | `Promise<void>` | Toggles completion, updates status, plays sound |
| `toggleTaskStarred` | `(id: string, current: boolean) => Promise<void>` | `id, current` | `Promise<void>` | Toggles star status with sound |
| `toggleTaskFlagged` | `(id: string, current: boolean) => Promise<void>` | `id, current` | `Promise<void>` | Toggles priority flag |
| `deleteTask` | `(id: string) => Promise<void>` | `id: string` | `Promise<void>` | Removes task by ID |
| `toggleScheduleCompleted` | `(id: string, current: number) => Promise<void>` | `id, current` | `Promise<void>` | Toggles schedule entry checkbox |
| `addProject` | `(project: Partial<Project>) => Promise<string>` | `project` | `Promise<string>` | Adds new project entry |
| `updateUserSettings` | `(settings: Partial<UserProfile>) => Promise<void>` | `settings` | `Promise<void>` | Updates preferences in Dexie DB |

---

## 3. Formatting & Math Functions (`src/lib/date.ts` & `src/lib/statsData.ts`)
| Function | Signature | Parameters | Returns | Description |
|---|---|---|---|---|
| `formatGreetingDate` | `(date?: Date) => string` | `date?: Date` | `string` | Formats date as `"Thu, Nov 6"` |
| `formatTimerDisplay` | `(seconds: number) => string` | `seconds` | `string` | Formats seconds into `"25:00"` |
| `getWeeklyStats` | `() => DayProgress[]` | none | `DayProgress[]` | Returns 7-day created vs completed data for bar chart |
| `getDistributionStats` | `() => CategoryDistribution[]` | none | `CategoryDistribution[]` | Returns category distribution for donut chart |
