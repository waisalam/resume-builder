'use client'

import React, { useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Upload, Zap, Loader, Info, FileText, Search, PenTool } from 'lucide-react'
import Navbar from '@/components/navbar'
import { useSession } from 'next-auth/react'

interface AnalysisResult {
  ats_score: number
  found_skills: string[]
  missing_skills: string[]
  predicted_role: string
}

const AtsAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [fileName, setFileName] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const { data: session } = useSession()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResume(file)
      setFileName(file.name)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain')) {
      setResume(file)
      setFileName(file.name)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!session) {
      return setError('You must be signed in to analyze your resume.')
    }
    setError('')
    setResult(null)

    if (!resume || !jobDescription.trim()) {
      setError('Please provide both a job description and upload a resume.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('job_description', jobDescription)
      formData.append('resume', resume)

      const response = await fetch('https://resume-builder-47zq.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Disclaimer Banner */}
        <div className="bg-amber-900/20 border border-amber-600/50 border-l-4 border-l-amber-500 rounded-lg p-4 mb-8 flex items-start gap-3 animate-fade-in">
          <Info className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-amber-200 font-semibold text-sm mb-1">
              Currently in Beta - Limited Training Data
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Our AI model is currently trained on a limited dataset and we&apos;re continuously improving it. Despite this, our analysis provides approximately{' '}
              <span className="font-semibold text-amber-400">80% accuracy</span> in identifying ATS compatibility issues. We&apos;re working hard to expand our training data for even better results.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center animate-fade-in animation-delay-100">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            ATS Resume Analyzer
          </h1>
          <p className="text-base md:text-lg text-zinc-400 mb-6 max-w-2xl mx-auto">
            Get instant insights on how well your resume matches job descriptions and identify missing keywords to increase your chances of passing ATS filters.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
            <Zap size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">AI-Powered Analysis</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/50 hover:shadow-red-500/5 transition-all duration-300 animate-fade-in animation-delay-200">
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label htmlFor="job-desc" className="block text-sm font-semibold mb-3 text-white">
                  Job Description
                </label>
                <textarea
                  id="job-desc"
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full min-h-40 resize-none border border-zinc-700 rounded-xl p-4 bg-[#2a2a2a] text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  Resume File
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-red-500 bg-red-500/10 scale-[1.02]'
                      : 'border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-input"
                  />
                  <label htmlFor="resume-input" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="text-red-500 group-hover:scale-110 transition-transform" size={24} />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {fileName || 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          PDF, DOC, DOCX, or TXT
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="text-red-400" size={20} />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-100 ${
                  loading
                    ? 'bg-red-500 text-white cursor-not-allowed animate-pulse-red'
                    : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fade-in animation-delay-200">
              {/* Score Card */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-red-500/5 transition-all duration-300">
                <h2 className="text-xl font-bold mb-8 text-white">Analysis Results</h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Match Percentage */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-zinc-400 mb-6">Match Score</p>
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex flex-col items-center justify-center shadow-lg shadow-red-500/30">
                      <span className="text-5xl font-bold text-white">{Math.round(result.ats_score)}%</span>
                      <span className="text-xs text-zinc-300 mt-1">ATS Compatible</span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-zinc-400 mb-6">Score Breakdown</p>
                    <div className="space-y-6">
                      {/* Score Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">Overall ATS Score</span>
                          <span className="text-2xl font-bold text-red-400">{Math.round(result.ats_score)}/100</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                          <div
                            className={`h-full transition-all duration-500 ${
                              result.ats_score >= 75
                                ? 'bg-green-500'
                                : result.ats_score >= 50
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${result.ats_score}%` }}
                          />
                        </div>
                      </div>

                      {/* Status Message */}
                      <div
                        className={`rounded-lg p-4 ${
                          result.ats_score >= 75
                            ? 'bg-green-900/20 border border-green-500/30'
                            : result.ats_score >= 50
                            ? 'bg-amber-900/20 border border-amber-500/30'
                            : 'bg-red-900/20 border border-red-500/30'
                        }`}
                      >
                        <p
                          className={`text-sm font-semibold ${
                            result.ats_score >= 75
                              ? 'text-green-400'
                              : result.ats_score >= 50
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {result.ats_score >= 75
                            ? '✓ Great match! Your resume should pass ATS filters.'
                            : result.ats_score >= 50
                            ? '⚠ Moderate match. Consider adding missing keywords.'
                            : '✗ Low match. Update your resume with job-relevant keywords.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Matched Keywords */}
                <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-6 hover:border-red-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/30 text-red-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Matched Keywords</h3>
                    <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                      {result.found_skills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.found_skills && result.found_skills.length > 0 ? (
                      result.found_skills.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="rounded-full px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-default"
                        >
                          ✓ {keyword}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">No matched keywords</p>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-6 hover:border-red-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/30 text-red-400">
                      <AlertCircle size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Missing Keywords</h3>
                    <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                      {result.missing_skills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills && result.missing_skills.length > 0 ? (
                      result.missing_skills.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="rounded-full px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-default"
                        >
                          ✗ {keyword}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm font-semibold text-green-400">✓ All keywords matched!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-6 hover:border-red-500/30 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Zap className="text-red-500" size={20} />
                  Quick Tips to Improve
                </h3>
                <ul className="space-y-3 text-sm text-zinc-300">
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold flex-shrink-0">1.</span>
                    <span>Add missing keywords naturally throughout your resume, especially in the skills section and job descriptions.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold flex-shrink-0">2.</span>
                    <span>Use standard section headers (Education, Experience, Skills) that ATS systems recognize.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold flex-shrink-0">3.</span>
                    <span>Avoid images, charts, and unusual formatting that may confuse ATS scanners.</span>
                  </li>
                </ul>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setResult(null)
                  setJobDescription('')
                  setResume(null)
                  setFileName('')
                }}
                className="w-full py-3 rounded-xl border-2 border-red-500 text-red-400 font-semibold transition-all duration-300 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20"
              >
                Analyze Another Resume
              </button>
            </div>
          )}

          {/* Coming Soon Features */}
          {!result && (
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-8 mt-12 animate-fade-in animation-delay-300">
              <h2 className="text-2xl font-bold mb-2 text-white">Coming Soon</h2>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                More AI-powered tools to accelerate your job search and resume optimization:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-lg font-semibold text-red-400 group-hover:translate-x-1 transition-transform">Resume Builder</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Create ATS-optimized resumes with AI assistance, professional templates, and real-time format checking.
                  </p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-lg font-semibold text-red-400 group-hover:translate-x-1 transition-transform">AI Job Finder</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Automatic job recommendations based on your resume, skills, and experience for perfect matches.
                  </p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <PenTool className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-lg font-semibold text-red-400 group-hover:translate-x-1 transition-transform">Cover Letter Generator</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Generate personalized cover letters with one-click automation for each job application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseRed {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
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

        .animate-pulse-red {
          animation: pulseRed 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default AtsAnalyzer