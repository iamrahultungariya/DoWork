# DoWork (TaskComp) 🚀

A high-performance, offline-first task management and daily productivity companion built with React 19, Tailwind CSS v4, Dexie.js (IndexedDB), and Supabase.

---

## 📦 Version 0.4.0 Release Notes

### What's New in v0.4.0
- **Dynamic Streak Engine (`streak.ts`)**:
  - Intelligent multi-day consistency calculations with streak freeze protection.
  - Heatmap tracking for completed daily habits and productivity trends.
  - Real-time milestone updates on the dashboard.
- **Enhanced Date & Scheduling Utilities (`date.ts`)**:
  - Timezone-safe date comparisons, range parsing, and smart overdue indicators.
  - Granular relative timestamps and schedule grouping.
- **Today View Enhancements**:
  - Quick-toggle completion filters for pending vs. completed tasks.
  - Dynamic metrics calculation (completed counts, focus time, productivity score).
  - Smooth animated transitions for task interactions.
- **Supabase Cloud Sync & Audio Feedback**:
  - Optional cloud backup & multi-device sync with Supabase authentication.
  - Tactile auditory responses for user actions (task completion, timers, modals).
- **Package Version Alignment**:
  - Bumped core package version to `0.4.0`.

---

## ✨ Features

- **Offline-First Storage**: Instant response times with Dexie (IndexedDB) with zero loading spinners for local data.
- **Cloud Sync & Auth**: Seamless account syncing powered by Supabase with guest mode support.
- **Focus Timer**: Built-in Pomodoro/Focus timer integrated directly into today's tasks and statistics.
- **Studio Obsidian Dark Mode**: Zero-flicker dark mode theme engine with warm zinc undertones.
- **Command Palette**: Fast keyboard-driven navigation (`Cmd/Ctrl + K`) to search tasks, toggle views, or trigger actions.
- **Comprehensive Analytics**: Task distribution breakdown, weekly velocity, and streak progress charts.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Database**: [Dexie.js](https://dexie.org/) (IndexedDB)
- **Cloud Backend**: [Supabase](https://supabase.com/)
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Sound Engine**: [Howler.js](https://howlerjs.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/iamrahultungariya/DoWork.git
cd DoWork

# Install dependencies
npm install

# Setup environment variables (optional, for Supabase cloud sync)
cp .env.example .env
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
