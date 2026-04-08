import { useState } from 'react'
import { Spinner } from '../ui/Spinner'
import type { JobStatus, Job } from '../../lib/types'

interface JobFormProps {
  onSubmit: (job: {
    title: string
    company: string
    location: string
    salary: string
    status: JobStatus
    jd_text: string
    analysis: null
  }) => Promise<void>
  onAnalyse: (jdText: string) => Promise<void>
  hasApiKey: boolean
  editingJob?: Job | null
  onCancelEdit?: () => void
}

const STATUS_OPTIONS: JobStatus[] = ['new', 'applied', 'interview', 'rejected', 'offer']

export function JobForm({ onSubmit, onAnalyse, hasApiKey, editingJob, onCancelEdit }: JobFormProps) {
  const [title, setTitle] = useState(editingJob?.title ?? '')
  const [company, setCompany] = useState(editingJob?.company ?? '')
  const [location, setLocation] = useState(editingJob?.location ?? '')
  const [salary, setSalary] = useState(editingJob?.salary ?? '')
  const [status, setStatus] = useState<JobStatus>(editingJob?.status ?? 'new')
  const [jdText, setJdText] = useState(editingJob?.jd_text ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [analysing, setAnalysing] = useState(false)

  const resetForm = () => {
    setTitle('')
    setCompany('')
    setLocation('')
    setSalary('')
    setStatus('new')
    setJdText('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !company.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary.trim(),
        status,
        jd_text: jdText.trim(),
        analysis: null,
      })
      resetForm()
      onCancelEdit?.()
    } catch {
      // error handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnalyse = async () => {
    if (!jdText.trim()) return
    setAnalysing(true)
    try {
      await onAnalyse(jdText)
    } finally {
      setAnalysing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Manager" required />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Company *</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" required />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote" />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Salary</label>
          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$120k-$150k" />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={6}
          placeholder="Paste the full job description here..."
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={submitting || !title.trim() || !company.trim()}>
          {submitting ? <Spinner /> : editingJob ? 'Update Role' : 'Add Role'}
        </button>
        {editingJob && (
          <button type="button" className="btn-ghost" onClick={() => { resetForm(); onCancelEdit?.() }}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="btn-primary flex-1 sm:flex-none"
          disabled={analysing || !jdText.trim() || !hasApiKey}
          onClick={handleAnalyse}
          title={!hasApiKey ? 'Add your Claude API key in Settings' : undefined}
        >
          {analysing ? <Spinner /> : 'Analyse with Claude'}
        </button>
      </div>
    </form>
  )
}
