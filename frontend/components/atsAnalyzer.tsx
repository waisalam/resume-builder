'use client'

import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Upload, Zap, Loader } from 'lucide-react'

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResume(file)
      setFileName(file.name)
    }
  }

  const handleAnalyze = async () => {
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

      const response = await fetch('http://127.0.0.1:5000/analyze', {
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
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid #222222', backgroundColor: '#000000' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div style={{ color: '#ff8c00' }} className="text-2xl font-bold flex items-center gap-2">
            <Zap size={28} />
            ATS Analyzer
          </div>
          <div style={{ color: '#ffffff' }} className="text-sm font-medium">
            AI-Powered Resume Analyzer
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 style={{ color: '#ffffff' }} className="text-4xl md:text-5xl font-bold mb-4">
            Optimize Your Resume for ATS
          </h1>
          <p style={{ color: '#cccccc' }} className="text-lg mb-6">
            Analyze how well your resume matches job descriptions using AI trained on 6000+ resume data
          </p>
          <div style={{ color: '#ff8c00', backgroundColor: '#1a1a1a', borderLeft: '3px solid #ff8c00' }} className="inline-flex items-center gap-2 px-4 py-2 rounded">
            <Zap size={18} />
            <span className="text-sm font-medium">Powered by AI • 6000+ Resume Training Data</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-8">
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
                  className="w-full min-h-40 resize-none border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600"
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
                    className="flex items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-5"
                  >
                    <Upload style={{ color: '#ff8c00' }} size={24} />
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
                  className="rounded-lg p-4 flex items-center gap-3"
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
                className="w-full py-4 rounded-lg font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Score Card */}
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Match Percentage */}
                  <div>
                    <p style={{ color: '#888888' }} className="text-sm font-medium mb-4">
                      Match Score
                    </p>
                    <div className="flex items-center justify-center">
                      <div
                        style={{
                          border: '4px solid #ff8c00',
                          backgroundColor: '#000000',
                        }}
                        className="w-40 h-40 rounded-full flex items-center justify-center"
                      >
                        <span style={{ color: '#ff8c00' }} className="text-5xl font-bold">
                          {Math.round(result.ats_score)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ATS Score */}
                  <div>
                    <p style={{ color: '#888888' }} className="text-sm font-medium mb-4">
                      ATS Score
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span style={{ color: '#ffffff' }} className="text-4xl font-bold">
                          {result.ats_score}
                        </span>
                        <span style={{ color: '#888888' }}>/100</span>
                      </div>
                      <div style={{ backgroundColor: '#000000' }} className="h-3 rounded-full overflow-hidden">
                        <div
                          style={{
                            backgroundColor: '#ff8c00',
                            width: `${result.ats_score}%`,
                          }}
                          className="h-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Matched Keywords */}
                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 style={{ color: '#00aa00' }} size={20} />
                    <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold">
                      Matched Keywords
                    </h3>
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
                          className="rounded-full px-3 py-1 text-xs font-semibold"
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
                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle style={{ color: '#ff6666' }} size={20} />
                    <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold">
                      Missing Keywords
                    </h3>
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
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                        >
                          ✗ {keyword}
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#00aa00' }} className="text-sm font-semibold">
                        All keywords matched!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {/* {result.suggestions && result.suggestions.length > 0 && (
                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-6">
                  <h3 style={{ color: '#ffffff' }} className="text-lg font-semibold mb-4">
                    AI Recommendations
                  </h3>
                  <ul style={{ color: '#cccccc' }} className="space-y-3">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex gap-3">
                        <div
                          style={{
                            backgroundColor: '#ff8c00',
                            color: '#000000',
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        >
                          {idx + 1}
                        </div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              {/* Reset Button */}
              <button
                onClick={() => {
                  setResult(null)
                  setJobDescription('')
                  setResume(null)
                  setFileName('')
                }}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#333333',
                  color: '#ffffff',
                  border: '1px solid #333333',
                }}
                className="w-full py-3 rounded-lg font-semibold transition-colors hover:bg-orange-500 hover:bg-opacity-10 hover:border-orange-500"
              >
                Analyze Another Resume
              </button>
            </div>
          )}

          {/* Future Features Preview */}
          {!result && (
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }} className="rounded-lg p-8 mt-12">
              <h2 style={{ color: '#ffffff' }} className="text-2xl font-bold mb-6">
                Coming Soon
              </h2>
              <p style={{ color: '#cccccc' }} className="mb-8 text-sm">
                Powered by AI trained on 6000+ resume data, we are building more features to help you succeed:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2">
                    Resume Maker
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                    Create ATS-optimized resumes with AI assistance, professional templates, and instant format checking.
                  </p>
                </div>
                <div>
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2">
                    AI Job Finder
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                    Automatic job recommendations based on your resume, skills, and experience. Get matched with perfect opportunities.
                  </p>
                </div>
                <div>
                  <div style={{ color: '#ff8c00' }} className="text-lg font-semibold mb-2">
                    Auto Cover Letter
                  </div>
                  <p style={{ color: '#cccccc' }} className="text-sm leading-relaxed">
                    Generate personalized cover letters automatically using AI. One-click generation for each job application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AtsAnalyzer
