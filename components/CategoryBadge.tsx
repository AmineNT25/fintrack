import { CATEGORIES, CATEGORY_COLORS } from '@/lib/categories'

export function CategoryBadge({ category }: { category: string }) {
  const key = category.toLowerCase()
  const cat = CATEGORIES.find(c => c.id === key)
  const colorClass = CATEGORY_COLORS[key] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${colorClass}`}>
      {cat?.label ?? category}
    </span>
  )
}
