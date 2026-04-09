export type JobStatus = 'new' | 'applied' | 'interview' | 'rejected' | 'offer'
export type PMRound = 'Screening' | 'Technical' | 'Case Study' | 'Culture Fit' | 'Final'
export type PMOutcome = 'Passed' | 'Rejected' | 'Ghosted' | 'Withdrew'
export type RoleArchetype = 'LLMOps' | 'Agentic' | 'Product Manager' | 'Solutions Architect' | 'Full-Stack Dev' | 'Transformation Lead' | 'Data Engineer' | 'Other'

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

// ---------------------------------------------------------------------------
// Enhanced JD Analysis (6-block A-F framework)
// ---------------------------------------------------------------------------

export interface EnhancedAnalysis {
  archetype: RoleArchetype
  block_a: BlockA_RoleSummary
  block_b: BlockB_CVMatch
  block_c: BlockC_LevelStrategy
  block_d: BlockD_CompDemand
  block_e: BlockE_PersonalizationPlan
  block_f: BlockF_InterviewPrep
}

export interface BlockA_RoleSummary {
  archetype: RoleArchetype
  domain: string
  seniority: string
  remote_policy: string
  team_size: string
  summary: string
}

export interface BlockB_CVMatch {
  fit_score: number
  fit_reasoning: string
  requirements: RequirementMatch[]
  gaps: GapAnalysis[]
  keywords: string[]
}

export interface RequirementMatch {
  requirement: string
  evidence: string
  strength: 'strong' | 'moderate' | 'weak' | 'gap'
}

export interface GapAnalysis {
  gap: string
  severity: 'critical' | 'moderate' | 'minor'
  mitigation: string
}

export interface BlockC_LevelStrategy {
  detected_level: string
  natural_level: string
  strategy: string
  sell_up_points: string[]
  risk_factors: string[]
}

export interface BlockD_CompDemand {
  salary_range: string
  market_demand: string
  company_reputation: string
  growth_trajectory: string
}

export interface BlockE_PersonalizationPlan {
  cv_changes: PersonalizationItem[]
  positioning_summary: string
  keyword_injection: string[]
}

export interface PersonalizationItem {
  section: string
  change: string
  reason: string
}

export interface BlockF_InterviewPrep {
  likely_questions: InterviewQuestion[]
  star_stories_needed: string[]
  red_flags_to_address: string[]
  questions_to_ask: string[]
}

export interface InterviewQuestion {
  question: string
  category: 'technical' | 'behavioral' | 'role-specific' | 'culture'
  suggested_angle: string
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

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
  archetype: RoleArchetype | null
  enhanced_analysis: EnhancedAnalysis | null
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

// ---------------------------------------------------------------------------
// Story Bank (STAR+R)
// ---------------------------------------------------------------------------

export interface Story {
  id: string
  user_id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  reflection: string
  tags: string[]
  linked_jobs: string[]
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Company Research
// ---------------------------------------------------------------------------

export interface CompanyResearch {
  id: string
  user_id: string
  job_id: string | null
  company: string
  research: DeepResearch
  created_at: string
  updated_at: string
}

export interface DeepResearch {
  ai_strategy: string
  recent_movements: string
  engineering_culture: string
  probable_challenges: string
  competitors: string
  candidate_angle: string
}

// ---------------------------------------------------------------------------
// Outreach
// ---------------------------------------------------------------------------

export interface Outreach {
  id: string
  user_id: string
  job_id: string | null
  company: string
  role: string
  hiring_manager: ContactInfo | null
  recruiter: ContactInfo | null
  connection_message: string
  follow_up_message: string
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  name: string
  title: string
  linkedin_url: string
}

// ---------------------------------------------------------------------------
// Application Answers
// ---------------------------------------------------------------------------

export interface ApplicationAnswers {
  id: string
  user_id: string
  job_id: string | null
  answers: FormAnswer[]
  cover_letter: string
  created_at: string
  updated_at: string
}

export interface FormAnswer {
  question: string
  answer: string
}

// ---------------------------------------------------------------------------
// Post-Mortems
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CV / UI
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Analytics / Pattern Analysis
// ---------------------------------------------------------------------------

export interface PatternAnalysis {
  conversion_funnel: FunnelStage[]
  score_vs_outcome: ScoreOutcome[]
  archetype_performance: ArchetypePerf[]
  top_blockers: Blocker[]
  recommendations: Recommendation[]
}

export interface FunnelStage {
  stage: string
  count: number
  percentage: number
}

export interface ScoreOutcome {
  range: string
  applied: number
  interview: number
  offer: number
  rejected: number
}

export interface ArchetypePerf {
  archetype: string
  count: number
  avg_score: number
  interview_rate: number
}

export interface Blocker {
  blocker: string
  frequency: number
  impact: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  recommendation: string
  impact: 'high' | 'medium' | 'low'
  reasoning: string
}
