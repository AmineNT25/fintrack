'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { CategoryBadge } from '@/components/CategoryBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORIES } from '@/lib/categories'

interface Transaction {
  id: string
  date: string
  description: string | null
  category: string
  amount: number
  type: string
  notes: string | null
}

const emptyForm = { amount: '', type: 'expense', category: 'food', date: '', description: '', notes: '' }

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const searchParams = useSearchParams()
  const month = searchParams.get('month') ?? ''

  async function load() {
    const url = month ? `/api/transactions?month=${month}` : '/api/transactions'
    const res = await fetch(url)
    if (res.ok) setTransactions(await res.json())
  }

  useEffect(() => { load() }, [month])

  async function handleSave() {
    setSaving(true)
    const url = editing ? `/api/transactions/${editing.id}` : '/api/transactions'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success(editing ? 'Transaction updated' : 'Transaction added')
      setOpen(false)
      setEditing(null)
      setForm(emptyForm)
      load()
    } else {
      toast.error('Failed to save transaction')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this transaction?')) return
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Transaction deleted')
      load()
    } else {
      toast.error('Failed to delete transaction')
    }
  }

  function openEdit(t: Transaction) {
    setEditing(t)
    setForm({ amount: String(t.amount), type: t.type, category: t.category, date: t.date.slice(0, 10), description: t.description ?? '', notes: t.notes ?? '' })
    setOpen(true)
  }

  const displayed = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (search && !(t.description ?? '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Transactions</h1>
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setEditing(null); setForm(emptyForm) } }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                {editing ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Transaction description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : editing ? 'Update Transaction' : 'Save Transaction'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <Input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
            {['all', 'income', 'expense'].map(type => (
              <button key={type}
                className={`px-4 py-2 text-sm capitalize border-l first:border-l-0 border-zinc-300 dark:border-zinc-800 ${filterType === type ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'}`}
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

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
              {displayed.map(t => (
                <tr key={t.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                  <td className="py-3 px-4 text-sm text-zinc-700 dark:text-zinc-300">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">{t.description}</td>
                  <td className="py-3 px-4"><CategoryBadge category={t.category} /></td>
                  <td className={`py-3 px-4 text-sm text-right font-medium ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded" onClick={() => openEdit(t)}>
                        <Pencil className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </button>
                      <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
