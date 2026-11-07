import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-project-id')
  )
}

// Fallback placeholder credentials to prevent client crashes when env vars are missing
const DEFAULT_URL = 'https://placeholder.supabase.co'
const DEFAULT_KEY = 'placeholder-anon-key'

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? (supabaseUrl as string) : DEFAULT_URL,
  isSupabaseConfigured() ? (supabaseAnonKey as string) : DEFAULT_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
