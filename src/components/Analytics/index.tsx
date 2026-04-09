import { useState, useMemo } from 'react'
import { useJobs } from '../../hooks/useJobs'
import { usePostMortems } from '../../hooks/usePostMortems'
import { useAI } from '../../hooks/useAI'
import { useToast } from '../../contexts/ToastContext'
import { analysePatterns } from '../../lib/ai'
import { Spinner } from '../ui/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { ConversionFunnel } from './ConversionFunnel'
import { PatternInsights } from './PatternInsights'
import type { PatternAnalysis, Job } from '../../lib/types'

function computeAvgFitScore(jobs: Job[]): number {
  const scored = jobs.filter((j) => j.analysis?.fit_score != null)
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, j) => acc + (j.analysis?.fit_score ?? 0), 0)
  return Math.round(sum / scored.length)
}

function computeResponseRate(jobs: Job[]): number {
  if (jobs.length === 0) return 0
  const responded = jobs.filter((j) =>
    ['interview', 'offer', 'rejected'].includes(j.status)
  ).length
  const applied = jobs.filter((j) => j.status !== 'new').length
  if (applied === 0) return 0
  return Math.round((responded / applied) * 100)
}

export default function Analytics() {
  const { jobs, loading: jobsLoading } = useJobs()
  const { postMortems, loading: pmsLoading } = usePostMortems()
  const { provider, model, apiKey, hasKey } = useAI()
  const { showToast } = useToast()

  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null)
  const [analysing, setAnalysing] = useState(false)

  const loading = jobsLoading || pmsLoading

  const avgFitScore = useMemo(() => computeAvgFitScore(jobs), [jobs])
  const responseRate = useMemo(() => computeResponseRate(jobs), [jobs])

  const metrics = useMemo(
    () => [
      { label: 'Total Roles', value: jobs.length },
      { label: 'Avg Fit Score', value: avgFitScore },
      { label: 'Post-Mortems', value: postMortems.length },
      { label: 'Response Rate', value: `${responseRate}%` },
    ],
    [jobs.length, avgFitScore, postMortems.length, responseRate]
  )

  const handleAnalyse = async () => {
    if (!apiKey) {
      showToast('error', 'Set an API key in Settings first')
      return
    }
    setAnalysing(true)
    try {
      const result = await analysePatterns(jobs, postMortems, provider, model, apiKey)
      setAnalysis(result)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Pattern analysis failed')
    } finally {
      setAnalysing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} />
      </div>
    )
  }

  if (jobs.length < 3) {
    return (
      <EmptyState
        icon="📊"
        heading="Not enough data yet"
        subtext="Add at least 3 tracked roles for meaningful analytics"
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card text-center">
            <p className="text-2xl font-bold text-[var(--text)]">{m.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Conversion funnel */}
      <ConversionFunnel jobs={jobs} />

      {/* AI analysis trigger */}
      {!analysis && (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Generate an AI-powered pattern analysis across all your tracked roles and
            post-mortems.
          </p>
          <button
            className="btn-primary"
            onClick={handleAnalyse}
            disabled={analysing || !hasKey}
            style={{ minWidth: 240 }}
          >
            {analysing ? (
              <>
                <Spinner size={14} /> Analysing...
              </>
            ) : (
              'Generate AI Pattern Analysis'
            )}
          </button>
        </div>
      )}

      {/* AI results */}
      {analysis && <PatternInsights analysis={analysis} />}
    </div>
  )
}
