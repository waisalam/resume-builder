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
  isToggling: boolean
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [themeChangeCount, setThemeChangeCount] = React.useState(0)
  const [isToggling, setIsToggling] = React.useState(false)

  const isTransitioningRef = React.useRef(false)
  const styleRef = React.useRef<HTMLStyleElement | null>(null)

  // Mount detection
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Smooth color transition on root (already present)
  React.useEffect(() => {
    const root = document.documentElement
    const originalTransition = root.style.transition
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
    return () => {
      root.style.transition = originalTransition
    }
  }, [])

  // Inject cross-fade CSS
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .theme-changing {
        opacity: 0 !important;
        transition: opacity 0.15s ease-in-out;
      }
    `
    document.head.appendChild(style)
    styleRef.current = style

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
      }
    }
  }, [])

  const toggleTheme = React.useCallback(() => {
    if (isTransitioningRef.current) return

    const themes = ['light', 'dark', 'system']
    const currentTheme = theme || 'system'
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    isTransitioningRef.current = true
    setIsToggling(true)

    // Start fade out
    document.documentElement.classList.add('theme-changing')

    // Wait for fade out to complete, then change theme and fade in
    const fadeOutTimer = window.setTimeout(() => {
      setTheme(nextTheme)
      setThemeChangeCount((c) => c + 1)

      // Start fade in (remove class triggers transition back to opacity 1)
      document.documentElement.classList.remove('theme-changing')

      // After fade in completes, finish toggling state
      const fadeInTimer = window.setTimeout(() => {
        setIsToggling(false)
        isTransitioningRef.current = false
      }, 150) // match fade-in duration

      // Clean up if component unmounts during transition
      return () => window.clearTimeout(fadeInTimer)
    }, 150) // fade-out duration

    // Clean up if component unmounts during transition
    return () => window.clearTimeout(fadeOutTimer)
  }, [theme, setTheme])

  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme: resolvedTheme,
      setTheme,
      mounted,
      toggleTheme,
      themeChangeCount,
      isToggling,
    }),
    [resolvedTheme, setTheme, mounted, toggleTheme, themeChangeCount, isToggling]
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