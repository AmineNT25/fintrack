export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',  color: '#a855f7' },
  { id: 'transport',     label: 'Transportation', color: '#3b82f6' },
  { id: 'housing',       label: 'Housing',        color: '#10b981' },
  { id: 'entertainment', label: 'Entertainment',  color: '#f59e0b' },
  { id: 'healthcare',    label: 'Healthcare',     color: '#ef4444' },
  { id: 'shopping',      label: 'Shopping',       color: '#ec4899' },
  { id: 'utilities',     label: 'Utilities',      color: '#06b6d4' },
  { id: 'income',        label: 'Income',         color: '#22c55e' },
  { id: 'other',         label: 'Other',          color: '#6b7280' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const CATEGORY_COLORS: Record<string, string> = {
  food:          'bg-purple-500/20 text-purple-400 border-purple-500/30',
  transport:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  housing:       'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  entertainment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  healthcare:    'bg-red-500/20 text-red-400 border-red-500/30',
  shopping:      'bg-pink-500/20 text-pink-400 border-pink-500/30',
  utilities:     'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  income:        'bg-green-500/20 text-green-400 border-green-500/30',
  other:         'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}
