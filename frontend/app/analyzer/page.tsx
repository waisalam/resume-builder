'use client';

import { useEffect, useState } from 'react';
import AtsAnalyzer from '@/components/atsAnalyzer';

export default function AnalyzerPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen flex items-start justify-center p-4 md:p-8">
      <div
        className={`
          w-full max-w-4xl mx-auto transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30
          rounded-2xl shadow-xl p-6 sm:p-8 md:p-10
        `}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full">
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATS Resume Analyzer
          </h1>
          <span className="ml-auto text-xs font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full shadow-sm">
            AI-Powered
          </span>
        </div>
        <AtsAnalyzer />
      </div>
    </main>
  );
}