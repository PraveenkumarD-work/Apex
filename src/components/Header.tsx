import { Settings, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'

export function Header() {
  const { user, signOut } = useAuth()
  const { setActiveTab } = useApp()
  const { theme, toggle } = useTheme()

  const email = user?.email ?? ''
  const displayEmail = email.length > 20 ? email.slice(0, 20) + '...' : email

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        <img src="/logo-mark.svg" alt="APEX" className="w-8 h-8" />
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-[var(--teal)]">A</span>
          <span className="text-xl font-bold text-[var(--text)]">PEX</span>
          <span className="text-[10px] text-[var(--text-muted)] ml-1 hidden sm:inline tracking-wider">
            CAREER AI
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-muted)] hidden sm:inline">
          {displayEmail}
        </span>
        <button onClick={toggle} className="btn-ghost !p-2" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={() => setActiveTab('settings')} className="btn-ghost !p-2" title="Settings">
          <Settings size={16} />
        </button>
        <button onClick={handleSignOut} className="btn-ghost text-sm">
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
