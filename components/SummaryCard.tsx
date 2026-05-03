import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SummaryCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: LucideIcon
}

export function SummaryCard({ title, value, change, isPositive, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="p-6 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{value}</p>
          <p className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change} vs last month
          </p>
        </div>
        <div className="p-3 rounded-lg bg-blue-500/10">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </Card>
  )
}
