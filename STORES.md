# TaskComp: Stores & State Architecture

This document catalogs every store, database table, state variable, and mutation in the application.
Always check this file before modifying state or database schemas.

---

## 1. Dexie.js Client Database (`src/db/db.ts`)
- **Database Name**: `TaskCompDB`
- **Engine**: IndexedDB with reactive `dexie-react-hooks` (`useLiveQuery`)
- **Persistence**: High-capacity local storage with full offline capabilities.

### Table: `tasks`
- **Stores**: All user tasks across today, my tasks, and projects.
- **Index Definition**: `id, title, category, completed, status, flagged, starred, dueDate, order, createdAt`
- **Fields**:
  | Field | Type | Description |
  |---|---|---|
  | `id` | `string` | Primary Key (UUID) |
  | `title` | `string` | Task title text |
  | `category` | `'Study' \| 'Project' \| 'Exam' \| 'Design' \| 'Learning' \| 'Plan' \| 'Routine' \| string` | Categorization tag |
  | `completed` | `number` (0 or 1) | Indexed completion flag for fast queries |
  | `status` | `'todo' \| 'in_progress' \| 'done'` | Task progress state |
  | `flagged` | `boolean` | High priority flag |
  | `starred` | `boolean` | Starred / favorite flag |
  | `dueDate` | `string` | Due date string (`'Today'`, `'Tomorrow'`, `'Nov 10'`) |
  | `estimatedTime` | `string` | Estimated duration (`'45 min'`, `'1 hr'`) |
  | `order` | `number` | Display order index |
  | `createdAt` | `number` | Creation timestamp in ms |
  | `updatedAt` | `number` | Modification timestamp in ms |

### Table: `projects`
- **Stores**: Projects and goal groups.
- **Fields**:
  | Field | Type | Description |
  |---|---|---|
  | `id` | `string` | Primary Key |
  | `name` | `string` | Project name (Study, Project, Design, Learning, Personal) |
  | `description` | `string` | Short description / stack |
  | `status` | `'active' \| 'completed' \| 'archived'` | Status filter |
  | `color` | `string` | Accent color token |
  | `icon` | `string` | Laptop, Code, Palette, Book, Target |
  | `totalTasks` | `number` | Total tasks count |
  | `completedTasks` | `number` | Completed tasks count |
  | `dueDate` | `string` | Due date or `'No due date'` |

### Table: `scheduleItems`
- **Stores**: Today's time-blocked schedule entries.
- **Fields**:
  | Field | Type | Description |
  |---|---|---|
  | `id` | `string` | Primary Key |
  | `time` | `string` | Time display (`'09:00 AM'`, `'10:00 AM'`) |
  | `title` | `string` | Schedule block title |
  | `duration` | `string` | Duration display (`'45 min'`, `'1 hr'`) |
  | `type` | `'study' \| 'project' \| 'exam' \| 'break' \| 'design'` | Schedule category |
  | `completed` | `number` (0 or 1) | Checkbox status |

### Table: `userProfile`
- **Stores**: User settings, streak tracking, preferences.
- **Fields**:
  | Field | Type | Description |
  |---|---|---|
  | `id` | `string` | Primary Key (`default-profile`) |
  | `userName` | `string` | Display name (Default: `"Rahul"`) |
  | `startOfWeek` | `'Monday' \| 'Sunday'` | Week start day |
  | `dateFormat` | `string` | Date display format (`'DD MMM, YYYY'`) |
  | `timeFormat` | `'12-hour' \| '24-hour'` | Time format |
  | `language` | `string` | Preferred language (`'English'`) |
  | `defaultTaskView` | `'list' \| 'board'` | Default view mode |
  | `autoMarkDone` | `boolean` | Auto mark parent tasks done |
  | `archiveCompleted` | `boolean` | Archive after 7 days |
  | `streakDays` | `number` | Current streak days |

---

## 2. Zustand UI Store (`src/stores/uiStore.ts`)
- **Stores**: Ephemeral navigation, filter states, project filters, settings tab, and audio settings.
- **Navigation Tabs**: `'home' | 'my-tasks' | 'today' | 'projects' | 'stats' | 'settings'`
- **Settings Sub-Tabs**: `'general' | 'notifications' | 'appearance' | 'focus' | 'projects' | 'backup' | 'privacy' | 'about'`
- **State Properties**:
  | Property | Type | Default | Description |
  |---|---|---|---|
  | `activeTab` | `NavTabId` | `'today'` | Active main navigation view |
  | `activeSettingsTab` | `string` | `'general'` | Active sub-tab in Settings |
  | `statsTimeRange` | `'7d' \| '30d' \| 'all'` | `'7d'` | Time range filter in Stats |
  | `projectFilter` | `'all' \| 'active' \| 'completed' \| 'archived'` | `'all'` | Project filter tab |
  | `projectSort` | `'last_updated' \| 'name' \| 'progress'` | `'last_updated'` | Project sorting method |
  | `isNewProjectModalOpen` | `boolean` | `false` | Modal state for new projects |
