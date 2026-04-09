import { createContext, useContext, useState, type ReactNode } from 'react'

export type TabName = 'jobs' | 'cv' | 'postmortem' | 'stories' | 'analytics' | 'settings'

interface AppContextType {
  activeTab: TabName
  setActiveTab: (tab: TabName) => void
  prefillJD: string
  setPrefillJD: (jd: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabName>('jobs')
  const [prefillJD, setPrefillJD] = useState('')

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab, prefillJD, setPrefillJD }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
