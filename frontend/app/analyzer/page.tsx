'use client';

import { useEffect, useState } from 'react';
import AtsAnalyzer from '@/components/atsAnalyzer';

export default function AnalyzerPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
      <style>{`
        @keyframes underlineGrow {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-underline-grow {
          animation: underlineGrow 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto text-center py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          ATS Resume Analyzer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 flex items-center justify-center gap-2">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full shadow-sm">
            AI-Powered
          </span>
          <span>Analyze your resume instantly</span>
        </p>
        <div
          className="mx-auto h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0 animate-underline-grow"
          style={{ maxWidth: '200px' }}
        />
      </div>

      {/* Analyzer Card */}
      <div
        className={`
          w-full max-w-4xl mx-auto
          backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30
          rounded-2xl shadow-xl p-6 sm:p-8 md:p-10
          transition-transform duration-300 hover:scale-[1.02]
          ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        `}
      >
        <AtsAnalyzer />
      </div>
    </main>
  );
}