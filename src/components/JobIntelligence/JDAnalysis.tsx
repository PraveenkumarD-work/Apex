import { AlertTriangle, Copy, ArrowRight } from 'lucide-react'
import type { JDAnalysis as JDAnalysisType } from '../../lib/types'
import { KeywordBadge } from '../ui/Badge'
import { useToast } from '../../contexts/ToastContext'

interface JDAnalysisProps {
  analysis: JDAnalysisType
  onTailorCV: () => void
}

export function JDAnalysisPanel({ analysis, onTailorCV }: JDAnalysisProps) {
  const { showToast } = useToast()

  const scoreColor =
    analysis.fit_score >= 70 ? '#22c55e' : analysis.fit_score >= 50 ? '#f59e0b' : '#ef4444'

  const handleCopy = async () => {
    const text = `Fit Score: ${analysis.fit_score}/100\n${analysis.fit_reasoning}\n\nKeywords: ${analysis.keywords.join(', ')}\n\nHypothesis: ${analysis.hypothesis}\n\nSuccess in 90 Days: ${analysis.success_90_days}\n\nGap: ${analysis.gap}`
    await navigator.clipboard.writeText(text)
    showToast('success', 'Analysis copied')
  }

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
      <div className="flex items-start gap-6 flex-wrap">
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Fit Score</p>
          <p className="text-3xl font-bold" style={{ color: scoreColor }}>
            {analysis.fit_score}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs">
            {analysis.fit_reasoning}
          </p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Top Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.map((kw) => (
              <KeywordBadge key={kw}>{kw}</KeywordBadge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-1">Why this role exists</p>
        <p className="text-sm text-[var(--text-secondary)]">{analysis.hypothesis}</p>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-1">Success in 90 days</p>
        <p className="text-sm text-[var(--text-secondary)]">{analysis.success_90_days}</p>
      </div>

      <div className="flex items-start gap-2">
        <AlertTriangle size={14} className="text-[var(--warning)] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Gap to address</p>
          <p className="text-sm text-[var(--warning)]">{analysis.gap}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost text-sm" onClick={handleCopy}>
          <Copy size={14} /> Copy Analysis
        </button>
        <button className="btn-primary text-sm" onClick={onTailorCV}>
          <ArrowRight size={14} /> Tailor CV for this role
        </button>
      </div>
    </div>
  )
}
