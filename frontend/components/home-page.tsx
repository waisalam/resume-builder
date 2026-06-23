'use client'

import { ArrowRight, CheckCircle2, Zap, Brain, FileText, Briefcase, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import Navbar from '@/components/navbar'
import WorkWithUs from '@/components/work-with-us'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black pt-20 pb-32">
        {/* Static gradient background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-8" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-4" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center">
          {/* Animated Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 animate-fade-in">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">AI-Powered Innovation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight animate-fade-in animation-delay-100 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-orange-400">
              Optimize Your Resume
            </span>
            <br />
            <span className="text-white">With AI Intelligence</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in animation-delay-200">
            Get past ATS filters and land more interviews. Our AI analyzes your resume against job descriptions with 98% accuracy powered by 6000+ real resume data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-300">
            <a
              href="/analyzer"
              onClick={(e) => {
                if (!session) {
                  e.preventDefault()
                  signIn("google")
                }
              }}
              className="relative group px-8 py-4 bg-orange-500 text-black font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analyzing Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="/live-preview"
              className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-bold text-lg rounded-lg hover:bg-orange-500/10 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              Build Resume
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              No credit card required
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              Free analysis
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              Instant results
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="bg-black py-20 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '6000+', label: 'Resume Data Points', desc: 'Real successful resumes analyzed' },
              { number: '98%', label: 'ATS Accuracy', desc: 'Industry-leading matching precision' },
              { number: 'Instant', label: 'AI Analysis', desc: 'Results in seconds, not hours' }
            ].map((stat, i) => (
              <div key={i} className="group text-center p-6 rounded-xl hover:bg-gray-900/50 transition-all duration-300">
                <div className="text-5xl font-black text-orange-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{stat.label}</h3>
                <p className="text-gray-500 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Simple & Powerful</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three steps to optimize your resume for success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                number: '1',
                title: 'Upload Your Resume',
                desc: 'Upload in any format (PDF, DOC, DOCX, TXT). Our AI extracts and analyzes every detail.'
              },
              {
                icon: Brain,
                number: '2',
                title: 'Paste Job Description',
                desc: 'Add the job you\'re targeting. AI compares your resume against ATS criteria.'
              },
              {
                icon: TrendingUp,
                number: '3',
                title: 'Get AI Insights',
                desc: 'Receive detailed analysis, keyword matching, missing skills, and recommendations.'
              }
            ].map((step, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:translate-y-[-4px]"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-black text-black text-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                
                <div className="mb-6 mt-4">
                  <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-black via-gray-900/20 to-black py-20 border-y border-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed</p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                desc: 'Machine learning trained on 6000+ real resume data ensures accurate, intelligent analysis against ATS systems.'
              },
              {
                icon: CheckCircle2,
                title: 'Keyword Optimization',
                desc: 'See exactly which keywords from job descriptions are in your resume and which are missing to maximize matching.'
              },
              {
                icon: Zap,
                title: 'Actionable Recommendations',
                desc: 'Get specific AI-generated suggestions to improve your score. Know exactly what to change to pass ATS filters.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-gradient-to-r from-gray-900/50 to-black border border-gray-800 hover:border-orange-500/50 hover:bg-gray-800/30 transition-all duration-300 flex gap-6 items-start hover:translate-x-2"
              >
                <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-400">More AI-powered tools to accelerate your job search</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Resume Maker',
                desc: 'Create ATS-optimized resumes with AI assistance, professional templates, and real-time feedback.'
              },
              {
                icon: Briefcase,
                title: 'Auto Job Finder',
                desc: 'AI-powered job recommendations matched to your resume. Discover perfect opportunities.'
              },
              {
                icon: Brain,
                title: 'Auto Cover Letter',
                desc: 'Generate personalized cover letters in seconds. One-click creation for each application.'
              }
            ].map((upcoming, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-black border-2 border-dashed border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 text-center hover:scale-105"
              >
                <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-colors duration-300">
                  <upcoming.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{upcoming.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{upcoming.desc}</p>
                <div className="inline-block px-4 py-2 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-semibold uppercase tracking-wide">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Optimize?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of job seekers improving their ATS scores with AI-powered analysis.
          </p>
          <a
            href="/analyzer"
            onClick={(e) => {
              if (!session) {
                e.preventDefault()
                signIn("google")
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-black font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 group"
          >
            Start Free Analysis
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Work With Us Section */}
      <WorkWithUs />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-gray-500 text-sm">
          <p>ATS Analyzer • Powered by AI trained on 6000+ resume data</p>
        </div>
      </footer>

      {/* Global Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #000000;
        }

        ::-webkit-scrollbar-thumb {
          background: #ff8c00;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #ffaa22;
        }
      `}</style>
    </div>
  )
}