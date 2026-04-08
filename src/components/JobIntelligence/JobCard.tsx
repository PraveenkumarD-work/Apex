import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, X } from 'lucide-react'
import type { Job } from '../../lib/types'
import { StatusBadge } from '../ui/Badge'
import { JDAnalysisPanel } from './JDAnalysis'

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
  onTailorCV: (jdText: string) => void
}

export function JobCard({ job, onEdit, onDelete, onTailorCV }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="card mb-3">
      <div className="flex items-center justify-between gap-3">
        <button
          className="flex-1 flex items-center gap-2 text-left"
          onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', width: 'auto' }}
        >
          {expanded ? <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0" /> : <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />}
          <div className="min-w-0">
            <span className="font-medium text-sm">{job.title}</span>
            <span className="text-[var(--text-muted)] text-sm ml-2">
              {job.company}
              {job.location && ` · ${job.location}`}
              {job.salary && ` · ${job.salary}`}
            </span>
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={job.status} />
          <button
            className="btn-ghost !p-1.5"
            onClick={() => onEdit(job)}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-1 text-xs">
              <span className="text-[var(--text-muted)]">Delete?</span>
              <button
                className="text-[var(--danger)] text-xs font-medium"
                onClick={() => { onDelete(job.id); setConfirmDelete(false) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
              >
                Yes
              </button>
              <button
                className="text-[var(--text-muted)] text-xs"
                onClick={() => setConfirmDelete(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
              >
                No
              </button>
            </span>
          ) : (
            <button
              className="btn-ghost !p-1.5"
              onClick={() => setConfirmDelete(true)}
              title="Delete"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          {job.analysis ? (
            <JDAnalysisPanel
              analysis={job.analysis}
              onTailorCV={() => onTailorCV(job.jd_text)}
            />
          ) : (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              Click &quot;Analyse with Claude&quot; above to generate analysis
            </p>
          )}
        </div>
      )}
    </div>
  )
}
