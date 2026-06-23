import HomePage from '@/components/home-page'

export function generateMetadata() {
  return {
    title: 'Resume Builder - AI-Powered Resume Analysis & Enhancement',
    description: 'Resume Builder - AI-Powered Resume Analysis & Enhancement',
  }
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-6 lg:px-8">
      <HomePage />
    </main>
  )
}