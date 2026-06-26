'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Sun, Moon, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoVisible, setLogoVisible] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    setLogoVisible(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = storedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Base nav link style for mobile
  const mobileLinkBase = 
    "block py-2 px-3 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"

  // Determine active link styling
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/analyzer') return pathname.startsWith('/analyzer')
    return false
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg dark:shadow-black/30' : 'shadow-none'
        } bg-white/90 dark:bg-black border-b border-gray-200 dark:border-red-500/20`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 group transition-all duration-500 ease-out ${
              logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 dark:bg-red-500/10 dark:group-hover:bg-red-500/20 transition-all duration-300">
              <Zap size={20} className="text-orange-500 dark:text-red-500" />
            </div>
            <span className="hidden sm:inline text-xl font-bold text-orange-500 dark:text-white hover:text-orange-600 dark:hover:text-red-500 transition-colors duration-200">
              ATS Analyzer
            </span>
          </Link>

          {/* Right section: Theme toggle, Auth, Hamburger */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-red-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="relative w-5 h-5">
                <Sun
                  size={20}
                  className={`absolute inset-0 transition-all duration-300 transform ${
                    theme === 'light' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'
                  }`}
                />
                <Moon
                  size={20}
                  className={`absolute inset-0 transition-all duration-300 transform ${
                    theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                  }`}
                />
              </div>
            </button>

            {/* Desktop auth & CTA */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-white pr-3 border-r border-gray-300 dark:border-gray-700">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 rounded text-sm font-semibold bg-gray-100 dark:bg-transparent dark:border dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-500/10 dark:hover:text-red-500 dark:hover:border-red-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-red-500"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn("google")}
                    className="px-3 py-1.5 rounded text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:border-orange-500 dark:hover:border-red-500 dark:hover:text-red-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-red-500"
                  >
                    Sign in
                  </button>
                  <Link
                    href="/analyzer"
                    onClick={(e) => {
                      if (!session) {
                        e.preventDefault()
                        signIn("google")
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-4 py-1.5 rounded text-sm font-bold transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-red-500 ${
                      isActive('/analyzer')
                        ? 'underline decoration-red-500 underline-offset-4 text-gray-800 dark:text-white'
                        : 'text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500'
                    } bg-orange-500 hover:bg-orange-600 dark:bg-transparent dark:hover:bg-red-500/10`}
                  >
                    <span>Analyze</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-red-500"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu with max-height transition */}
      <div className="md:hidden">
        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Collapsible content */}
        <div
          className={`relative z-40 bg-black border-b border-red-500/20 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-4 py-2 flex flex-col gap-1">
            {/* Home link */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`${mobileLinkBase} text-white hover:bg-gray-800 hover:text-red-500 ${
                isActive('/') ? 'underline decoration-red-500 underline-offset-4' : ''
              }`}
            >
              Home
            </Link>
            {/* Analyze link */}
            <Link
              href="/analyzer"
              onClick={(e) => {
                if (!session) {
                  e.preventDefault()
                  signIn('google')
                }
                setMobileMenuOpen(false)
              }}
              className={`${mobileLinkBase} text-white hover:bg-gray-800 hover:text-red-500 ${
                isActive('/analyzer') ? 'underline decoration-red-500 underline-offset-4' : ''
              }`}
            >
              Analyze
            </Link>

            <hr className="my-2 border-gray-700" />

            {session ? (
              <>
                <div className="py-2 px-3 text-sm text-gray-400">
                  {session.user?.name}
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className={`${mobileLinkBase} text-white hover:bg-gray-800 hover:text-red-500`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  signIn('google')
                  setMobileMenuOpen(false)
                }}
                className={`${mobileLinkBase} text-white hover:bg-gray-800 hover:text-red-500`}
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}