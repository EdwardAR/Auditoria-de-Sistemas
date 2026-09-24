import { createContext, useCallback, useMemo, useState } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const dismiss = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), [])
  const show = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => dismiss(id), 4000)
  }, [dismiss])
  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-3" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 text-sm shadow-card backdrop-blur-xl">
              {toast.type === 'error' ? <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />}
              <span className="flex-1 font-medium text-slate-700">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} aria-label="Cerrar notificación"><X className="h-4 w-4 text-slate-400" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
