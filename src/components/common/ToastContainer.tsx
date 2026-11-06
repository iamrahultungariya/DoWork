import { motion, AnimatePresence } from 'framer-motion'
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { useUIStore, type ToastItem } from '@/stores/uiStore'

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />
    }
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-auto sm:w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="pointer-events-auto flex items-center justify-between p-3.5 bg-white border border-black/[0.08] rounded-xl shadow-lg shadow-black/5 text-[#111827] select-none"
          >
            <div className="flex items-center space-x-2.5 mr-3">
              {getIcon(toast.type)}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
