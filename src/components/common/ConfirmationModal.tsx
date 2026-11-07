import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { Button } from './Button'

export function ConfirmationModal() {
  const confirmModal = useUIStore((s) => s.confirmModal)
  const closeConfirm = useUIStore((s) => s.closeConfirm)
  const { isOpen, title, message, confirmLabel, onConfirm } = confirmModal

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        closeConfirm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeConfirm])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    closeConfirm()
  }

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeConfirm}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#18181B] rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl p-5 sm:p-6 z-10 select-none"
        >
          {/* Close Icon */}
          <button
            type="button"
            onClick={closeConfirm}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon & Content */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/50 mb-4 shadow-2xs">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="text-base font-bold text-[#111827] dark:text-[#F4F4F5] tracking-tight">{title}</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1.5 leading-relaxed max-w-[280px]">
              {message}
            </p>
          </div>

          {/* Actions with Squircle Buttons and Generous Padding */}
          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={closeConfirm}
              className="flex-1 rounded-xl sm:rounded-2xl text-xs font-semibold py-2.5"
            >
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl sm:rounded-2xl bg-rose-600 text-white hover:bg-rose-700 active:scale-98 transition-all shadow-xs cursor-pointer"
            >
              {confirmLabel || 'Delete'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
