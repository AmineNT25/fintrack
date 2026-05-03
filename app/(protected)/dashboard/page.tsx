'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, MoreVertical } from 'lucide-react'
import { SummaryCard } from '@/components/SummaryCard'
import { CategoryBadge } from '@/components/CategoryBadge'
import { Card } from '@/components/ui/card'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface DashboardData {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  categoryBreakdown: { name: string; value: number; color: string }[]
  balanceTrend: { date: string; balance: number }[]
  recentTransactions: {
    id: string; date: string; description: string; category: string; amount: number; type: string
  }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const searchParams = useSearchParams()
  const month = searchParams.get('month') ?? new Date().toISOString().slice(0, 7)

  useEffect(() => {
    setData(null)
    fetch(`/api/dashboard?month=${month}`)
      .then(r => r.json())
      .then(setData)
  }, [month])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500 dark:text-zinc-400">Loading…</div>
      </div>
    )
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard title="Total Balance"     value={fmt(data.totalBalance)}     change="All time"          isPositive={data.totalBalance >= 0}     icon={Wallet} />
        <SummaryCard title="Monthly Income"    value={fmt(data.monthlyIncome)}    change="This month"        isPositive={true}                       icon={TrendingUp} />
        <SummaryCard title="Monthly Expenses"  value={fmt(data.monthlyExpenses)}  change="This month"        isPositive={data.monthlyExpenses === 0}  icon={TrendingDown} />
        <SummaryCard title="Savings Rate"      value={`${data.savingsRate.toFixed(1)}%`} change="This month" isPositive={data.savingsRate > 0}        icon={PiggyBank} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Balance Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.balanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} labelStyle={{ color: '#a1a1aa' }} />
              <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {data.categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">Date</th>
                <th className="text-left py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">Description</th>
                <th className="text-left py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">Category</th>
                <th className="text-right py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">Amount</th>
                <th className="text-right py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map(t => (
                <tr key={t.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                  <td className="py-3 px-4 text-sm text-zinc-700 dark:text-zinc-300">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{t.description}</td>
                  <td className="py-3 px-4"><CategoryBadge category={t.category} /></td>
                  <td className={`py-3 px-4 text-sm text-right font-medium ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
                      <MoreVertical className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
