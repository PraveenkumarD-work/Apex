import { useToast } from '../../contexts/ToastContext'
import { usePostMortems } from '../../hooks/usePostMortems'
import { useAI } from '../../hooks/useAI'
import { generatePrepTips } from '../../lib/ai'
import { PMForm } from './PMForm'
import { PMCard } from './PMCard'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import type { PostMortem } from '../../lib/types'

export function PostMortemTab() {
  const { showToast } = useToast()
  const { postMortems, loading, addPM, editPM, removePM } = usePostMortems()
  const { provider, model, apiKey, hasKey, providerName } = useAI()

  const handleGenerateTips = async (pm: PostMortem) => {
    if (!apiKey) {
      showToast('error', `Add your ${providerName} API key in Settings`)
      return
    }
    try {
      const tips = await generatePrepTips(pm, provider, model, apiKey)
      await editPM(pm.id, { prep_tips: tips })
      showToast('success', 'Prep tips generated')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to generate tips')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div>
      <PMForm onSubmit={addPM} />
      {postMortems.length === 0 ? (
        <EmptyState
          icon="📝"
          heading="No post-mortems logged yet"
          subtext="Add your first entry using the form above"
        />
      ) : (
        postMortems.map((pm) => (
          <PMCard
            key={pm.id}
            pm={pm}
            onDelete={removePM}
            onGenerateTips={handleGenerateTips}
            hasApiKey={hasKey}
          />
        ))
      )}
    </div>
  )
}
