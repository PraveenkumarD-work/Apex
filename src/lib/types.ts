export type JobStatus = 'new' | 'applied' | 'interview' | 'rejected' | 'offer'
export type PMRound = 'Screening' | 'Technical' | 'Case Study' | 'Culture Fit' | 'Final'
export type PMOutcome = 'Passed' | 'Rejected' | 'Ghosted' | 'Withdrew'

export type AIProvider = 'anthropic' | 'openai' | 'google' | 'perplexity'
export type ThemeMode = 'dark' | 'light'

export interface AIKeys {
  anthropic?: string
  openai?: string
  google?: string
  perplexity?: string
}

export interface AIModelOption {
  id: string
  name: string
}

export interface Profile {
  id: string
  email: string
  claude_api_key: string | null
  ai_keys: AIKeys
  preferred_provider: AIProvider
  preferred_model: string
  master_resume: string | null
  linkedin_profile: string | null
  theme: ThemeMode
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  title: string
  company: string
  location: string
  salary: string
  status: JobStatus
  jd_text: string
  analysis: JDAnalysis | null
  created_at: string
  updated_at: string
}

export interface JDAnalysis {
  keywords: string[]
  hypothesis: string
  success_90_days: string
  fit_score: number
  fit_reasoning: string
  gap: string
}

export interface PostMortem {
  id: string
  user_id: string
  company: string
  role: string
  round: PMRound
  outcome: PMOutcome
  went_well: string
  struggled: string
  questions_asked: string
  vibe_notes: string
  prep_tips: string[]
  created_at: string
  updated_at: string
}

export interface CVSession {
  jd_text: string
  tailored_resume: string
  matched_keywords: string[]
  missing_keywords: string[]
  match_percentage: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error'
  message: string
}
