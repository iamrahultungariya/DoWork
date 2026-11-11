# Changelog

All notable changes to the DoWork (TaskComp) application are documented in this file.

## [0.4.0] - 2026-11-11

### Added
- **Dynamic Streak Engine (`src/lib/streak.ts`)**:
  - Implemented continuous daily streak tracking with milestone rewards and consistency scores.
  - Added streak freeze safeguards and activity heatmaps for habit retention.
- **Enhanced Date Utilities (`src/lib/date.ts`)**:
  - Timezone-safe date arithmetic and formatters.
  - Relative date markers, overdue task badges, and smart timeline grouping.
- **Today Dashboard Enhancements**:
  - Real-time task completion toggle filtering (all vs. pending vs. completed).
  - Live metric synchronization across top progress bars and streak widgets.
- **Full Release Notes & Documentation**:
  - Updated in-app About settings card to v0.4.0 with detailed changelog breakdown.
  - Revamped `README.md` with complete project architecture and instructions.

### Changed
- Bumped `package.json` and `package-lock.json` version to `0.4.0`.
- Refined component styling in `TodayTasksListCard`, `MetricCardsRow`, and `TodayGlanceWidget` for tighter alignment and crisp hairline borders.

---

## [0.3.0] - 2026-11-07

### Added
- **Supabase Cloud Sync & Authentication**:
  - User signup/login modal (`AuthModal.tsx`).
  - Remote database schema with PostgreSQL row-level security (`supabase_schema.sql`).
  - Offline-first Dexie to Supabase cloud sync adapter (`taskService.ts`).
- **Tactile Sound Effects**:
  - Sound effects for task completion, timers, drawer opening/closing, and deletions.
- **Vercel Production Configuration**:
  - Added `vercel.json` with Single Page Application rewrites and cache headers.

---

## [0.2.1] - 2026-11-06

### Added
- Core task management, projects grid, stats charts, and Pomodoro timer.
- Command palette (`Cmd/Ctrl + K`) for rapid task creation and quick navigation.
- Initial local IndexedDB storage with Dexie.js.
