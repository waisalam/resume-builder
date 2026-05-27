'use client'

import { useState } from 'react'
import { Zap, Menu, X } from 'lucide-react'
import Link from 'next/link'

interface NavigationProps {
  currentPage?: 'home' | 'analyzer'
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'Analyzer', href: '/analyzer', id: 'analyzer' },
  ]

  return (
    <nav style={{ borderBottom: '1px solid #222222', backgroundColor: '#000000' }}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div href="/" style={{ color: '#ff8c00' }} className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <Zap size={28} />
              ATS Analyzer
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <div
                  style={{
                    color: currentPage === item.id ? '#ff8c00' : '#cccccc',
                  }}
                  className="font-medium transition hover:text-orange-500 cursor-pointer"
                >
                  {item.label}
                </div>
              </Link>
            ))}
            <Link href="/analyzer">
              <button
                style={{ backgroundColor: '#ff8c00', color: '#000000' }}
                className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: '#ffffff' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  style={{
                    color: currentPage === item.id ? '#ff8c00' : '#cccccc',
                  }}
                  className="font-medium transition hover:text-orange-500 block py-2"
                >
                  {item.label}
                </div>
              </Link>
            ))}
            <Link href="/analyzer" onClick={() => setIsOpen(false)}>
              <button
                style={{ backgroundColor: '#ff8c00', color: '#000000' }}
                className="w-full px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
