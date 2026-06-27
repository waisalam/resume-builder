'use client';

import dynamic from 'next/dynamic';

const AtsAnalyzer = dynamic(() => import('@/components/atsAnalyzer'), {
  loading: () => <AnalyzerSkeleton />,
  ssr: false,
});

function AnalyzerSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading analyzer">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="flex gap-4">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4 py-16 md:px-8 md:py-24">
      <section
        aria-labelledby="main-heading"
        className={`
          w-full max-w-6xl mx-auto
          backdrop-blur-xl bg-white/10 dark:bg-gray-900/60
          rounded-3xl border border-white/20 dark:border-white/10
          shadow-2xl dark:shadow-black/20
          p-6 md:p-10
          animate-fadeIn
        `}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full" aria-hidden="true">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 id="main-heading" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATS Resume Analyzer
          </h1>
          <span className="ml-auto text-xs font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full shadow-sm">
            AI-Powered
          </span>
        </div>
        <div className="w-full">
          <AtsAnalyzer />
        </div>
      </section>
    </main>
  );
}