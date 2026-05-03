import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">404</h1>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Page not found</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="inline-block mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
