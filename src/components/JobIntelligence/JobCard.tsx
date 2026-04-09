import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, X } from 'lucide-react'
import type { Job, DeepResearch, Outreach as OutreachType, FormAnswer } from '../../lib/types'
import { StatusBadge } from '../ui/Badge'
import { JDAnalysisPanel } from './JDAnalysis'
import { EnhancedAnalysisPanel } from './EnhancedAnalysis'

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
  onTailorCV: (jdText: string) => void
  onResearch: (job: Job) => Promise<DeepResearch | null>
  onOutreach: (job: Job) => Promise<OutreachType | null>
  onApplication: (job: Job) => Promise<{ answers: FormAnswer[]; cover_letter: string } | null>
}

export function JobCard({ job, onEdit, onDelete, onTailorCV, onResearch, onOutreach, onApplication }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [researching, setResearching] = useState(false)
  const [outreaching, setOutreaching] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [research, setResearch] = useState<DeepResearch | null>(null)
  const [outreach, setOutreach] = useState<OutreachType | null>(null)
  const [appAnswers, setAppAnswers] = useState<{ answers: FormAnswer[]; cover_letter: string } | null>(null)

  const handleResearch = async () => {
    setResearching(true)
    try {
      const r = await onResearch(job)
      if (r && 'research' in r && typeof r.research === 'object') {
        setResearch(r.research as DeepResearch)
      } else {
        setResearch(r as DeepResearch | null)
      }
    } finally { setResearching(false) }
  }

  const handleOutreach = async () => {
    setOutreaching(true)
    try {
      const o = await onOutreach(job)
      setOutreach(o)
    } finally { setOutreaching(false) }
  }

  const handleApplication = async () => {
    setGenerating(true)
    try {
      const a = await onApplication(job)
      setAppAnswers(a)
    } finally { setGenerating(false) }
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
          <div className="min-w-0">
            <span className="font-medium text-sm">{job.title}</span>
            <span className="text-[var(--text-muted)] text-sm ml-2">
              {job.company}
              {job.location && ` - ${job.location}`}
              {job.salary && ` - ${job.salary}`}
            </span>
            {(job.archetype || job.enhanced_analysis?.archetype) && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}>
                {job.archetype || job.enhanced_analysis?.archetype}
              </span>
            )}
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={job.status} />
          <button className="btn-ghost !p-1.5" onClick={() => onEdit(job)} title="Edit">
            <Pencil size={14} />
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-1 text-xs">
              <span className="text-[var(--text-muted)]">Delete?</span>
              <button className="text-[var(--danger)] text-xs font-medium" onClick={() => { onDelete(job.id); setConfirmDelete(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>Yes</button>
              <button className="text-[var(--text-muted)] text-xs" onClick={() => setConfirmDelete(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>No</button>
            </span>
          ) : (
            <button className="btn-ghost !p-1.5" onClick={() => setConfirmDelete(true)} title="Delete"><X size={14} /></button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          {/* Enhanced Analysis (preferred) */}
          {job.enhanced_analysis ? (
            <EnhancedAnalysisPanel
              analysis={job.enhanced_analysis}
              job={job}
              onResearch={handleResearch}
              onOutreach={handleOutreach}
              onApplication={handleApplication}
              researching={researching}
              outreaching={outreaching}
              generating={generating}
            />
          ) : job.analysis ? (
            <JDAnalysisPanel
              analysis={job.analysis}
              onTailorCV={() => onTailorCV(job.jd_text)}
            />
          ) : (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              Click &quot;Analyse with Claude&quot; above to generate analysis
            </p>
          )}

          {/* Research Results */}
          {research && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--teal)] mb-2">Deep Company Research</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {([
                  ['AI Strategy', research.ai_strategy],
                  ['Recent Movements', research.recent_movements],
                  ['Engineering Culture', research.engineering_culture],
                  ['Probable Challenges', research.probable_challenges],
                  ['Competitors', research.competitors],
                  ['Your Angle', research.candidate_angle],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[var(--text-muted)] mb-0.5">{label}</p>
                    <p className="text-[var(--text-secondary)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outreach Results */}
          {outreach && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--teal)] mb-2">LinkedIn Outreach</p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Connection Request (300 chars)</p>
                  <p className="text-[var(--text-secondary)] bg-[var(--bg)] p-2 rounded">{outreach.connection_message}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Follow-up Message</p>
                  <p className="text-[var(--text-secondary)] bg-[var(--bg)] p-2 rounded">{outreach.follow_up_message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Application Answers */}
          {appAnswers && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--teal)] mb-2">Application Answers</p>
              <div className="space-y-3 text-xs">
                {appAnswers.answers.map((a, i) => (
                  <div key={i}>
                    <p className="text-[var(--text-muted)] mb-0.5">Q: {a.question}</p>
                    <p className="text-[var(--text-secondary)] bg-[var(--bg)] p-2 rounded">{a.answer}</p>
                  </div>
                ))}
                {appAnswers.cover_letter && (
                  <div>
                    <p className="text-[var(--text-muted)] mb-0.5">Cover Letter</p>
                    <p className="text-[var(--text-secondary)] bg-[var(--bg)] p-2 rounded whitespace-pre-wrap">{appAnswers.cover_letter}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
