import { X } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm min-w-[300px] max-w-[400px]"
          style={{
            background: toast.type === 'success' ? '#0d3d2e' : '#3d1515',
            border: `1px solid ${toast.type === 'success' ? '#0d9e7a' : '#ef4444'}`,
            color: '#e2e8f0',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] shrink-0"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
