-- ==============================================================================
-- TASKCOMP / MODERN TODO APP - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this complete script in the Supabase Dashboard -> SQL Editor -> New Query.
-- It initializes all tables, Row Level Security (RLS) policies, indexes, and triggers.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
-- Mirrors authentication users and stores user-level preferences
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT DEFAULT 'User',
  current_space TEXT DEFAULT 'Personal Space',
  streak_days INTEGER DEFAULT 1,
  start_of_week TEXT DEFAULT 'Monday',
  date_format TEXT DEFAULT 'DD MMM, YYYY',
  time_format TEXT DEFAULT '12-hour',
  language TEXT DEFAULT 'English',
  default_task_view TEXT DEFAULT 'list',
  auto_mark_done BOOLEAN DEFAULT TRUE,
  archive_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  color TEXT DEFAULT '#2563EB',
  icon TEXT DEFAULT 'laptop',
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  due_date TEXT DEFAULT 'No due date',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Study',
  completed INTEGER DEFAULT 0 CHECK (completed IN (0, 1)),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  flagged BOOLEAN DEFAULT FALSE,
  starred BOOLEAN DEFAULT FALSE,
  due_date TEXT DEFAULT 'Today',
  estimated_time TEXT DEFAULT '30 min',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCHEDULE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.schedule_items (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  time_str TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT DEFAULT '45 min',
  item_type TEXT DEFAULT 'study',
  completed INTEGER DEFAULT 0 CHECK (completed IN (0, 1)),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON public.tasks(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_schedule_user_id ON public.schedule_items(user_id);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

-- 8. ROW LEVEL SECURITY POLICIES

-- User Profiles: Users can only select and update their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Projects Policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks Policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Schedule Items Policies
DROP POLICY IF EXISTS "Users can view own schedule" ON public.schedule_items;
CREATE POLICY "Users can view own schedule"
  ON public.schedule_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own schedule" ON public.schedule_items;
CREATE POLICY "Users can insert own schedule"
  ON public.schedule_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own schedule" ON public.schedule_items;
CREATE POLICY "Users can update own schedule"
  ON public.schedule_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own schedule" ON public.schedule_items;
CREATE POLICY "Users can delete own schedule"
  ON public.schedule_items FOR DELETE
  USING (auth.uid() = user_id);

-- 9. AUTOMATIC TIMESTAMP UPDATE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER tr_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_tasks_updated_at ON public.tasks;
CREATE TRIGGER tr_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_schedule_updated_at ON public.schedule_items;
CREATE TRIGGER tr_schedule_updated_at
  BEFORE UPDATE ON public.schedule_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, user_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Done! Your Supabase database is fully prepared for TaskComp.
