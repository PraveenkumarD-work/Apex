import { useState } from 'react'
import { Spinner } from '../ui/Spinner'
import type { PMRound, PMOutcome } from '../../lib/types'

const ROUNDS: PMRound[] = ['Screening', 'Technical', 'Case Study', 'Culture Fit', 'Final']
const OUTCOMES: PMOutcome[] = ['Passed', 'Rejected', 'Ghosted', 'Withdrew']

interface PMFormProps {
  onSubmit: (pm: {
    company: string
    role: string
    round: PMRound
    outcome: PMOutcome
    went_well: string
    struggled: string
    questions_asked: string
    vibe_notes: string
    prep_tips: string[]
  }) => Promise<void>
}

export function PMForm({ onSubmit }: PMFormProps) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [round, setRound] = useState<PMRound>('Screening')
  const [outcome, setOutcome] = useState<PMOutcome>('Passed')
  const [wentWell, setWentWell] = useState('')
  const [struggled, setStruggled] = useState('')
  const [questionsAsked, setQuestionsAsked] = useState('')
  const [vibeNotes, setVibeNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}
    if (!company.trim()) newErrors.company = true
    if (!role.trim()) newErrors.role = true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit({
        company: company.trim(),
        role: role.trim(),
        round,
        outcome,
        went_well: wentWell.trim(),
        struggled: struggled.trim(),
        questions_asked: questionsAsked.trim(),
        vibe_notes: vibeNotes.trim(),
        prep_tips: [],
      })
      setCompany('')
      setRole('')
      setRound('Screening')
      setOutcome('Passed')
      setWentWell('')
      setStruggled('')
      setQuestionsAsked('')
      setVibeNotes('')
    } catch {
      // handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Company *</label>
          <input
            value={company}
            onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: false })) }}
            placeholder="Acme Corp"
            style={errors.company ? { borderColor: 'var(--danger)' } : undefined}
          />
          {errors.company && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Role *</label>
          <input
            value={role}
            onChange={(e) => { setRole(e.target.value); setErrors((p) => ({ ...p, role: false })) }}
            placeholder="Product Manager"
            style={errors.role ? { borderColor: 'var(--danger)' } : undefined}
          />
          {errors.role && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Round</label>
          <select value={round} onChange={(e) => setRound(e.target.value as PMRound)}>
            {ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as PMOutcome)}>
            {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">What went well</label>
        <textarea value={wentWell} onChange={(e) => setWentWell(e.target.value)} rows={3} placeholder="What went well in this round..." />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Where I struggled</label>
        <textarea value={struggled} onChange={(e) => setStruggled(e.target.value)} rows={3} placeholder="Areas where you struggled..." />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Questions I was asked</label>
        <textarea value={questionsAsked} onChange={(e) => setQuestionsAsked(e.target.value)} rows={3} placeholder="Key questions from the interview..." />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Interviewer vibe and culture signals</label>
        <textarea value={vibeNotes} onChange={(e) => setVibeNotes(e.target.value)} rows={3} placeholder="What did the company culture feel like..." />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? <Spinner /> : 'Save Post-Mortem'}
      </button>
    </form>
  )
}
