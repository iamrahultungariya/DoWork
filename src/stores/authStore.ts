import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { syncFromSupabase } from '@/db/taskService'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authMode: 'login' | 'signup'

  // Actions
  openAuthModal: (mode?: 'login' | 'signup') => void
  closeAuthModal: () => void
  setAuthMode: (mode: 'login' | 'signup') => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  initialize: () => void
}

let authSubscription: { unsubscribe: () => void } | null = null

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthModalOpen: false,
  authMode: 'login',

  openAuthModal: (mode = 'login') => {
    set({ isAuthModalOpen: true, authMode: mode })
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false })
  },

  setAuthMode: (authMode) => {
    set({ authMode })
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase URL and Anon Key are not yet configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        return { error: error.message }
      }

      set({ user: data.user, session: data.session, isAuthModalOpen: false })
      if (data.user) {
        syncFromSupabase(data.user.id).catch(console.error)
      }
      return { error: null }
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Failed to sign in' }
    }
  },

  signUp: async (email, password, fullName) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase URL and Anon Key are not yet configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      set({ user: data.user, session: data.session, isAuthModalOpen: false })
      return { error: null }
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Failed to create account' }
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut().catch(() => {})
    }
    set({ user: null, session: null })
  },

  initialize: () => {
    if (!isSupabaseConfigured()) {
      set({ isLoading: false, user: null, session: null })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      })
      if (session?.user) {
        syncFromSupabase(session.user.id).catch(console.error)
      }
    })

    if (authSubscription) {
      authSubscription.unsubscribe()
      authSubscription = null
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      })
      if (session?.user) {
        syncFromSupabase(session.user.id).catch(console.error)
      }
    })
    authSubscription = subscription
  },
}))
