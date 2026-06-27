import React from 'react'
import ResumeEnhancePage from "@/components/ResumeEnhancePage"

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-5xl">
        <ResumeEnhancePage />
      </div>
    </div>
  )
}

export default Page