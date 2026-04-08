import { RefreshCw } from 'lucide-react'
import { Spinner } from '../ui/Spinner'

interface PrepTipsProps {
  tips: string[]
  onRegenerate: () => void
  regenerating: boolean
  hasApiKey: boolean
}

export function PrepTips({ tips, onRegenerate, regenerating, hasApiKey }: PrepTipsProps) {
  if (tips.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)]">
      <p className="text-xs text-[var(--text-muted)] mb-3">Prep Tips</p>
      <ol className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ background: '#0d3d2e', color: '#0d9e7a' }}
            >
              {i + 1}
            </span>
            <span className="text-sm text-[var(--text-secondary)] pt-0.5">{tip}</span>
          </li>
        ))}
      </ol>
      <button
        className="btn-ghost text-sm mt-3"
        onClick={onRegenerate}
        disabled={regenerating || !hasApiKey}
        title={!hasApiKey ? 'Add your Claude API key in Settings' : undefined}
      >
        {regenerating ? <Spinner /> : <><RefreshCw size={14} /> Regenerate</>}
      </button>
    </div>
  )
}
