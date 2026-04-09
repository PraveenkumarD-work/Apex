import { createClient } from '@supabase/supabase-js'
import type { Profile, Job, PostMortem, Story, CompanyResearch, Outreach, ApplicationAnswers } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

// Profile
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw new Error(`Failed to update profile: ${error.message}`)
}

// Jobs
export async function getJobs(userId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch jobs: ${error.message}`)
  return (data as Job[]) ?? []
}

export async function createJob(
  userId: string,
  job: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...job, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create job: ${error.message}`)
  return data as Job
}

export async function updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)

  if (error) throw new Error(`Failed to update job: ${error.message}`)
}

export async function deleteJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (error) throw new Error(`Failed to delete job: ${error.message}`)
}

// Post-mortems
export async function getPostMortems(userId: string): Promise<PostMortem[]> {
  const { data, error } = await supabase
    .from('post_mortems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch post-mortems: ${error.message}`)
  return (data as PostMortem[]) ?? []
}

export async function createPostMortem(
  userId: string,
  pm: Omit<PostMortem, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<PostMortem> {
  const { data, error } = await supabase
    .from('post_mortems')
    .insert({ ...pm, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create post-mortem: ${error.message}`)
  return data as PostMortem
}

export async function updatePostMortem(pmId: string, updates: Partial<PostMortem>): Promise<void> {
  const { error } = await supabase
    .from('post_mortems')
    .update(updates)
    .eq('id', pmId)

  if (error) throw new Error(`Failed to update post-mortem: ${error.message}`)
}

export async function deletePostMortem(pmId: string): Promise<void> {
  const { error } = await supabase
    .from('post_mortems')
    .delete()
    .eq('id', pmId)

  if (error) throw new Error(`Failed to delete post-mortem: ${error.message}`)
}

// Story Bank
export async function getStories(userId: string): Promise<Story[]> {
  const { data, error } = await supabase
    .from('story_bank')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch stories: ${error.message}`)
  return (data as Story[]) ?? []
}

export async function createStory(
  userId: string,
  story: Omit<Story, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Story> {
  const { data, error } = await supabase
    .from('story_bank')
    .insert({ ...story, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create story: ${error.message}`)
  return data as Story
}

export async function updateStory(storyId: string, updates: Partial<Story>): Promise<void> {
  const { error } = await supabase
    .from('story_bank')
    .update(updates)
    .eq('id', storyId)

  if (error) throw new Error(`Failed to update story: ${error.message}`)
}

export async function deleteStory(storyId: string): Promise<void> {
  const { error } = await supabase
    .from('story_bank')
    .delete()
    .eq('id', storyId)

  if (error) throw new Error(`Failed to delete story: ${error.message}`)
}

// Company Research
export async function getCompanyResearch(userId: string): Promise<CompanyResearch[]> {
  const { data, error } = await supabase
    .from('company_research')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch company research: ${error.message}`)
  return (data as CompanyResearch[]) ?? []
}

export async function getCompanyResearchByJob(jobId: string): Promise<CompanyResearch | null> {
  const { data, error } = await supabase
    .from('company_research')
    .select('*')
    .eq('job_id', jobId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch company research for job: ${error.message}`)
  }
  return data as CompanyResearch
}

export async function createCompanyResearch(
  userId: string,
  research: Omit<CompanyResearch, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<CompanyResearch> {
  const { data, error } = await supabase
    .from('company_research')
    .insert({ ...research, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create company research: ${error.message}`)
  return data as CompanyResearch
}

export async function deleteCompanyResearch(researchId: string): Promise<void> {
  const { error } = await supabase
    .from('company_research')
    .delete()
    .eq('id', researchId)

  if (error) throw new Error(`Failed to delete company research: ${error.message}`)
}

// Outreach
export async function getOutreach(userId: string): Promise<Outreach[]> {
  const { data, error } = await supabase
    .from('outreach')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch outreach: ${error.message}`)
  return (data as Outreach[]) ?? []
}

export async function getOutreachByJob(jobId: string): Promise<Outreach | null> {
  const { data, error } = await supabase
    .from('outreach')
    .select('*')
    .eq('job_id', jobId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch outreach for job: ${error.message}`)
  }
  return data as Outreach
}

export async function createOutreach(
  userId: string,
  outreach: Omit<Outreach, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Outreach> {
  const { data, error } = await supabase
    .from('outreach')
    .insert({ ...outreach, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create outreach: ${error.message}`)
  return data as Outreach
}

export async function updateOutreach(outreachId: string, updates: Partial<Outreach>): Promise<void> {
  const { error } = await supabase
    .from('outreach')
    .update(updates)
    .eq('id', outreachId)

  if (error) throw new Error(`Failed to update outreach: ${error.message}`)
}

export async function deleteOutreach(outreachId: string): Promise<void> {
  const { error } = await supabase
    .from('outreach')
    .delete()
    .eq('id', outreachId)

  if (error) throw new Error(`Failed to delete outreach: ${error.message}`)
}

// Application Answers
export async function getApplicationAnswers(userId: string): Promise<ApplicationAnswers[]> {
  const { data, error } = await supabase
    .from('application_answers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch application answers: ${error.message}`)
  return (data as ApplicationAnswers[]) ?? []
}

export async function getApplicationAnswersByJob(jobId: string): Promise<ApplicationAnswers | null> {
  const { data, error } = await supabase
    .from('application_answers')
    .select('*')
    .eq('job_id', jobId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch application answers for job: ${error.message}`)
  }
  return data as ApplicationAnswers
}

export async function createApplicationAnswers(
  userId: string,
  answers: Omit<ApplicationAnswers, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<ApplicationAnswers> {
  const { data, error } = await supabase
    .from('application_answers')
    .insert({ ...answers, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create application answers: ${error.message}`)
  return data as ApplicationAnswers
}

export async function updateApplicationAnswers(answersId: string, updates: Partial<ApplicationAnswers>): Promise<void> {
  const { error } = await supabase
    .from('application_answers')
    .update(updates)
    .eq('id', answersId)

  if (error) throw new Error(`Failed to update application answers: ${error.message}`)
}
