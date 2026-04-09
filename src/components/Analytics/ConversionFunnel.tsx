import type { Job, JobStatus } from '../../lib/types'

const STATUS_ORDER: JobStatus[] = ['new', 'applied', 'interview', 'offer', 'rejected']

const STATUS_COLORS: Record<JobStatus, string> = {
  new: '#0d9e7a',
  applied: '#60a5fa',
  interview: '#f59e0b',
  offer: '#22c55e',
  rejected: '#ef4444',
}

const STATUS_BG: Record<JobStatus, string> = {
  new: '#0d3d2e',
  applied: '#1e3a5f',
  interview: '#3d2a00',
  offer: '#0d3d2e',
  rejected: '#3d1515',
}

export function ConversionFunnel({ jobs }: { jobs: Job[] }) {
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: jobs.filter((j) => j.status === status).length,
  }))

  const maxCount = Math.max(...counts.map((c) => c.count), 1)
  const total = jobs.length || 1

  return (
    <div className="card">
      <h3
        style={{ color: 'var(--text)', marginBottom: 16, fontSize: 14, fontWeight: 600 }}
      >
        Conversion Funnel
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {counts.map(({ status, count }) => {
          const pct = Math.round((count / total) * 100)
          const barWidth = Math.max((count / maxCount) * 100, 0)
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 72,
                  fontSize: 12,
                  fontWeight: 500,
                  color: STATUS_COLORS[status],
                  textTransform: 'capitalize',
                  flexShrink: 0,
                }}
              >
                {status}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 24,
                  background: 'var(--surface)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: STATUS_BG[status],
                    borderRadius: 6,
                    transition: 'width 0.3s ease',
                    minWidth: count > 0 ? 24 : 0,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  minWidth: 56,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {count} ({pct}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
