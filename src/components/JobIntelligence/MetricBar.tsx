import type { Job } from '../../lib/types'

export function MetricBar({ jobs }: { jobs: Job[] }) {
  const totalRoles = jobs.length
  const applied = jobs.filter((j) => ['applied', 'interview', 'offer'].includes(j.status)).length
  const inInterview = jobs.filter((j) => j.status === 'interview').length

  const metrics = [
    { label: 'Roles Tracked', value: totalRoles },
    { label: 'Applied', value: applied },
    { label: 'In Interview', value: inInterview },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {metrics.map((m) => (
        <div key={m.label} className="card text-center">
          <p className="text-2xl font-bold text-[var(--text)]">{m.value}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  )
}
