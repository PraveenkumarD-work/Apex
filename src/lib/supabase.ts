import { createClient } from '@supabase/supabase-js'
import type { Profile, Job, PostMortem } from './types'

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
