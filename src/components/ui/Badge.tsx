import type { JobStatus, PMOutcome } from '../../lib/types'

const statusStyles: Record<JobStatus, { bg: string; color: string }> = {
  new: { bg: '#0d3d2e', color: '#0d9e7a' },
  applied: { bg: '#1e3a5f', color: '#60a5fa' },
  interview: { bg: '#3d2a00', color: '#f59e0b' },
  rejected: { bg: '#3d1515', color: '#ef4444' },
  offer: { bg: '#0d3d2e', color: '#22c55e' },
}

const outcomeStyles: Record<PMOutcome, { bg: string; color: string }> = {
  Passed: { bg: '#0d3d2e', color: '#22c55e' },
  Rejected: { bg: '#3d1515', color: '#ef4444' },
  Ghosted: { bg: '#3d2a00', color: '#f59e0b' },
  Withdrew: { bg: '#1e2330', color: '#94a3b8' },
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const s = statusStyles[status]
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="px-2 py-0.5 rounded text-xs font-medium capitalize"
    >
      {status}
    </span>
  )
}

export function OutcomeBadge({ outcome }: { outcome: PMOutcome }) {
  const s = outcomeStyles[outcome]
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="px-2 py-0.5 rounded text-xs font-medium"
    >
      {outcome}
    </span>
  )
}

export function KeywordBadge({ children, variant = 'teal' }: { children: string; variant?: 'teal' | 'green' | 'red' }) {
  const styles = {
    teal: { bg: '#0d3d2e', color: '#0d9e7a' },
    green: { bg: '#0d3d2e', color: '#22c55e' },
    red: { bg: '#3d1515', color: '#ef4444' },
  }
  const s = styles[variant]
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="px-2 py-1 rounded text-xs font-medium inline-block"
    >
      {children}
    </span>
  )
}
