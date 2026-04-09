import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, Trash2, Link } from 'lucide-react'
import type { Story } from '../../lib/types'
import { KeywordBadge } from '../ui/Badge'
import { StoryForm } from './StoryForm'

interface StoryCardProps {
  story: Story
  onEdit: (storyId: string, updates: Partial<Story>) => Promise<void>
  onDelete: (id: string) => void
}

export function StoryCard({ story, onEdit, onDelete }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const date = new Date(story.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const sections = [
    { label: 'Situation', value: story.situation },
    { label: 'Task', value: story.task },
    { label: 'Action', value: story.action },
    { label: 'Result', value: story.result },
    { label: 'Reflection', value: story.reflection },
  ]

  const handleEditSubmit = async (updated: Omit<Story, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await onEdit(story.id, updated)
    setEditing(false)
  }

  if (editing) {
    return (
      <StoryForm
        onSubmit={handleEditSubmit}
        initial={story}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="card mb-3">
      <div className="flex items-center justify-between gap-3">
        <button
          className="flex-1 flex items-center gap-2 text-left"
          onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', width: 'auto' }}
        >
          {expanded ? <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0" /> : <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{story.title}</span>
            {story.tags.map((tag) => (
              <KeywordBadge key={tag} variant="teal">{tag}</KeywordBadge>
            ))}
          </div>
        </button>
        <div className="flex items-center gap-3 shrink-0">
          {story.linked_jobs.length > 0 && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Link size={12} /> {story.linked_jobs.length} job{story.linked_jobs.length !== 1 ? 's' : ''}
            </span>
          )}
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">{date}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {sections.map((s) =>
            s.value ? (
              <div key={s.label}>
                <p className="text-xs text-[var(--text-muted)] mb-1">{s.label}</p>
                <p className="text-sm text-[var(--text-secondary)]">{s.value}</p>
              </div>
            ) : null
          )}

          <div className="flex gap-3 mt-3">
            <button className="btn-primary text-sm" onClick={() => setEditing(true)}>
              <Pencil size={14} /> Edit
            </button>
            {!confirmDelete ? (
              <button className="btn-danger text-sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-[var(--text-muted)]">Sure?</span>
                <button className="btn-danger text-sm" onClick={() => { onDelete(story.id); setConfirmDelete(false) }}>
                  Yes
                </button>
                <button className="btn-secondary text-sm" onClick={() => setConfirmDelete(false)}>
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
