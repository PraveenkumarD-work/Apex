import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getJobs, createJob, updateJob, deleteJob } from '../lib/supabase'
import type { Job, JobStatus } from '../lib/types'

export function useJobs() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = useCallback(async () => {
    if (!user) return
    try {
      const data = await getJobs(user.id)
      setJobs(data)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const addJob = async (job: {
    title: string
    company: string
    location: string
    salary: string
    status: JobStatus
    jd_text: string
    analysis: null
  }) => {
    if (!user) return
    try {
      await createJob(user.id, job)
      await fetchJobs()
      showToast('success', 'Role added')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to add job')
      throw err
    }
  }

  const editJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      await updateJob(jobId, updates)
      await fetchJobs()
      showToast('success', 'Role updated')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update job')
      throw err
    }
  }

  const removeJob = async (jobId: string) => {
    try {
      await deleteJob(jobId)
      await fetchJobs()
      showToast('success', 'Role deleted')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete job')
    }
  }

  return { jobs, loading, addJob, editJob, removeJob, refetch: fetchJobs }
}
