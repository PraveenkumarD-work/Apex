import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../lib/supabase'
import { PROVIDERS, analyseLinkedIn } from '../../lib/ai'
import { Spinner } from '../ui/Spinner'
import type { AIProvider, AIKeys } from '../../lib/types'

const PROVIDER_IDS: AIProvider[] = ['anthropic', 'openai', 'google', 'perplexity']

export function SettingsTab() {
  const { profile, updateApiKey, updateMasterResume, signOut, refreshProfile } = useAuth()
  const { showToast } = useToast()
  const { theme, toggle } = useTheme()

  // AI keys state
  const [aiKeys, setAiKeys] = useState<AIKeys>(profile?.ai_keys ?? {})
  const [preferredProvider, setPreferredProvider] = useState<AIProvider>(profile?.preferred_provider ?? 'anthropic')
  const [preferredModel, setPreferredModel] = useState(profile?.preferred_model ?? 'claude-sonnet-4-20250514')
  const [savingKeys, setSavingKeys] = useState(false)

  // Resume state
  const [resume, setResume] = useState(profile?.master_resume ?? '')
  const [savingResume, setSavingResume] = useState(false)

  // LinkedIn import
  const [linkedinText, setLinkedinText] = useState('')
  const [importingLinkedin, setImportingLinkedin] = useState(false)

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Sync profile changes
  useEffect(() => {
    if (profile) {
      setAiKeys(profile.ai_keys ?? {})
      setPreferredProvider(profile.preferred_provider ?? 'anthropic')
      setPreferredModel(profile.preferred_model ?? 'claude-sonnet-4-20250514')
      setResume(profile.master_resume ?? '')
    }
  }, [profile])

  // When provider changes, set a default model
  useEffect(() => {
    const models = PROVIDERS[preferredProvider].models
    const currentValid = models.some((m) => m.id === preferredModel)
    if (!currentValid) setPreferredModel(models[0].id)
  }, [preferredProvider, preferredModel])

  const activeKey = aiKeys[preferredProvider]

  const handleSaveKeys = async () => {
    setSavingKeys(true)
    try {
      // Save to both ai_keys and legacy claude_api_key for backward compat
      await updateApiKey(aiKeys.anthropic ?? '')
      const { error } = await supabase
        .from('profiles')
        .update({
          ai_keys: aiKeys,
          preferred_provider: preferredProvider,
          preferred_model: preferredModel,
        })
        .eq('id', profile!.id)
      if (error) throw new Error(error.message)
      await refreshProfile()
      showToast('success', 'AI settings saved')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save keys')
    } finally {
      setSavingKeys(false)
    }
  }

  const handleSaveResume = async () => {
    setSavingResume(true)
    try {
      await updateMasterResume(resume)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save resume')
    } finally {
      setSavingResume(false)
    }
  }

  const handleLinkedInImport = async () => {
    if (!linkedinText.trim()) return
    if (!activeKey) {
      showToast('error', `Add your ${PROVIDERS[preferredProvider].name} API key first`)
      return
    }
    setImportingLinkedin(true)
    try {
      const result = await analyseLinkedIn(linkedinText, preferredProvider, preferredModel, activeKey)
      setResume(result)
      showToast('success', 'LinkedIn profile imported as resume. Review and save below.')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'LinkedIn import failed')
    } finally {
      setImportingLinkedin(false)
    }
  }

  const handleSaveTheme = async (newTheme: 'dark' | 'light') => {
    toggle()
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', profile!.id)
      if (error) throw new Error(error.message)
    } catch {
      // Theme still toggles locally even if save fails
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      const { error } = await supabase.rpc('delete_user')
      if (error) console.warn('RPC delete_user not available:', error.message)
      await signOut()
      showToast('success', 'Account deleted')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const lastSaved = profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : null

  return (
    <div className="max-w-2xl space-y-8">
      {/* Theme Toggle */}
      <section className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Appearance</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Switch between light and dark mode</p>
          </div>
          <button
            className="btn-ghost"
            onClick={() => handleSaveTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </section>

      {/* AI Provider & Keys */}
      <section className="card space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">AI Provider & Keys</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Add API keys for your preferred providers. Keys are stored in your account and used only for your requests.
          </p>
        </div>

        {/* Provider select + model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Active Provider</label>
            <select
              value={preferredProvider}
              onChange={(e) => setPreferredProvider(e.target.value as AIProvider)}
            >
              {PROVIDER_IDS.map((p) => (
                <option key={p} value={p}>
                  {PROVIDERS[p].name}
                  {aiKeys[p] ? '' : ' (no key)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Model</label>
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value)}
            >
              {PROVIDERS[preferredProvider].models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key inputs for each provider */}
        {PROVIDER_IDS.map((p) => (
          <div key={p}>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              {PROVIDERS[p].name} Key
              {aiKeys[p] ? (
                <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ background: '#0d3d2e', color: '#22c55e' }}>
                  saved
                </span>
              ) : (
                <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ background: '#3d1515', color: '#ef4444' }}>
                  empty
                </span>
              )}
            </label>
            <input
              type="password"
              value={aiKeys[p] ?? ''}
              onChange={(e) => setAiKeys((prev) => ({ ...prev, [p]: e.target.value || undefined }))}
              placeholder={PROVIDERS[p].keyPlaceholder}
            />
          </div>
        ))}

        <button className="btn-primary" onClick={handleSaveKeys} disabled={savingKeys}>
          {savingKeys ? <Spinner /> : 'Save AI Settings'}
        </button>
      </section>

      {/* LinkedIn Import */}
      <section className="card space-y-3">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Import from LinkedIn
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Go to your LinkedIn profile, select all text (Ctrl+A), copy it, and paste below.
            AI will convert it into a structured resume.
          </p>
        </div>
        <textarea
          value={linkedinText}
          onChange={(e) => setLinkedinText(e.target.value)}
          rows={8}
          placeholder="Paste your full LinkedIn profile text here..."
        />
        <button
          className="btn-primary w-full"
          onClick={handleLinkedInImport}
          disabled={importingLinkedin || !linkedinText.trim() || !activeKey}
          title={!activeKey ? 'Add an API key for your active provider first' : undefined}
        >
          {importingLinkedin ? <Spinner /> : 'Convert to Resume with AI'}
        </button>
      </section>

      {/* Master Resume */}
      <section className="card">
        <h3 className="text-sm font-medium mb-1">Master Resume</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Paste your full resume here once. It will be pre-loaded in the CV Builder for every tailoring session.
        </p>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={16}
          placeholder="Paste your full resume here..."
        />
        <div className="flex items-center justify-between mt-3">
          <button className="btn-primary" onClick={handleSaveResume} disabled={savingResume}>
            {savingResume ? <Spinner /> : 'Save Resume'}
          </button>
          {lastSaved && profile?.master_resume && (
            <span className="text-xs text-[var(--text-muted)]">Last saved: {lastSaved}</span>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card" style={{ borderColor: 'var(--danger)' }}>
        <h3 className="text-sm font-medium text-[var(--danger)] mb-1">Danger Zone</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Permanently deletes your account and all data. Cannot be undone.
        </p>
        <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
      </section>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="card max-w-sm w-full mx-4">
            <h3 className="text-sm font-medium mb-2">Confirm Account Deletion</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Type <strong>DELETE</strong> to confirm
            </p>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="mb-3"
            />
            <div className="flex gap-3">
              <button
                className="btn-danger flex-1"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
              >
                {deleting ? <Spinner /> : 'Delete Forever'}
              </button>
              <button
                className="btn-ghost flex-1"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm('') }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
