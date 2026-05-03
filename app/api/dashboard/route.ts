import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CATEGORIES } from '@/lib/categories'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') ?? new Date().toISOString().slice(0, 7)
  const [year, mon] = month.split('-').map(Number)
  const monthStart = new Date(year, mon - 1, 1)
  const monthEnd = new Date(year, mon, 1)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [all, monthly, recent] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: session.user.id } }),
    prisma.transaction.findMany({ where: { userId: session.user.id, date: { gte: monthStart, lt: monthEnd } } }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ])

  const totalBalance = all.reduce(
    (sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0
  )

  const monthlyIncome = monthly
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = monthly
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    : 0

  const expMap: Record<string, number> = {}
  monthly.filter(t => t.type === 'expense').forEach(t => {
    expMap[t.category] = (expMap[t.category] ?? 0) + Number(t.amount)
  })
  const categoryBreakdown = Object.entries(expMap).map(([category, value]) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return { name: cat?.label ?? category, value, color: cat?.color ?? '#6b7280' }
  })

  // running balance over last 30 days
  const trendBase = all
    .filter(t => new Date(t.date) < thirtyDaysAgo)
    .reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)

  const trendTx = all
    .filter(t => new Date(t.date) >= thirtyDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let running = trendBase
  const balanceTrend = trendTx.map(t => {
    running += t.type === 'income' ? Number(t.amount) : -Number(t.amount)
    return {
      date: new Date(t.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      balance: Math.round(running),
    }
  })

  return NextResponse.json({
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    categoryBreakdown,
    balanceTrend,
    recentTransactions: recent.map(t => ({
      ...t,
      amount: Number(t.amount),
      date: t.date.toISOString(),
    })),
  })
}
