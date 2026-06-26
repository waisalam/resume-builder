'use client'

import { ArrowRight, CheckCircle2, Zap, Brain, FileText, Briefcase, Sparkles, TrendingUp, BarChart3, Users, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import Navbar from '@/components/navbar'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const { data: session } = useSession()
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [counts, setCounts] = useState({ resumes: 0, improvement: 0, users: 0, interviews: 0 })
  const countersRef = useRef<HTMLDivElement>(null)
  const [countersStarted, setCountersStarted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const headlines = [
    'Land More Interviews with AI',
    'Optimize Your Resume in Seconds',
    'Beat ATS Filters Every Time',
    'Your Dream Job Starts Here'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (countersRef.current) {
      observer.observe(countersRef.current)
    }

    return () => observer.disconnect()
  }, [countersStarted])

  useEffect(() => {
    if (!countersStarted) return

    const targets = { resumes: 10000, improvement: 95, users: 5000, interviews: 12000 }
    const duration = 2000
    const steps = 60
    const increment = {
      resumes: Math.floor(targets.resumes / steps),
      improvement: Math.floor(targets.improvement / steps),
      users: Math.floor(targets.users / steps),
      interviews: Math.floor(targets.interviews / steps)
    }

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setCounts({
        resumes: Math.min(increment.resumes * currentStep, targets.resumes),
        improvement: Math.min(increment.improvement * currentStep, targets.improvement),
        users: Math.min(increment.users * currentStep, targets.users),
        interviews: Math.min(increment.interviews * currentStep, targets.interviews)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setCounts(targets)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [countersStarted])

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(testimonialTimer)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced machine learning analyzes your resume against job descriptions with 98% accuracy',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Zap,
      title: 'Smart Suggestions',
      description: 'Get intelligent recommendations to optimize keywords, skills, and experience for each role',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Live Preview',
      description: 'See real-time changes and ATS score updates as you refine your resume content',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'ATS Optimization',
      description: 'Beat applicant tracking systems with tailored formatting and keyword strategies',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const testimonials = [
    {
      quote: 'This tool helped me land interviews at top tech companies. The AI analysis is incredibly accurate.',
      author: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      rating: 5
    },
    {
      quote: 'My ATS score went from 45% to 92% after following the suggestions. Highly recommended!',
      author: 'Michael Chen',
      role: 'Product Manager at Amazon',
      rating: 5
    },
    {
      quote: 'The smart suggestions saved me hours of research. I finally understand what recruiters are looking for.',
      author: 'Emily Rodriguez',
      role: 'Marketing Director at Spotify',
      rating: 5
    }
  ]

  const previousTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <main className="w-full min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-orange-50/10 to-white dark:from-black dark:via-gray-900 dark:to-black pt-20 transition-all duration-700">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-amber-500 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-600 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/80 backdrop-blur-sm border border-orange-200/60 dark:bg-white/5 dark:border-orange-500/20 animate-fade-in-down">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-widest">
              AI-Powered Resume Optimization
            </span>
          </div>

          {/* Headline */}
          <div className="h-24 sm:h-28 lg:h-32 mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight transition-all duration-500 animate-fade-in">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-orange-600 dark:from-white dark:via-gray-100 dark:to-orange-400">
                {headlines[headlineIndex]}
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in animation-delay-200">
            Get past ATS filters and land more interviews. Our AI analyzes your resume against job descriptions with 98% accuracy powered by 6000+ real resume data.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-300">
            <button
              onClick={(e) => {
                if (!session) {
                  e.preventDefault()
                  signIn("google")
                } else {
                  window.location.href = '/analyzer'
                }
              }}
              className="relative group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Analyze Resume
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <Link
              href="/live-preview"
              className="px-8 py-4 border border-orange-300 bg-white/80 text-orange-600 font-bold text-lg rounded-xl backdrop-blur-sm hover:bg-orange-50 hover:border-orange-500 transition-all duration-300 inline-flex items-center gap-2 group hover:shadow-lg hover:shadow-orange-500/20 dark:bg-white/5 dark:text-orange-400 dark:border-orange-500/50 dark:hover:bg-white/10 dark:hover:border-orange-500 dark:hover:shadow-orange-500/20"
            >
              Build Resume
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-500 animate-fade-in animation-delay-1000">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free analysis
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Instant results
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gray-50/80 dark:bg-gradient-to-b dark:from-black dark:via-gray-900/30 dark:to-black transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-100">
              Powerful features to supercharge your job search
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 dark:bg-white/5 dark:border-white/10 dark:hover:border-orange-500/40 dark:hover:shadow-xl dark:hover:shadow-orange-500/5 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={countersRef} className="relative py-24 bg-white dark:bg-gradient-to-b dark:from-black dark:to-gray-900/50 border-y border-gray-200 dark:border-gray-800/50 transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {counts.resumes.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Resumes Analyzed</div>
              <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">And counting</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {counts.improvement}%
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">ATS Score Improvement</div>
              <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">Average increase</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {counts.users.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</div>
              <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">Growing daily</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {counts.interviews.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviews Landed</div>
              <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">Success stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="relative py-24 bg-gray-50/80 dark:bg-gradient-to-b dark:from-gray-900/50 dark:to-black transition-all">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-100">
              Join thousands of satisfied job seekers
            </p>
          </div>

          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm transition-all duration-500 dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-sm">
              <Quote className="w-10 h-10 text-orange-500/30 mb-6" />
              <blockquote className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-8 leading-relaxed font-light italic">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </blockquote>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 pt-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonials[activeTestimonial].author}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{testimonials[activeTestimonial].role}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={previousTestimonial}
                    className="p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:border-orange-500/50 transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:border-orange-500/50 transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'w-8 bg-orange-500' : 'w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-black transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-100">
              Three simple steps to optimize your resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                step: '01',
                title: 'Upload Resume',
                description: 'Upload your resume in any format. Our AI extracts and analyzes every detail instantly.'
              },
              {
                icon: Brain,
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI compares your resume against the job description and ATS criteria with 98% accuracy.'
              },
              {
                icon: TrendingUp,
                step: '03',
                title: 'Get Results',
                description: 'Receive detailed insights, keyword matches, missing skills, and actionable recommendations.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 dark:bg-white/5 dark:border-white/10 dark:hover:border-orange-500/30 dark:hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-6xl font-black text-orange-500/10 mb-4 select-none">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 dark:from-orange-500/20 dark:to-amber-500/20">
                  <item.icon className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gray-50/80 dark:bg-gradient-to-b dark:from-black dark:via-gray-900/20 dark:to-black border-t border-gray-200 dark:border-gray-800/50 transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 animate-fade-in animation-delay-100">
            Join thousands of professionals who have improved their ATS scores and landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-200">
            <button
              onClick={(e) => {
                if (!session) {
                  e.preventDefault()
                  signIn("google")
                } else {
                  window.location.href = '/analyzer'
                }
              }}
              className="relative group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Analysis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <Link
              href="/live-preview"
              className="px-8 py-4 border border-orange-300 bg-white/80 text-orange-600 font-bold text-lg rounded-xl backdrop-blur-sm hover:bg-orange-50 hover:border-orange-500 transition-all duration-300 inline-flex items-center gap-2 group hover:shadow-lg hover:shadow-orange-500/20 dark:bg-white/5 dark:text-orange-400 dark:border-orange-500/50 dark:hover:bg-white/10 dark:hover:border-orange-500 dark:hover:shadow-orange-500/20"
            >
              Build Resume
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800/50 py-12 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ATS Analyzer</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">AI-powered resume optimization to help you land more interviews.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/analyzer" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Analyze Resume</Link></li>
                <li><Link href="/live-preview" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Build Resume</Link></li>
                <li><Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
            <p>ATS Analyzer &bull; Powered by AI trained on 6000+ resume data</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .dark ::-webkit-scrollbar-track {
          background: #000000;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.8);
        }
      `}</style>
    </main>
  )
}