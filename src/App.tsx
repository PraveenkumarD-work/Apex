import { useAuth } from './contexts/AuthContext'
import { useApp } from './contexts/AppContext'
import { AuthPage } from './components/Auth/AuthPage'
import { Header } from './components/Header'
import { TabNav } from './components/TabNav'
import { JobIntelligence } from './components/JobIntelligence'
import { CVBuilder } from './components/CVBuilder'
import { PostMortemTab } from './components/PostMortem'
import { SettingsTab } from './components/Settings'
import { Spinner } from './components/ui/Spinner'
import { useJobs } from './hooks/useJobs'

function AppContent() {
  const { activeTab } = useApp()
  const { jobs } = useJobs()
  const interviewCount = jobs.filter((j) => j.status === 'interview').length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TabNav interviewCount={interviewCount} />
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full">
        {activeTab === 'jobs' && <JobIntelligence />}
        {activeTab === 'cv' && <CVBuilder />}
        {activeTab === 'postmortem' && <PostMortemTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
      <footer className="text-center text-xs text-[var(--text-muted)] py-4 px-4 space-x-2">
        <span>APEX - Your data is private. AI calls go directly to your provider using your key.</span>
        <a href="/privacy.html" target="_blank" rel="noopener" className="text-[var(--teal)] hover:underline">Privacy Policy</a>
      </footer>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return <AppContent />
}

export default App
