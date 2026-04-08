import { useAuth } from '../contexts/AuthContext'
import { PROVIDERS } from '../lib/ai'
import type { AIProvider } from '../lib/types'

export function useAI() {
  const { profile } = useAuth()

  const provider: AIProvider = profile?.preferred_provider ?? 'anthropic'
  const model: string = profile?.preferred_model ?? 'claude-sonnet-4-20250514'

  // Try preferred provider key first, fall back to legacy claude_api_key for anthropic
  const apiKey =
    profile?.ai_keys?.[provider] ??
    (provider === 'anthropic' ? profile?.claude_api_key : null) ??
    null

  const hasKey = !!apiKey
  const providerName = PROVIDERS[provider].name

  return { provider, model, apiKey, hasKey, providerName }
}
