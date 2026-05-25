import Link from 'next/link'
import {
  BarChart3,
  Target,
  FileUp,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Transaction Tracking',
    description:
      'Log income and expenses by category. Search, filter, and sort every transaction with ease.',
  },
  {
    icon: Target,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'Savings Goals',
    description:
      "Set targets, track progress with circular indicators, and add funds whenever you're ready.",
  },
  {
    icon: BarChart3,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Visual Analytics',
    description:
      'Line charts and pie charts give you an instant read on where your money goes each month.',
  },
  {
    icon: FileUp,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'CSV Import',
    description:
      'Bulk-import transactions from any bank export in three steps with a guided wizard.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Secure by Default',
    description:
      'Passwords hashed with bcrypt. Sessions are JWT-based and protected by NextAuth.',
  },
  {
    icon: Zap,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    title: 'Month Navigator',
    description:
      'Jump between months instantly — every chart and table updates in sync, no page reload.',
  },
]

const stats = [
  { value: '10+', label: 'Spending categories' },
  { value: '100%', label: 'Free to use' },
  { value: '3-step', label: 'CSV import wizard' },
  { value: 'Real-time', label: 'Dashboard analytics' },
]

const trustItems = ['No credit card required', 'Free forever', 'Secure & private']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* ─── Header ───────────────────────────────────────────── */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            FINTRACK
          </span>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/10 via-green-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Your personal finance, all in one place
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Take control of{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              your finances
            </span>
          </h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Track transactions, set savings goals, visualise spending with charts, and import
            from any bank — all from one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 gap-2">
                Start for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            {trustItems.map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Built for people who want clarity over their money without the complexity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => {
              const Icon = f.icon
              return (
                <Card
                  key={f.title}
                  className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-8 py-14">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to get started?</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                Create your free account in seconds. No credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-10 gap-2">
                    Create free account <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-10"
                  >
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              FINTRACK
            </span>
            <span>· Personal Finance Dashboard</span>
          </div>
          <p>© {new Date().getFullYear()} FINTRACK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
