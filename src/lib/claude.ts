import type { JDAnalysis, PostMortem } from './types'

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Claude API call failed')
  }

  const data = await response.json()
  return data.content[0].text
}

export async function analyseJD(jdText: string, apiKey: string): Promise<JDAnalysis> {
  const systemPrompt = `You are a career intelligence analyst for a Product Manager with 5 years experience in AI, enterprise SaaS, and automation tooling. Analyse the job description and return a JSON object with exactly these keys: { keywords: string[] (top 8 keywords the resume must contain), hypothesis: string (why this role likely exists, 2-3 sentences), success_90_days: string (what success looks like in 90 days, 2-3 sentences), fit_score: number (0-100), fit_reasoning: string (2-3 sentences), gap: string (single most important gap to address, 1-2 sentences) }. Return only valid JSON. No markdown. No text outside the JSON.`

  const raw = await callClaude(systemPrompt, jdText, apiKey)
  try {
    return JSON.parse(raw) as JDAnalysis
  } catch {
    throw new Error('Failed to parse JD analysis response as JSON')
  }
}

export async function tailorResume(
  jdText: string,
  masterResume: string,
  apiKey: string
): Promise<string> {
  const systemPrompt = `You are an expert PM resume writer. Rewrite the resume to maximise fit for the job description. Rules: 1) Keep every metric and number exactly as written. 2) Reorder bullet points within each role so the most JD-relevant ones appear first. 3) Rewrite the positioning summary to mirror the language and priorities in the JD. 4) Add a Keywords section at the bottom listing exact phrases from the JD that now appear in the resume. 5) Add [GAP: explanation] inline for any JD requirement not evidenced in the resume. Return the full tailored resume as plain text only. No markdown.`

  const userMessage = `JOB DESCRIPTION:\n${jdText}\n\nRESUME:\n${masterResume}`
  return callClaude(systemPrompt, userMessage, apiKey)
}

export async function getMatchAnalysis(
  jdText: string,
  tailoredResume: string,
  apiKey: string
): Promise<{ matched_keywords: string[]; missing_keywords: string[]; match_percentage: number }> {
  const systemPrompt = `Given this job description and tailored resume, return a JSON object with: { matched_keywords: string[], missing_keywords: string[], match_percentage: number }. Return only valid JSON.`

  const userMessage = `JOB DESCRIPTION:\n${jdText}\n\nTAILORED RESUME:\n${tailoredResume}`
  const raw = await callClaude(systemPrompt, userMessage, apiKey)
  try {
    return JSON.parse(raw) as { matched_keywords: string[]; missing_keywords: string[]; match_percentage: number }
  } catch {
    throw new Error('Failed to parse match analysis response as JSON')
  }
}

export async function generatePrepTips(
  postMortem: PostMortem,
  apiKey: string
): Promise<string[]> {
  const systemPrompt = `You are a PM interview coach. Based on this post-mortem, generate exactly 5 tactical preparation tips for the next round. Each tip must be specific to what was mentioned. No generic advice. Return a JSON array of exactly 5 strings. Return only valid JSON.`

  const userMessage = `Company: ${postMortem.company}\nRole: ${postMortem.role}\nRound: ${postMortem.round}\nOutcome: ${postMortem.outcome}\nWhat went well: ${postMortem.went_well}\nWhere I struggled: ${postMortem.struggled}\nQuestions asked: ${postMortem.questions_asked}\nVibe notes: ${postMortem.vibe_notes}`

  const raw = await callClaude(systemPrompt, userMessage, apiKey)
  try {
    return JSON.parse(raw) as string[]
  } catch {
    throw new Error('Failed to parse prep tips response as JSON')
  }
}
