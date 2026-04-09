import { useState } from 'react'
import { AlertTriangle, Copy, ArrowRight, Building2, Send, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import type { EnhancedAnalysis, Job } from '../../lib/types'
import { KeywordBadge } from '../ui/Badge'
import { useToast } from '../../contexts/ToastContext'
import { useApp } from '../../contexts/AppContext'

interface Props {
  analysis: EnhancedAnalysis
  job: Job
  onResearch: () => void
  onOutreach: () => void
  onApplication: () => void
  researching: boolean
  outreaching: boolean
  generating: boolean
}

type Section = 'match' | 'level' | 'comp' | 'plan' | 'interview' | null

export function EnhancedAnalysisPanel({
  analysis, job, onResearch, onOutreach, onApplication,
  researching, outreaching, generating,
}: Props) {
  const { showToast } = useToast()
  const { setActiveTab, setPrefillJD } = useApp()
  const [openSection, setOpenSection] = useState<Section>('match')

  const { block_a, block_b, block_c, block_d, block_e, block_f } = analysis
  const scoreColor = block_b.fit_score >= 70 ? '#22c55e' : block_b.fit_score >= 50 ? '#f59e0b' : '#ef4444'

  const toggle = (s: Section) => setOpenSection(openSection === s ? null : s)

  const handleCopy = async () => {
    const text = `Fit Score: ${block_b.fit_score}/100\nArchetype: ${block_a.archetype}\n${block_b.fit_reasoning}\n\nKeywords: ${block_b.keywords.join(', ')}\n\nRole Summary: ${block_a.summary}\nSeniority: ${block_a.seniority} | Remote: ${block_a.remote_policy}\n\nLevel Strategy: ${block_c.strategy}\n\nSalary: ${block_d.salary_range}\nMarket: ${block_d.market_demand}`
    await navigator.clipboard.writeText(text)
    showToast('success', 'Analysis copied')
  }

  const SectionHeader = ({ id, title, icon }: { id: Section; title: string; icon: string }) => (
    <button
      onClick={() => toggle(id)}
      className="flex items-center gap-2 w-full text-left py-2"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px 0' }}
    >
      {openSection === id ? <ChevronDown size={14} className="text-[var(--text-muted)]" /> : <ChevronRight size={14} className="text-[var(--text-muted)]" />}
      <span className="text-xs">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </button>
  )

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
      {/* Header: Score + Archetype */}
      <div className="flex items-start gap-6 flex-wrap mb-4">
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Fit Score</p>
          <p className="text-3xl font-bold" style={{ color: scoreColor }}>{block_b.fit_score}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs">{block_b.fit_reasoning}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">Archetype</p>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}>
            {block_a.archetype}
          </span>
          <p className="text-xs text-[var(--text-muted)] mt-2">{block_a.seniority} - {block_a.remote_policy}</p>
          {block_a.team_size && <p className="text-xs text-[var(--text-muted)]">Team: {block_a.team_size}</p>}
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Top Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {block_b.keywords.slice(0, 12).map((kw) => (
              <KeywordBadge key={kw}>{kw}</KeywordBadge>
            ))}
          </div>
        </div>
      </div>

      {/* Block A: Role Summary */}
      <p className="text-sm text-[var(--text-secondary)]">{block_a.summary}</p>

      {/* Block B: CV Match */}
      <SectionHeader id="match" title="CV Match & Gaps" icon="B" />
      {openSection === 'match' && (
        <div className="pl-6 space-y-3">
          {block_b.requirements.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Requirement Mapping</p>
              <div className="space-y-1.5">
                {block_b.requirements.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className={`shrink-0 px-1.5 py-0.5 rounded ${
                      r.strength === 'strong' ? 'bg-[#0d3d2e] text-[#22c55e]' :
                      r.strength === 'moderate' ? 'bg-[#1e3a5f] text-[#60a5fa]' :
                      r.strength === 'weak' ? 'bg-[#3d2a00] text-[#f59e0b]' :
                      'bg-[#3d1515] text-[#ef4444]'
                    }`}>{r.strength}</span>
                    <span className="text-[var(--text-secondary)]">{r.requirement}</span>
                    {r.evidence && <span className="text-[var(--text-muted)]">- {r.evidence}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {block_b.gaps.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1">
                <AlertTriangle size={12} className="text-[var(--warning)]" /> Gaps & Mitigations
              </p>
              {block_b.gaps.map((g, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${
                      g.severity === 'critical' ? 'bg-[#3d1515] text-[#ef4444]' :
                      g.severity === 'moderate' ? 'bg-[#3d2a00] text-[#f59e0b]' :
                      'bg-[#1e2330] text-[#94a3b8]'
                    }`}>{g.severity}</span>
                    <span className="text-[var(--warning)]">{g.gap}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] ml-16 mt-0.5">Mitigation: {g.mitigation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Block C: Level Strategy */}
      <SectionHeader id="level" title="Level & Positioning Strategy" icon="C" />
      {openSection === 'level' && (
        <div className="pl-6 space-y-2">
          <div className="flex gap-4 text-xs">
            <span className="text-[var(--text-muted)]">Detected: <strong className="text-[var(--text)]">{block_c.detected_level}</strong></span>
            <span className="text-[var(--text-muted)]">Your level: <strong className="text-[var(--text)]">{block_c.natural_level}</strong></span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{block_c.strategy}</p>
          {block_c.sell_up_points.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Sell-up points</p>
              <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-0.5">
                {block_c.sell_up_points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {block_c.risk_factors.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Risk factors</p>
              <ul className="list-disc list-inside text-xs text-[var(--warning)] space-y-0.5">
                {block_c.risk_factors.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Block D: Comp & Demand */}
      <SectionHeader id="comp" title="Compensation & Market" icon="D" />
      {openSection === 'comp' && (
        <div className="pl-6 grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-[var(--text-muted)]">Salary Range</span><p className="text-[var(--text)] font-medium">{block_d.salary_range}</p></div>
          <div><span className="text-[var(--text-muted)]">Market Demand</span><p className="text-[var(--text-secondary)]">{block_d.market_demand}</p></div>
          <div><span className="text-[var(--text-muted)]">Company Reputation</span><p className="text-[var(--text-secondary)]">{block_d.company_reputation}</p></div>
          <div><span className="text-[var(--text-muted)]">Growth</span><p className="text-[var(--text-secondary)]">{block_d.growth_trajectory}</p></div>
        </div>
      )}

      {/* Block E: Personalization */}
      <SectionHeader id="plan" title="CV Personalization Plan" icon="E" />
      {openSection === 'plan' && (
        <div className="pl-6 space-y-3">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Suggested Positioning Summary</p>
            <p className="text-sm text-[var(--text-secondary)] italic">{block_e.positioning_summary}</p>
          </div>
          {block_e.cv_changes.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Specific Changes</p>
              {block_e.cv_changes.map((c, i) => (
                <div key={i} className="text-xs mb-1.5">
                  <span className="text-[var(--teal)] font-medium">{c.section}:</span>{' '}
                  <span className="text-[var(--text-secondary)]">{c.change}</span>{' '}
                  <span className="text-[var(--text-muted)]">({c.reason})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Block F: Interview Prep */}
      <SectionHeader id="interview" title="Interview Prep" icon="F" />
      {openSection === 'interview' && (
        <div className="pl-6 space-y-3">
          {block_f.likely_questions.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Likely Questions</p>
              {block_f.likely_questions.map((q, i) => (
                <div key={i} className="mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--teal-dim)] text-[var(--teal)]">{q.category}</span>
                    <span className="text-[var(--text)]">{q.question}</span>
                  </div>
                  <p className="text-[var(--text-muted)] ml-16 mt-0.5">Angle: {q.suggested_angle}</p>
                </div>
              ))}
            </div>
          )}
          {block_f.star_stories_needed.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">STAR Stories Needed</p>
              <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-0.5">
                {block_f.star_stories_needed.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {block_f.red_flags_to_address.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Red Flags to Address</p>
              <ul className="list-disc list-inside text-xs text-[var(--warning)] space-y-0.5">
                {block_f.red_flags_to_address.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
          {block_f.questions_to_ask.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Sharp Questions to Ask</p>
              <ul className="list-disc list-inside text-xs text-[var(--teal)] space-y-0.5">
                {block_f.questions_to_ask.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
        <button className="btn-ghost text-xs" onClick={handleCopy}><Copy size={12} /> Copy</button>
        <button className="btn-primary text-xs" onClick={() => { setPrefillJD(job.jd_text); setActiveTab('cv') }}>
          <ArrowRight size={12} /> Tailor CV
        </button>
        <button className="btn-ghost text-xs" onClick={onResearch} disabled={researching}>
          <Building2 size={12} /> {researching ? 'Researching...' : 'Deep Research'}
        </button>
        <button className="btn-ghost text-xs" onClick={onOutreach} disabled={outreaching}>
          <Send size={12} /> {outreaching ? 'Generating...' : 'LinkedIn Outreach'}
        </button>
        <button className="btn-ghost text-xs" onClick={onApplication} disabled={generating}>
          <FileText size={12} /> {generating ? 'Generating...' : 'Application Answers'}
        </button>
      </div>
    </div>
  )
}
