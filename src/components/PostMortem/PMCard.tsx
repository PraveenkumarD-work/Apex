import { useState } from 'react'
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import type { PostMortem } from '../../lib/types'
import { OutcomeBadge } from '../ui/Badge'
import { PrepTips } from './PrepTips'
import { Spinner } from '../ui/Spinner'

interface PMCardProps {
  pm: PostMortem
  onDelete: (id: string) => void
  onGenerateTips: (pm: PostMortem) => Promise<void>
  hasApiKey: boolean
}

export function PMCard({ pm, onDelete, onGenerateTips, hasApiKey }: PMCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(false)

  const date = new Date(pm.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await onGenerateTips(pm)
    } finally {
      setGenerating(false)
    }
  }

  const fields = [
    { label: 'What went well', value: pm.went_well },
    { label: 'Where I struggled', value: pm.struggled },
    { label: 'Questions asked', value: pm.questions_asked },
    { label: 'Vibe & culture signals', value: pm.vibe_notes },
  ]

  return (
    <div className="card mb-3">
      <div className="flex items-center justify-between gap-3">
        <button
          className="flex-1 flex items-center gap-2 text-left"
          onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', width: 'auto' }}
        >
          {expanded ? <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0" /> : <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />}
          <div>
            <span className="font-medium text-sm">{pm.company}</span>
            <span className="text-[var(--text-muted)] text-sm ml-2">{pm.role}</span>
          </div>
        </button>
        <div className="flex items-center gap-3 shrink-0">
          <OutcomeBadge outcome={pm.outcome} />
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">{date}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="text-xs text-[var(--text-muted)]">
            Round: {pm.round}
          </div>
          {fields.map((f) =>
            f.value ? (
              <div key={f.label}>
                <p className="text-xs text-[var(--text-muted)] mb-1">{f.label}</p>
                <p className="text-sm text-[var(--text-secondary)]">{f.value}</p>
              </div>
            ) : null
          )}

          <div className="flex gap-3 mt-3">
            <button
              className="btn-primary text-sm"
              onClick={handleGenerate}
              disabled={generating || !hasApiKey}
              title={!hasApiKey ? 'Add your Claude API key in Settings' : undefined}
            >
              {generating ? <Spinner /> : 'Generate Prep Tips'}
            </button>
            <button className="btn-danger text-sm" onClick={() => onDelete(pm.id)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>

          <PrepTips
            tips={pm.prep_tips}
            onRegenerate={handleGenerate}
            regenerating={generating}
            hasApiKey={hasApiKey}
          />
        </div>
      )}
    </div>
  )
}
