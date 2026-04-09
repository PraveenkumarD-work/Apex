import type { PatternAnalysis, Blocker, Recommendation } from '../../lib/types'

const IMPACT_STYLES: Record<Blocker['impact'], { bg: string; color: string }> = {
  high: { bg: '#3d1515', color: '#ef4444' },
  medium: { bg: '#3d2a00', color: '#f59e0b' },
  low: { bg: '#0d3d2e', color: '#22c55e' },
}

function ImpactBadge({ impact }: { impact: Blocker['impact'] }) {
  const s = IMPACT_STYLES[impact]
  return (
    <span
      style={{ background: s.bg, color: s.color }}
      className="px-2 py-0.5 rounded text-xs font-medium capitalize"
    >
      {impact}
    </span>
  )
}

function InterviewRateColor(rate: number): string {
  if (rate >= 50) return '#22c55e'
  if (rate >= 25) return '#f59e0b'
  return '#ef4444'
}

export function PatternInsights({ analysis }: { analysis: PatternAnalysis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Score vs Outcome */}
      <div className="card">
        <h3 style={{ color: 'var(--text)', marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
          Score vs Outcome
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Range', 'Applied', 'Interview', 'Offer', 'Rejected'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      borderBottom: '1px solid var(--border)',
                      fontSize: 12,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.score_vs_outcome.map((row) => (
                <tr key={row.range}>
                  <td style={{ padding: '8px 12px', color: 'var(--text)', fontWeight: 500 }}>
                    {row.range}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#60a5fa' }}>{row.applied}</td>
                  <td style={{ padding: '8px 12px', color: '#f59e0b' }}>{row.interview}</td>
                  <td style={{ padding: '8px 12px', color: '#22c55e' }}>{row.offer}</td>
                  <td style={{ padding: '8px 12px', color: '#ef4444' }}>{row.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archetype Performance */}
      <div className="card">
        <h3 style={{ color: 'var(--text)', marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
          Archetype Performance
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Archetype', 'Count', 'Avg Score', 'Interview Rate'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      borderBottom: '1px solid var(--border)',
                      fontSize: 12,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.archetype_performance.map((row) => (
                <tr key={row.archetype}>
                  <td style={{ padding: '8px 12px', color: 'var(--text)', fontWeight: 500 }}>
                    {row.archetype}
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{row.count}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>
                    {row.avg_score}
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      color: InterviewRateColor(row.interview_rate),
                      fontWeight: 500,
                    }}
                  >
                    {row.interview_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Blockers */}
      <div className="card">
        <h3 style={{ color: 'var(--text)', marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
          Top Blockers
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {analysis.top_blockers.map((b) => (
            <div
              key={b.blocker}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--surface)',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--text)', fontSize: 13 }}>{b.blocker}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  x{b.frequency}
                </span>
              </div>
              <ImpactBadge impact={b.impact} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 style={{ color: 'var(--text)', marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
          Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analysis.recommendations.map((rec: Recommendation, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                background: 'var(--surface)',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: 'var(--text)',
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 20,
                  }}
                >
                  {idx + 1}.
                </span>
                <span style={{ color: 'var(--text)', fontSize: 13, flex: 1 }}>
                  {rec.recommendation}
                </span>
                <ImpactBadge impact={rec.impact} />
              </div>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 12,
                  margin: 0,
                  paddingLeft: 30,
                  lineHeight: 1.5,
                }}
              >
                {rec.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
