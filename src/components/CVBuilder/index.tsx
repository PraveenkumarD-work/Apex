import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useApp } from '../../contexts/AppContext'
import { useAI } from '../../hooks/useAI'
import { tailorResume, getMatchAnalysis } from '../../lib/ai'
import { Spinner } from '../ui/Spinner'
import { KeywordBadge } from '../ui/Badge'
import { Copy, Download, Trash2 } from 'lucide-react'

export function CVBuilder() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const { prefillJD, setPrefillJD } = useApp()
  const { provider, model, apiKey, hasKey, providerName } = useAI()

  const [jdText, setJdText] = useState(prefillJD)
  const [masterResume, setMasterResume] = useState(profile?.master_resume ?? '')
  const [tailoredResume, setTailoredResume] = useState('')
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([])
  const [missingKeywords, setMissingKeywords] = useState<string[]>([])
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null)
  const [tailoring, setTailoring] = useState(false)

  useEffect(() => {
    if (prefillJD) {
      setJdText(prefillJD)
      setPrefillJD('')
    }
  }, [prefillJD, setPrefillJD])

  useEffect(() => {
    if (profile?.master_resume && !masterResume) {
      setMasterResume(profile.master_resume)
    }
  }, [profile?.master_resume, masterResume])

  const handleTailor = async () => {
    if (!apiKey) {
      showToast('error', `Add your ${providerName} API key in Settings`)
      return
    }
    setTailoring(true)
    try {
      const result = await tailorResume(jdText, masterResume, provider, model, apiKey)
      setTailoredResume(result)
      showToast('success', 'Resume tailored successfully')

      try {
        const match = await getMatchAnalysis(jdText, result, provider, model, apiKey)
        setMatchedKeywords(match.matched_keywords)
        setMissingKeywords(match.missing_keywords)
        setMatchPercentage(match.match_percentage)
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Match analysis failed')
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Tailoring failed')
    } finally {
      setTailoring(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tailoredResume)
    showToast('success', 'Copied to clipboard')
  }

  const handleDownload = () => {
    const blob = new Blob([tailoredResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tailored-resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setTailoredResume('')
    setMatchedKeywords([])
    setMissingKeywords([])
    setMatchPercentage(null)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Master Resume</label>
            {!profile?.master_resume && (
              <p className="text-xs text-[var(--text-muted)] mb-1">Save to Settings to persist</p>
            )}
            <textarea
              value={masterResume}
              onChange={(e) => setMasterResume(e.target.value)}
              rows={14}
              placeholder="Paste your full resume here..."
            />
          </div>
          <button
            className="btn-primary w-full"
            disabled={tailoring || !jdText.trim() || !masterResume.trim() || !hasKey}
            onClick={handleTailor}
            title={!hasKey ? `Add your ${providerName} API key in Settings` : undefined}
          >
            {tailoring ? <Spinner /> : `Tailor Resume with ${providerName}`}
          </button>
        </div>

        {/* Right column */}
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">Tailored Resume</label>
          {tailoredResume ? (
            <>
              <textarea
                value={tailoredResume}
                readOnly
                rows={24}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
              <div className="flex gap-3 mt-3">
                <button className="btn-ghost text-sm" onClick={handleCopy}>
                  <Copy size={14} /> Copy
                </button>
                <button className="btn-ghost text-sm" onClick={handleDownload}>
                  <Download size={14} /> Download .txt
                </button>
                <button className="btn-ghost text-sm" onClick={handleClear}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--surface)]" style={{ minHeight: '500px' }}>
              <div className="text-center">
                <p className="text-[var(--text-muted)] text-sm">Your tailored resume will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Match Analysis */}
      {matchPercentage !== null && (
        <div className="card">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Match Score:</span>
              <span className="text-2xl font-bold text-[var(--teal)]">{matchPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--border)]">
              <div
                className="h-2 rounded-full bg-[var(--teal)] transition-all"
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Matched Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw) => (
                  <KeywordBadge key={kw} variant="green">{kw}</KeywordBadge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw) => (
                  <KeywordBadge key={kw} variant="red">{kw}</KeywordBadge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
