'use client'

import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Upload, Zap, Loader, Info } from 'lucide-react'
import Navbar from '@/components/navbar'
import {useSession} from "next-auth/react"

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

  const { data: session } = useSession()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResume(file)
      setFileName(file.name)
    }
  }

  const handleAnalyze = async () => {
    if(!session){
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
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Disclaimer Banner */}
        <div
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #ff8c00',
            borderLeft: '4px solid #ff8c00',
          }}
          className="rounded-lg p-4 mb-8 flex items-start gap-3 animate-fade-in"
        >
          <Info style={{ color: '#ff8c00', flexShrink: 0 }} size={20} />
          <div>
            <p style={{ color: '#ffffff' }} className="font-semibold text-sm mb-1">
              Currently in Beta - Limited Training Data
            </p>
            <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
              Our AI model is currently trained on a limited dataset and we&apos;re continuously improving it. Despite this, our analysis provides approximately <span style={{ color: '#ff8c00' }} className="font-semibold">80% accuracy</span> in identifying ATS compatibility issues. We&apos;re working hard to expand our training data for even better results.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center animate-fade-in animation-delay-100">
          <h1 style={{ color: '#ffffff' }} className="text-3xl md:text-4xl font-bold mb-4">
            ATS Resume Analyzer
          </h1>
          <p style={{ color: '#cccccc' }} className="text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Get instant insights on how well your resume matches job descriptions and identify missing keywords to increase your chances of passing ATS filters.
          </p>
          <div
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ff8c00',
              color: '#ff8c00',
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Zap size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">AI-Powered Analysis</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div
            style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
            className="rounded-lg p-8 animate-fade-in animation-delay-200 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label style={{ color: '#ffffff' }} className="block text-sm font-semibold mb-3">
                  Job Description
                </label>
                <textarea
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{
                    backgroundColor: '#000000',
                    borderColor: '#333333',
                    color: '#ffffff',
                  }}
                  className="w-full min-h-40 resize-none border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600 transition-all duration-300"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label style={{ color: '#ffffff' }} className="block text-sm font-semibold mb-3">
                  Resume File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-input"
                  />
                  <label
                    htmlFor="resume-input"
                    style={{
                      backgroundColor: '#000000',
                      borderColor: '#333333',
                      cursor: 'pointer',
                    }}
                    className="flex items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 transition-all duration-300 hover:border-orange-500 hover:bg-orange-500/5 group"
                  >
                    <Upload style={{ color: '#ff8c00' }} size={24} className="group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <p style={{ color: '#ffffff' }} className="text-sm font-medium">
                        {fileName || 'Click to upload or drag and drop'}
                      </p>
                      <p style={{ color: '#888888' }} className="text-xs">
                        PDF, DOC, DOCX, or TXT
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444' }}
                  className="rounded-lg p-4 flex items-center gap-3 animate-fade-in"
                >
                  <AlertCircle style={{ color: '#ff4444' }} size={20} />
                  <p style={{ color: '#ff8888' }}>{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ff8c00cc' : '#ff8c00',
                  color: '#000000',
                }}
                className="w-full py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
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
              <div
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
                className="rounded-lg p-8 hover:border-orange-500/30 transition-all duration-300"
              >
                <h2 style={{ color: '#ffffff' }} className="text-xl font-bold mb-8">
                  Analysis Results
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Match Percentage */}
                  <div className="flex flex-col items-center justify-center">
                    <p style={{ color: '#888888' }} className="text-sm font-medium mb-6">
                      Match Score
                    </p>
                    <div
                      style={{
                        border: '4px solid #ff8c00',
                        backgroundColor: '#000000',
                      }}
                      className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
                    >
                      <div className="text-center">
                        <span style={{ color: '#ff8c00' }} className="text-5xl font-bold block">
                          {Math.round(result.ats_score)}%
                        </span>
                        <span style={{ color: '#888888' }} className="text-xs">
                          ATS Compatible
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex flex-col justify-center">
                    <p style={{ color: '#888888' }} className="text-sm font-medium mb-6">
                      Score Breakdown
                    </p>
                    <div className="space-y-6">
                      {/* Score Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ color: '#ffffff' }} className="text-sm font-semibold">
                            Overall ATS Score
                          </span>
                          <span style={{ color: '#ff8c00' }} className="text-2xl font-bold">
                            {Math.round(result.ats_score)}/100
                          </span>
                        </div>
                        <div style={{ backgroundColor: '#000000' }} className="h-3 rounded-full overflow-hidden border border-gray-800">
                          <div
                            style={{
                              backgroundColor: `${result.ats_score >= 75 ? '#00aa00' : result.ats_score >= 50 ? '#ff8c00' : '#ff4444'}`,
                              width: `${result.ats_score}%`,
                            }}
                            className="h-full transition-all duration-500"
                          />
                        </div>
                      </div>

                      {/* Status Message */}
                      <div
                        style={{
                          backgroundColor: result.ats_score >= 75 ? '#001a00' : result.ats_score >= 50 ? '#1a1a00' : '#1a0000',
                          border: `1px solid ${result.ats_score >= 75 ? '#00aa00' : result.ats_score >= 50 ? '#ff8c00' : '#ff4444'}`,
                        }}
                        className="rounded-lg p-4"
                      >
                        <p
                          style={{
                            color: result.ats_score >= 75 ? '#00aa00' : result.ats_score >= 50 ? '#ff8c00' : '#ff4444',
                          }}
                          className="text-sm font-semibold"
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
                <div
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
                  className="rounded-lg p-6 hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      style={{
                        backgroundColor: '#001a00',
                        color: '#00aa00',
                      }}
                      className="p-2 rounded-lg"
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold">
                      Matched Keywords
                    </h3>
                    <span
                      style={{
                        backgroundColor: '#00aa00',
                        color: '#000000',
                      }}
                      className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
                    >
                      {result.found_skills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.found_skills && result.found_skills.length > 0 ? (
                      result.found_skills.map((keyword, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#001a00',
                            borderColor: '#00aa00',
                            color: '#00aa00',
                            border: '1px solid #00aa00',
                          }}
                          className="rounded-full px-3 py-1 text-xs font-semibold hover:bg-green-500/10 transition-all duration-300 cursor-default"
                        >
                          ✓ {keyword}
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#888888' }} className="text-sm">
                        No matched keywords
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
                  className="rounded-lg p-6 hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      style={{
                        backgroundColor: '#1a0000',
                        color: '#ff6666',
                      }}
                      className="p-2 rounded-lg"
                    >
                      <AlertCircle size={18} />
                    </div>
                    <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold">
                      Missing Keywords
                    </h3>
                    <span
                      style={{
                        backgroundColor: '#ff6666',
                        color: '#000000',
                      }}
                      className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
                    >
                      {result.missing_skills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills && result.missing_skills.length > 0 ? (
                      result.missing_skills.map((keyword, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#1a0000',
                            borderColor: '#ff6666',
                            color: '#ff8888',
                            border: '1px solid #ff6666',
                          }}
                          className="rounded-full px-3 py-1 text-xs font-semibold hover:bg-red-500/10 transition-all duration-300 cursor-default"
                        >
                          ✗ {keyword}
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#00aa00' }} className="text-sm font-semibold">
                        ✓ All keywords matched!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
                className="rounded-lg p-6 hover:border-orange-500/30 transition-all duration-300"
              >
                <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap style={{ color: '#ff8c00' }} size={20} />
                  Quick Tips to Improve
                </h3>
                <ul style={{ color: '#cccccc' }} className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span style={{ color: '#ff8c00' }} className="flex-shrink-0 font-bold">
                      1.
                    </span>
                    <span>
                      Add missing keywords naturally throughout your resume, especially in the skills section and job descriptions.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: '#ff8c00' }} className="flex-shrink-0 font-bold">
                      2.
                    </span>
                    <span>
                      Use standard section headers (Education, Experience, Skills) that ATS systems recognize.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: '#ff8c00' }} className="flex-shrink-0 font-bold">
                      3.
                    </span>
                    <span>
                      Avoid images, charts, and unusual formatting that may confuse ATS scanners.
                    </span>
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
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#ff8c00',
                  color: '#ff8c00',
                  border: '2px solid #ff8c00',
                }}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/30"
              >
                Analyze Another Resume
              </button>
            </div>
          )}

          {/* Coming Soon Features */}
          {!result && (
            <div
              style={{ backgroundColor: '#0a0a0a', border: '1px solid #222222' }}
              className="rounded-lg p-8 mt-12 animate-fade-in animation-delay-300"
            >
              <h2 style={{ color: '#ffffff' }} className="text-2xl font-bold mb-2">
                Coming Soon
              </h2>
              <p style={{ color: '#cccccc' }} className="mb-8 text-sm leading-relaxed">
                More AI-powered tools to accelerate your job search and resume optimization:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div
                  style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
                  className="rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2 group-hover:scale-110 transition-transform origin-left">
                    Resume Builder
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                    Create ATS-optimized resumes with AI assistance, professional templates, and real-time format checking.
                  </p>
                </div>
                <div
                  style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
                  className="rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2 group-hover:scale-110 transition-transform origin-left">
                    AI Job Finder
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                    Automatic job recommendations based on your resume, skills, and experience for perfect matches.
                  </p>
                </div>
                <div
                  style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
                  className="rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2 group-hover:scale-110 transition-transform origin-left">
                    Cover Letter Generator
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
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
      `}</style>
    </div>
  )
}

export default AtsAnalyzer
