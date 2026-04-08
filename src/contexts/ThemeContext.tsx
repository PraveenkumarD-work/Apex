import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ThemeMode } from '../lib/types'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, initial = 'dark' }: { children: ReactNode; initial?: ThemeMode }) {
  const [theme, setThemeState] = useState<ThemeMode>(initial)

  const applyTheme = useCallback((t: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  const setTheme = (t: ThemeMode) => {
    setThemeState(t)
    applyTheme(t)
  }

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
