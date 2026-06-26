'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from 'next-themes'

interface ThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  mounted: boolean
  toggleTheme: () => void
  themeChangeCount: number
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [themeChangeCount, setThemeChangeCount] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    // Set forced dark theme variables
    root.style.setProperty('--background', '#000000')
    root.style.setProperty('--foreground', '#ffffff')
    root.style.setProperty('--primary', '#ef4444')
    root.style.setProperty('--card', '#1a1a1a')
    root.style.setProperty('--border', '#2a2a2a')

    const originalTransition = root.style.transition
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
    return () => {
      root.style.transition = originalTransition
    }
  }, [])

  // Global full-width fix and redesign reset
  React.useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        overflow-x: hidden;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Force theme to always stay dark, toggle does nothing but increments counter
  const toggleTheme = React.useCallback(() => {
    setTheme('dark')
    setThemeChangeCount(c => c + 1)
  }, [setTheme])

  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme: resolvedTheme,
      setTheme,
      mounted,
      toggleTheme,
      themeChangeCount,
    }),
    [resolvedTheme, setTheme, mounted, toggleTheme, themeChangeCount]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function ThemeProvider({ children, forcedTheme, defaultTheme, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider forcedTheme="dark" defaultTheme="dark" attribute="class" {...props}>
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </NextThemesProvider>
  )
}

export function useAppTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider')
  }
  return context
}