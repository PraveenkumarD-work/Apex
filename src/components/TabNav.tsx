import { useApp, type TabName } from '../contexts/AppContext'

interface Tab {
  id: TabName
  label: string
  badge?: number
}

export function TabNav({ interviewCount }: { interviewCount: number }) {
  const { activeTab, setActiveTab } = useApp()

  const tabs: Tab[] = [
    { id: 'jobs', label: 'Job Intelligence', badge: interviewCount || undefined },
    { id: 'cv', label: 'CV Builder' },
    { id: 'postmortem', label: 'Post-Mortem' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <nav className="flex border-b border-[var(--border)] px-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative ${
            activeTab === tab.id
              ? 'text-[var(--teal)] border-b-2 border-[var(--teal)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--teal)' : '2px solid transparent', cursor: 'pointer' }}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium"
              style={{ background: '#3d2a00', color: '#f59e0b' }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
