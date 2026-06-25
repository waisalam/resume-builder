'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

// Types
interface NavItem {
  label: string
  href?: string
  id: string
  children?: NavItem[]
}

interface NavigationProps {
  currentPage?: string
}

// Sample navigation structure with nested items
const navItems: NavItem[] = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'Analyzer', href: '/analyzer', id: 'analyzer' },
  {
    label: 'Resources',
    id: 'resources',
    children: [
      { label: 'Documentation', href: '/docs', id: 'docs' },
      { label: 'Blog', href: '/blog', id: 'blog' },
    ],
  },
]

// Check if an item or its descendants match the current page
const isItemActive = (item: NavItem, currentPage: string): boolean => {
  if (item.id === currentPage) return true
  if (item.children?.some((child) => isItemActive(child, currentPage))) return true
  return false
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const navRef = useRef<HTMLElement>(null)

  // Toggle dropdown for desktop
  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdowns(new Set())
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  // Mobile menu item stagger variant
  const mobileContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const mobileItem = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 text-orange-500">
                <Zap size={28} className="text-orange-500" />
                <span className="tracking-tight">ATS Analyzer</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <LayoutGroup>
                <ul role="list" className="flex items-center gap-2">
                  {navItems.map((item) => {
                    const active = isItemActive(item, currentPage)
                    const hasChildren = !!item.children?.length
                    const dropdownOpen = openDropdowns.has(item.id)

                    return (
                      <li key={item.id} className="relative">
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => toggleDropdown(item.id)}
                              aria-expanded={dropdownOpen}
                              aria-haspopup="true"
                              className={`group relative flex items-center gap-1 px-4 py-2 rounded-full font-medium text-base transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                                active
                                  ? 'text-orange-500 bg-white/10 backdrop-blur-sm'
                                  : 'text-gray-300 hover:bg-white/10 hover:backdrop-blur-sm hover:text-white'
                              }`}
                            >
                              <span>{item.label}</span>
                              <motion.span
                                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex"
                              >
                                <ChevronDown size={16} />
                              </motion.span>
                              {active && (
                                <motion.div
                                  layoutId="active-underline"
                                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                              )}
                            </button>

                            <AnimatePresence>
                              {dropdownOpen && (
                                <motion.ul
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl py-2 z-50"
                                  role="menu"
                                >
                                  {item.children!.map((child) => (
                                    <li key={child.id} role="menuitem">
                                      <Link
                                        href={child.href ?? '#'}
                                        className={`block px-4 py-2 text-base font-medium transition-all duration-300 rounded-lg mx-2 hover:bg-white/10 hover:backdrop-blur-sm ${
                                          currentPage === child.id
                                            ? 'text-orange-500 bg-white/5'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                        onClick={() => setOpenDropdowns(new Set())}
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={item.href ?? '#'}
                            aria-current={active ? 'page' : undefined}
                            className={`group relative px-4 py-2 rounded-full font-medium text-base transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                              active
                                ? 'text-orange-500 bg-white/10 backdrop-blur-sm'
                                : 'text-gray-300 hover:bg-white/10 hover:backdrop-blur-sm hover:text-white'
                            }`}
                          >
                            {item.label}
                            {active && (
                              <motion.div
                                layoutId="active-underline"
                                className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            )}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </LayoutGroup>

              {/* CTA Button (desktop) */}
              <Link href="/analyzer" className="ml-6">
                <button className="px-6 py-2.5 rounded-full font-semibold bg-orange-500 text-black hover:bg-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in overlay and panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link href="/" onClick={() => setIsMobileOpen(false)}>
                  <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer text-orange-500">
                    <Zap size={28} />
                    <span className="tracking-tight">ATS Analyzer</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              <motion.ul
                variants={mobileContainer}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="p-6 space-y-4"
                role="list"
              >
                {navItems.map((item) => {
                  const active = isItemActive(item, currentPage)
                  const hasChildren = !!item.children?.length
                  const dropdownOpen = openDropdowns.has(item.id)

                  return (
                    <motion.li key={item.id} variants={mobileItem}>
                      {hasChildren ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.id)}
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                            className={`flex items-center gap-2 w-full text-left font-medium text-xl transition-colors py-2 px-4 rounded-2xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                              active ? 'text-orange-500 bg-white/10' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            <motion.span
                              animate={{ rotate: dropdownOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-auto"
                            >
                              <ChevronDown size={20} />
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {dropdownOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-6 mt-2 space-y-2 overflow-hidden"
                                role="menu"
                              >
                                {item.children!.map((child) => (
                                  <motion.li key={child.id} variants={mobileItem} role="menuitem">
                                    <Link
                                      href={child.href ?? '#'}
                                      className={`block px-4 py-2 rounded-xl text-lg transition-colors hover:bg-white/10 ${
                                        currentPage === child.id ? 'text-orange-500 bg-white/5' : 'text-gray-300 hover:text-white'
                                      }`}
                                      onClick={() => {
                                        setIsMobileOpen(false)
                                        setOpenDropdowns(new Set())
                                      }}
                                    >
                                      {child.label}
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href ?? '#'}
                          onClick={() => setIsMobileOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`block py-2 px-4 rounded-2xl font-medium text-xl transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                            active ? 'text-orange-500 bg-white/10' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  )
                })}
              </motion.ul>

              {/* Mobile CTA */}
              <div className="p-6 mt-4">
                <Link href="/analyzer" onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full py-3.5 rounded-full font-semibold bg-orange-500 text-black hover:bg-orange-400 transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}