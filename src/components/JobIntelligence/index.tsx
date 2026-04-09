import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useApp } from '../../contexts/AppContext'
import { useJobs } from '../../hooks/useJobs'
import { useAI } from '../../hooks/useAI'
import {
  analyseJD,
  enhancedAnalyseJD,
  deepCompanyResearch,
  generateOutreach,
  generateApplicationAnswers,
} from '../../lib/ai'
import { createCompanyResearch, createOutreach } from '../../lib/supabase'
import { MetricBar } from './MetricBar'
import { JobForm } from './JobForm'
import { JobCard } from './JobCard'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import type { Job, JobStatus } from '../../lib/types'

export function JobIntelligence() {
  const { user, profile } = useAuth()
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
    archetype: null
    enhanced_analysis: null
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
      // If user has a master resume, run enhanced 6-block analysis
      if (profile?.master_resume) {
        const enhanced = await enhancedAnalyseJD(jdText, profile.master_resume, provider, model, apiKey)
        const updates = {
          enhanced_analysis: enhanced,
          archetype: enhanced.archetype,
          analysis: {
            keywords: enhanced.block_b.keywords,
            hypothesis: enhanced.block_a.summary,
            success_90_days: enhanced.block_c.strategy,
            fit_score: enhanced.block_b.fit_score,
            fit_reasoning: enhanced.block_b.fit_reasoning,
            gap: enhanced.block_b.gaps[0]?.gap ?? 'No critical gaps identified',
          },
        }
        if (editingJob) {
          await editJob(editingJob.id, updates)
        } else {
          const matchingJob = jobs.find((j) => j.jd_text === jdText)
          if (matchingJob) await editJob(matchingJob.id, updates)
        }
        showToast('success', 'Enhanced 6-block analysis complete')
      } else {
        // Fallback to basic analysis
        const analysis = await analyseJD(jdText, provider, model, apiKey)
        if (editingJob) {
          await editJob(editingJob.id, { analysis })
        } else {
          const matchingJob = jobs.find((j) => j.jd_text === jdText)
          if (matchingJob) await editJob(matchingJob.id, { analysis })
        }
        showToast('success', 'JD analysis complete. Add a master resume in Settings for enhanced 6-block analysis.')
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Analysis failed')
    }
  }

  const handleTailorCV = (jdText: string) => {
    setPrefillJD(jdText)
    setActiveTab('cv')
  }

  const handleResearch = async (job: Job) => {
    if (!apiKey || !user) { showToast('error', `Add your ${providerName} API key in Settings`); return null }
    try {
      const research = await deepCompanyResearch(job.company, job.title, provider, model, apiKey)
      await createCompanyResearch(user.id, { job_id: job.id, company: job.company, research })
      showToast('success', 'Company research complete')
      return research
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Research failed')
      return null
    }
  }

  const handleOutreach = async (job: Job) => {
    if (!apiKey || !user) { showToast('error', `Add your ${providerName} API key in Settings`); return null }
    try {
      const result = await generateOutreach(job.company, job.title, job.jd_text, provider, model, apiKey)
      const outreach = await createOutreach(user.id, {
        job_id: job.id,
        company: job.company,
        role: job.title,
        hiring_manager: result.hiring_manager,
        recruiter: result.recruiter,
        connection_message: result.connection_message,
        follow_up_message: result.follow_up_message,
      })
      showToast('success', 'Outreach drafts generated')
      return outreach
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Outreach generation failed')
      return null
    }
  }

  const handleApplication = async (job: Job) => {
    if (!apiKey) { showToast('error', `Add your ${providerName} API key in Settings`); return null }
    const resume = profile?.master_resume ?? ''
    if (!resume) { showToast('error', 'Add your master resume in Settings first'); return null }
    try {
      const defaultQuestions = [
        'Why are you interested in this role?',
        'What makes you a great fit for this position?',
        'Describe a relevant accomplishment.',
        'What is your expected salary?',
        'When can you start?',
      ]
      const result = await generateApplicationAnswers(job.jd_text, resume, defaultQuestions, provider, model, apiKey)
      showToast('success', 'Application answers generated')
      return result
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Generation failed')
      return null
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
            onResearch={handleResearch}
            onOutreach={handleOutreach}
            onApplication={handleApplication}
          />
        ))
      )}
    </div>
  )
}
