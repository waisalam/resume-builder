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
      /* Smooth transitions for theme colors */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      /* CSS variables for light and dark themes */
      :root {
        --background: hsl(0 0% 100%);
        --foreground: hsl(0 0% 3.9%);
      }
      .dark {
        --background: hsl(0 0% 3.9%);
        --foreground: hsl(0 0% 98%);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const toggleTheme = React.useCallback(() => {
    const themes = ['light', 'dark', 'system']
    const currentTheme = theme || 'system'
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
    setThemeChangeCount(c => c + 1)
  }, [theme, setTheme])

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

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
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