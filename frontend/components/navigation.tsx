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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="w-full bg-black border-b border-zinc-800"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition text-[#ff8c00]" aria-label="ATS Analyzer home">
              <Zap size={28} />
              <span className="hidden sm:inline">ATS Analyzer</span>
            </div>
          </Link>

          {/* Desktop tab bar - full width scrollable container */}
          <div className="hidden md:flex flex-1 items-center justify-end ml-8">
            <div className="flex-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              <LayoutGroup>
                <ul
                  role="list"
                  className="flex items-center gap-1 min-w-max px-2"
                >
                  {navItems.map((item) => {
                    const active = isItemActive(item, currentPage)
                    const hasChildren = !!item.children?.length
                    const dropdownOpen = openDropdowns.has(item.id)

                    return (
                      <li key={item.id} className="relative snap-start">
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => toggleDropdown(item.id)}
                              aria-expanded={dropdownOpen}
                              aria-haspopup="true"
                              className={`relative z-10 flex items-center gap-1 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                                active ? 'text-orange-500' : 'text-gray-300 hover:text-white'
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
                                  layoutId="active-tab-bg"
                                  className="absolute inset-0 rounded-full bg-orange-500/20 -z-10"
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
                                  className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-[#111111] border border-zinc-800 shadow-xl py-2 z-50"
                                  role="menu"
                                >
                                  {item.children!.map((child) => (
                                    <li key={child.id} role="menuitem">
                                      <Link
                                        href={child.href ?? '#'}
                                        className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-orange-400 ${
                                          currentPage === child.id ? 'text-orange-500' : 'text-gray-300'
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
                            className={`relative z-10 block px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                              active ? 'text-orange-500' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            {item.label}
                            {active && (
                              <motion.div
                                layoutId="active-tab-bg"
                                className="absolute inset-0 rounded-full bg-orange-500/20 -z-10"
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
            </div>

            {/* CTA Button (desktop) */}
            <Link href="/analyzer" className="ml-4 flex-shrink-0">
              <button className="px-6 py-2 rounded-full font-semibold hover:opacity-90 transition cursor-pointer bg-[#ff8c00] text-black whitespace-nowrap">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <motion.ul
                variants={mobileContainer}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="mt-4 pb-4 space-y-3"
                role="list"
              >
                {navItems.map((item, index) => {
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
                            className="flex items-center gap-1 w-full text-left font-medium transition-colors py-2 px-2 rounded-md hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            style={{ color: active ? '#ff8c00' : '#cccccc' }}
                          >
                            <span>{item.label}</span>
                            <motion.span
                              animate={{ rotate: dropdownOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="inline-flex"
                            >
                              <ChevronDown size={18} />
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {dropdownOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-2 space-y-2 overflow-hidden"
                                role="menu"
                              >
                                {item.children!.map((child) => (
                                  <motion.li
                                    key={child.id}
                                    variants={mobileItem}
                                    custom={index * 0.1}
                                    role="menuitem"
                                  >
                                    <Link
                                      href={child.href ?? '#'}
                                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-white/5 ${
                                        currentPage === child.id ? 'text-orange-500' : 'text-gray-300'
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
                          className="block py-2 px-2 rounded-md font-medium transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          style={{ color: active ? '#ff8c00' : '#cccccc' }}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  )
                })}
              </motion.ul>

              {/* Mobile CTA */}
              <motion.div variants={mobileItem} custom={navItems.length} className="mt-4">
                <Link href="/analyzer" onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition bg-[#ff8c00] text-black">
                    Get Started
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}