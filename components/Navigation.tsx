'use client'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LayoutDashboard, Receipt, Upload, Target, LogOut, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'

const navLinks = [
  { name: 'Dashboard',     href: '/dashboard',    icon: LayoutDashboard },
  { name: 'Transactions',  href: '/transactions', icon: Receipt },
  { name: 'Import CSV',    href: '/import',       icon: Upload },
  { name: 'Savings Goals', href: '/goals',        icon: Target },
]

function buildMonthOptions() {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    options.push({ value, label })
  }
  return options
}

const MONTH_OPTIONS = buildMonthOptions()

export function Navigation() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  const currentMonth = searchParams.get('month') ?? MONTH_OPTIONS[0].value

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  function onMonthChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">
              FINTRACK
            </span>
            <div className="flex gap-1">
              {navLinks.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={currentMonth}
              onChange={e => onMonthChange(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100"
            >
              {MONTH_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
