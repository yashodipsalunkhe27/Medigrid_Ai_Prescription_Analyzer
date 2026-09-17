import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)
let idCounter = 0

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'info', duration = 4500) => {
      const id = ++idCounter
      setToasts((t) => [...t, { id, message, type }])
      if (duration) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const toast = {
    success: (msg, duration) => push(msg, 'success', duration),
    warning: (msg, duration) => push(msg, 'warning', duration),
    error: (msg, duration) => push(msg, 'error', duration),
    info: (msg, duration) => push(msg, 'info', duration),
    dismiss,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          const colors = {
            success: 'border-success/30 text-success',
            warning: 'border-warning/30 text-warning',
            error: 'border-critical/30 text-critical',
            info: 'border-accent/30 text-accent',
          }[t.type]
          return (
            <div
              key={t.id}
              role="status"
              className={`animate-fade-slide-up flex items-start gap-3 rounded-lg border bg-surface shadow-popover px-4 py-3 ${colors}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-sm text-ink flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
