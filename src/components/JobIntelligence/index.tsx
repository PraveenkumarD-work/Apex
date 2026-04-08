import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { useApp } from '../../contexts/AppContext'
import { useJobs } from '../../hooks/useJobs'
import { useAI } from '../../hooks/useAI'
import { analyseJD } from '../../lib/ai'
import { MetricBar } from './MetricBar'
import { JobForm } from './JobForm'
import { JobCard } from './JobCard'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import type { Job, JobStatus } from '../../lib/types'

export function JobIntelligence() {
  const { showToast } = useToast()
  const { setActiveTab, setPrefillJD } = useApp()
  const { jobs, loading, addJob, editJob, removeJob } = useJobs()
  const { provider, model, apiKey, hasKey, providerName } = useAI()
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const handleSubmit = async (job: {
    title: string
    company: string
    location: string
    salary: string
    status: JobStatus
    jd_text: string
    analysis: null
  }) => {
    if (editingJob) {
      await editJob(editingJob.id, job)
      setEditingJob(null)
    } else {
      await addJob(job)
    }
  }

  const handleAnalyse = async (jdText: string) => {
    if (!apiKey) {
      showToast('error', `Add your ${providerName} API key in Settings`)
      return
    }
    try {
      const analysis = await analyseJD(jdText, provider, model, apiKey)
      if (editingJob) {
        await editJob(editingJob.id, { analysis })
      } else {
        const matchingJob = jobs.find((j) => j.jd_text === jdText)
        if (matchingJob) {
          await editJob(matchingJob.id, { analysis })
        }
      }
      showToast('success', 'JD analysis complete')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Analysis failed')
    }
  }

  const handleTailorCV = (jdText: string) => {
    setPrefillJD(jdText)
    setActiveTab('cv')
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
      <MetricBar jobs={jobs} />
      <JobForm
        key={editingJob?.id ?? 'new'}
        onSubmit={handleSubmit}
        onAnalyse={handleAnalyse}
        hasApiKey={hasKey}
        editingJob={editingJob}
        onCancelEdit={() => setEditingJob(null)}
      />
      {jobs.length === 0 ? (
        <EmptyState
          icon="📋"
          heading="No roles tracked yet"
          subtext="Add your first role using the form above"
        />
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={setEditingJob}
            onDelete={removeJob}
            onTailorCV={handleTailorCV}
          />
        ))
      )}
    </div>
  )
}
