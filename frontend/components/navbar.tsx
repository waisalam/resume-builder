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
    // Logo entrance animation on mount
    setLogoVisible(true)
    
    // Scroll detection for shadow
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Theme initialization and persistence
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

  // Close drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItemClass = 
    "block py-2 px-3 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg dark:shadow-black/30' : 'shadow-none'
        } bg-white/70 dark:bg-gray-950/70 border-b border-white/20 dark:border-white/10`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 group transition-all duration-500 ease-out ${
              logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 dark:bg-orange-500/10 dark:group-hover:bg-orange-500/20 transition-all duration-300">
              <Zap size={20} className="text-orange-500" />
            </div>
            <span className="hidden sm:inline text-xl font-bold text-orange-500 hover:text-orange-600 dark:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200">
              ATS Analyzer
            </span>
          </Link>

          {/* Center navigation links - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              <Link href="/" className={navItemClass}>
                Home
              </Link>
              <Link href="/analyzer" className={navItemClass}>
                Analyze
              </Link>
              <Link href="#" className={navItemClass}>
                Features
              </Link>
              <Link href="#" className={navItemClass}>
                Pricing
              </Link>
              <Link href="/testimonials" className={navItemClass}>
                Testimonials
              </Link>
            </div>
          </div>

          {/* Right section: theme toggle, auth/profile, hamburger */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400 pr-3 border-r border-gray-300 dark:border-gray-700">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 rounded text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:underline decoration-orange-500 underline-offset-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn("google")}
                    className="px-3 py-1.5 rounded text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 dark:hover:border-orange-500 hover:text-gray-900 dark:hover:text-white hover:underline decoration-orange-500 underline-offset-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded text-sm font-bold bg-orange-500 text-black hover:bg-orange-600 transition-all duration-200 hover:scale-105 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full‑width slide‑out menu (always rendered for animation) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Panel */}
        <aside
          className={`absolute inset-0 w-full h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="px-4 py-2 flex flex-col gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Analyze', href: '/analyzer', requiresAuth: true },
              { label: 'Features', href: '#', requiresAuth: false },
              { label: 'Pricing', href: '#', requiresAuth: false },
              { label: 'Testimonials', href: '/testimonials', requiresAuth: false },
            ].map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.requiresAuth && !session) {
                    e.preventDefault()
                    signIn('google')
                  }
                  setMobileMenuOpen(false)
                }}
                className={`${navItemClass} opacity-0 animate-slide-in`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {item.label}
              </Link>
            ))}
            <hr
              className="my-2 border-gray-200 dark:border-gray-700 opacity-0 animate-slide-in"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            />
            {session ? (
              <>
                <div
                  className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-slide-in"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                  {session.user?.name}
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className={`${navItemClass} opacity-0 animate-slide-in`}
                  style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
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
                className={`${navItemClass} opacity-0 animate-slide-in`}
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                Sign in
              </button>
            )}
          </nav>
        </aside>
      </div>

      {/* Custom slide-in animation keyframes */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}