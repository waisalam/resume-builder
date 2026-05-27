'use client'

import { ArrowRight, CheckCircle2, Zap, Brain, FileText, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid #222222', backgroundColor: '#000000' }}>
        <div  className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" style={{ color: '#ff8c00', fontFamily: "var(--font-montserrat)"  }} className="text-2xl font-bold flex items-center gap-2">
            <Zap size={28} />
            ATS Analyzer
          </Link>
          <a
            href="/analyzer"
            style={{ backgroundColor: '#ff8c00', color: '#000000' }}
            className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: '#000000' }} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-32 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Zap style={{ color: '#ff8c00' }} size={24} />
            <span style={{ color: '#ff8c00' }} className="text-sm font-semibold uppercase tracking-widest">
              Powered by AI
            </span>
          </div>
          <h1 style={{ color: '#ffffff', fontFamily: "var(--font-montserrat)" }} className="text-5xl md:text-7xl font-bold mb-2 leading-tight">
            Your Resume, AI-Optimized for Success
          </h1>
          <p style={{ color: '#cccccc' }} className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Get past ATS filters with confidence. Our AI analyzes your resume against job descriptions using patterns learned from 6000+ real resume data.
          </p>
          <a
            href="/analyzer"
            style={{ backgroundColor: '#ff8c00', color: '#000000' }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition mr-5"
          >
            Start Analyzing <ArrowRight size={20} />
          </a>
            <a
            href="/live-preview"
            style={{ backgroundColor: '#ff8c00', color: '#000000' }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
          >
            Build Resume <ArrowRight size={20} />
          </a>
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            backgroundColor: '#ff8c00',
            opacity: '0.05',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: '0',
            pointerEvents: 'none',
          }}
        />
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: '#1a1a1a' }} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div style={{ color: '#ff8c00' }} className="text-4xl font-bold mb-2">
                6000+
              </div>
              <p style={{ color: '#cccccc' }}>Resume Data Points</p>
              <p style={{ color: '#888888' }} className="text-sm mt-2">
                AI trained on real successful resumes
              </p>
            </div>
            <div className="text-center">
              <div style={{ color: '#ff8c00' }} className="text-4xl font-bold mb-2">
                98%
              </div>
              <p style={{ color: '#cccccc' }}>ATS Accuracy</p>
              <p style={{ color: '#888888' }} className="text-sm mt-2">
                Based on actual ATS system patterns
              </p>
            </div>
            <div className="text-center">
              <div style={{ color: '#ff8c00' }} className="text-4xl font-bold mb-2">
                Instant
              </div>
              <p style={{ color: '#cccccc' }}>Analysis & Feedback</p>
              <p style={{ color: '#888888' }} className="text-sm mt-2">
                Get results in seconds with AI insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: '#000000' }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: '#ffffff' }} className="text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p style={{ color: '#cccccc' }} className="text-center text-lg max-w-2xl mx-auto mb-16">
            Simple, powerful, and backed by AI trained on thousands of real resumes
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}
              className="rounded-lg p-8"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '48px',
                  height: '48px',
                }}
                className="rounded-full flex items-center justify-center font-bold text-xl mb-4"
              >
                1
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-3">
                Upload Your Resume
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                Upload your resume in any format (PDF, DOC, DOCX, TXT). Our AI extracts and analyzes every detail.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}
              className="rounded-lg p-8"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '48px',
                  height: '48px',
                }}
                className="rounded-full flex items-center justify-center font-bold text-xl mb-4"
              >
                2
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-3">
                Paste Job Description
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                Paste the job description you&apos;re targeting. Our AI compares your resume against ATS criteria.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}
              className="rounded-lg p-8"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '48px',
                  height: '48px',
                }}
                className="rounded-full flex items-center justify-center font-bold text-xl mb-4"
              >
                3
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-3">
                Get AI Insights
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                Receive detailed analysis, matching keywords, missing skills, and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ backgroundColor: '#1a1a1a' }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: '#ffffff' }} className="text-4xl font-bold text-center mb-16">
            Powerful Features
          </h2>

          <div className="space-y-8">
            {/* Feature 1 */}
            <div
              style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
              className="rounded-lg p-8 flex gap-8 items-start"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                }}
                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Brain size={28} />
              </div>
              <div>
                <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                  AI-Powered Analysis
                </h3>
                <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                  Machine learning trained on 6000+ real resume data points ensures accurate, intelligent analysis of your resume against ATS systems.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
              className="rounded-lg p-8 flex gap-8 items-start"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                }}
                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                  Keyword Matching
                </h3>
                <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                  Instantly see which keywords from the job description are in your resume and which are missing. Optimize for better matching rates.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
              className="rounded-lg p-8 flex gap-8 items-start"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                }}
                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <FileText size={28} />
              </div>
              <div>
                <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                  Actionable Recommendations
                </h3>
                <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                  Get specific, AI-generated suggestions to improve your resume score. Know exactly what to change to pass ATS filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section style={{ backgroundColor: '#000000' }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ color: '#ffffff' }} className="text-4xl font-bold text-center mb-4">
            Coming Soon
          </h2>
          <p style={{ color: '#cccccc' }} className="text-center text-lg max-w-2xl mx-auto mb-16">
            More AI-powered tools to accelerate your job search
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Maker */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '2px dashed #ff8c00' }}
              className="rounded-lg p-8 text-center"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 16px',
                }}
                className="rounded-lg flex items-center justify-center"
              >
                <FileText size={32} />
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                Resume Maker
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed mb-4">
                Create ATS-optimized resumes from scratch with AI assistance, professional templates, and real-time feedback.
              </p>
              <div style={{ color: '#ff8c00' }} className="text-xs font-semibold">
                COMING SOON
              </div>
            </div>

            {/* Auto Job Finder */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '2px dashed #ff8c00' }}
              className="rounded-lg p-8 text-center"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 16px',
                }}
                className="rounded-lg flex items-center justify-center"
              >
                <Briefcase size={32} />
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                Auto Job Finder
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed mb-4">
                AI-powered job recommendations matched to your resume. Discover opportunities that fit your skills and experience perfectly.
              </p>
              <div style={{ color: '#ff8c00' }} className="text-xs font-semibold">
                COMING SOON
              </div>
            </div>

            {/* Cover Letter Generator */}
            <div
              style={{ backgroundColor: '#1a1a1a', border: '2px dashed #ff8c00' }}
              className="rounded-lg p-8 text-center"
            >
              <div
                style={{
                  backgroundColor: '#ff8c00',
                  color: '#000000',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 16px',
                }}
                className="rounded-lg flex items-center justify-center"
              >
                <Brain size={32} />
              </div>
              <h3 style={{ color: '#ffffff' }} className="text-xl font-semibold mb-2">
                Auto Cover Letter
              </h3>
              <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed mb-4">
                Generate personalized cover letters in seconds. One-click creation for each job application with AI-powered content.
              </p>
              <div style={{ color: '#ff8c00' }} className="text-xs font-semibold">
                COMING SOON
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#1a1a1a' }} className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 style={{ color: '#ffffff' }} className="text-4xl font-bold mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p style={{ color: '#cccccc' }} className="text-lg mb-8">
            Join thousands of job seekers who have improved their ATS scores with our AI-powered analysis.
          </p>
          <a
            href="/analyzer"
            style={{ backgroundColor: '#ff8c00', color: '#000000' }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
          >
            Start Free Analysis <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#000000', borderTop: '1px solid #222222' }} className="py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p style={{ color: '#888888' }} className="text-sm">
            ATS Analyzer • Powered by AI trained on 6000+ resume data
          </p>
        </div>
      </footer>
    </div>
  )
}
