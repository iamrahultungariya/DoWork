import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen)
  const authMode = useAuthStore((s) => s.authMode)
  const setAuthMode = useAuthStore((s) => s.setAuthMode)
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal)
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const showToast = useUIStore((s) => s.showToast)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isAuthModalOpen) return null

  // In non-dev/production environments, guest bypass is completely eliminated
  const isDevMode = import.meta.env.DEV

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          setErrorMessage(error)
        } else {
          showToast('Welcome back! Cloud sync is now active.', 'success')
          closeAuthModal()
        }
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setErrorMessage(error)
        } else {
          showToast('Account created! Please check your email to confirm.', 'success')
          closeAuthModal()
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevOfflineSkip = () => {
    closeAuthModal()
    showToast('[Dev] Continuing in local offline mode', 'info')
  }

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs"
        />

        {/* Compact, Sleek Modal Card */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#18181B] rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-5 sm:p-6 z-10 overflow-hidden text-[#111827] dark:text-[#F4F4F5]"
        >
          {/* Top Bar: Brand & Close Button */}
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-[#18181B] dark:bg-white text-white dark:text-[#09090B] flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-[#111827] dark:text-[#F4F4F5]">
                TaskComp
              </span>
            </div>

            <button
              type="button"
              onClick={closeAuthModal}
              className="p-1.5 rounded-lg text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="p-1 bg-neutral-100 dark:bg-zinc-800/80 rounded-xl border border-black/[0.04] dark:border-white/[0.08] grid grid-cols-2 gap-1 my-3.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                setErrorMessage(null)
              }}
              className={cn(
                'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                authMode === 'login'
                  ? 'bg-white dark:bg-[#202024] text-[#111827] dark:text-white shadow-2xs'
                  : 'text-neutral-500 dark:text-zinc-400 hover:text-[#111827] dark:hover:text-white'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup')
                setErrorMessage(null)
              }}
              className={cn(
                'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                authMode === 'signup'
                  ? 'bg-white dark:bg-[#202024] text-[#111827] dark:text-white shadow-2xs'
                  : 'text-neutral-500 dark:text-zinc-400 hover:text-[#111827] dark:hover:text-white'
              )}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Compact Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name (Sign Up only) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] dark:text-[#D4D4D8] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-[#111827] dark:text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 text-xs font-bold text-white dark:text-[#09090B] bg-[#18181B] dark:bg-white hover:bg-[#27272A] dark:hover:bg-neutral-100 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Dev-only subtle fallback (completely stripped from production) */}
          {isDevMode && (
            <div className="mt-3.5 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] text-center">
              <button
                type="button"
                onClick={handleDevOfflineSkip}
                className="text-[10px] text-neutral-400 dark:text-zinc-500 hover:text-neutral-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                [Dev Only] Continue offline
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
