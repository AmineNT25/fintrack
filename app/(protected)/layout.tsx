import { Suspense } from 'react'
import { Navigation } from '@/components/Navigation'

function NavFallback() {
  return <div className="h-[65px] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950" />
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <Suspense fallback={<NavFallback />}>
        <Navigation />
      </Suspense>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
