import { useState } from 'react'
import { Spinner } from '../ui/Spinner'
import type { Story } from '../../lib/types'

interface StoryFormProps {
  onSubmit: (story: Omit<Story, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  initial?: Story | null
  onCancel?: () => void
}

export function StoryForm({ onSubmit, initial, onCancel }: StoryFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [situation, setSituation] = useState(initial?.situation ?? '')
  const [task, setTask] = useState(initial?.task ?? '')
  const [action, setAction] = useState(initial?.action ?? '')
  const [result, setResult] = useState(initial?.result ?? '')
  const [reflection, setReflection] = useState(initial?.reflection ?? '')
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(', ') ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}
    if (!title.trim()) newErrors.title = true
    if (!situation.trim()) newErrors.situation = true
    if (!task.trim()) newErrors.task = true
    if (!action.trim()) newErrors.action = true
    if (!result.trim()) newErrors.result = true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        situation: situation.trim(),
        task: task.trim(),
        action: action.trim(),
        result: result.trim(),
        reflection: reflection.trim(),
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        linked_jobs: initial?.linked_jobs ?? [],
      })
      if (!initial) {
        setTitle('')
        setSituation('')
        setTask('')
        setAction('')
        setResult('')
        setReflection('')
        setTagsInput('')
      }
    } catch {
      // handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: false })) }}
          placeholder="Led cloud migration for 200-node cluster"
          style={errors.title ? { borderColor: 'var(--danger)' } : undefined}
        />
        {errors.title && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Situation *</label>
        <textarea
          value={situation}
          onChange={(e) => { setSituation(e.target.value); setErrors((p) => ({ ...p, situation: false })) }}
          rows={3}
          placeholder="What was the context? What challenge or opportunity did you face?"
          style={errors.situation ? { borderColor: 'var(--danger)' } : undefined}
        />
        {errors.situation && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Task *</label>
        <textarea
          value={task}
          onChange={(e) => { setTask(e.target.value); setErrors((p) => ({ ...p, task: false })) }}
          rows={3}
          placeholder="What was your specific responsibility or goal?"
          style={errors.task ? { borderColor: 'var(--danger)' } : undefined}
        />
        {errors.task && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Action *</label>
        <textarea
          value={action}
          onChange={(e) => { setAction(e.target.value); setErrors((p) => ({ ...p, action: false })) }}
          rows={3}
          placeholder="What steps did you take? Be specific about YOUR contribution."
          style={errors.action ? { borderColor: 'var(--danger)' } : undefined}
        />
        {errors.action && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Result *</label>
        <textarea
          value={result}
          onChange={(e) => { setResult(e.target.value); setErrors((p) => ({ ...p, result: false })) }}
          rows={3}
          placeholder="What was the outcome? Use numbers and metrics where possible."
          style={errors.result ? { borderColor: 'var(--danger)' } : undefined}
        />
        {errors.result && <p className="text-xs text-[var(--danger)] mt-1">Required</p>}
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Reflection (the +R that signals seniority)</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          placeholder="What did you learn? What would you do differently? How did this shape your approach?"
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-muted)] mb-1">Tags (comma-separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="leadership, migration, cost-saving"
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary flex-1" disabled={submitting}>
          {submitting ? <Spinner /> : 'Save Story'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
