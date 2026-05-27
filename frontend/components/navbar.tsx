'use client'

import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav 
      style={{ 
        borderBottom: '1px solid #222222', 
        backgroundColor: '#000000',
      }}
      className="sticky top-0 z-50 backdrop-blur-md bg-black/80"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href='/' 
          style={{ color: '#ff8c00', fontFamily: "var(--font-montserrat)" }} 
          className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 group flex-shrink-0"
        >
          <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
            <Zap size={20} />
          </div>
          <span className="hidden sm:inline">ATS Analyzer</span>
        </Link>

        {/* Right Section - Auth & CTA */}
        <div className="flex items-center gap-3 ml-auto">
          {session ? (
            <>
              <span 
                style={{ color: '#cccccc', fontSize: 13 }} 
                className="hidden sm:inline pr-3 border-r border-gray-700"
              >
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                style={{ backgroundColor: '#222', color: '#fff' }}
                className="px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#cccccc',
                  border: '1px solid #333333'
                }}
                className="px-3 py-1.5 rounded text-sm font-semibold hover:border-orange-500 hover:text-white transition-all duration-300"
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
                style={{ backgroundColor: '#ff8c00', color: '#000000' }}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded text-sm font-bold hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group"
              >
                <span>Analyze</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
