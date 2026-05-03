'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, CheckCircle, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string | null
}

function CircularProgress({ progress, size = 120 }: { progress: number; size?: number }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-300 dark:text-zinc-800" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="text-blue-500 transition-all duration-500" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{Math.round(Math.min(progress, 100))}%</span>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [open, setOpen] = useState(false)
  const [addFundsOpen, setAddFundsOpen] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '' })
  const [fundsAmount, setFundsAmount] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/goals')
    if (res.ok) setGoals(await res.json())
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    setSaving(true)
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, targetAmount: parseFloat(form.targetAmount), deadline: form.deadline || null }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Goal created')
      setOpen(false)
      setForm({ name: '', targetAmount: '', deadline: '' })
      load()
    } else {
      toast.error('Failed to create goal')
    }
  }

  async function handleAddFunds(id: string) {
    const amount = parseFloat(fundsAmount)
    if (!amount) return
    const goal = goals.find(g => g.id === id)!
    const res = await fetch(`/api/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentAmount: goal.currentAmount + amount }),
    })
    if (res.ok) {
      toast.success(`$${amount.toFixed(2)} added to ${goal.name}`)
      setAddFundsOpen(null)
      setFundsAmount('')
      load()
    } else {
      toast.error('Failed to add funds')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Savings Goals</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-zinc-100">Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input placeholder="e.g., Emergency Fund" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input type="number" placeholder="0.00" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={saving} onClick={handleCreate}>
                {saving ? 'Creating…' : 'Create Goal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No Savings Goals Yet</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Create your first savings goal to start tracking your progress</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const completed = progress >= 100
            return (
              <Card key={goal.id} className={`p-6 ${completed ? 'bg-green-500/10 border-green-500/30' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{goal.name}</h3>
                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {completed && (
                    <div className="p-2 rounded-full bg-green-500/20">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center my-6">
                  <CircularProgress progress={progress} />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Current</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">${goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Target</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Remaining</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">${Math.max(0, goal.targetAmount - goal.currentAmount).toLocaleString()}</span>
                  </div>
                </div>
                {!completed && (
                  <Dialog open={addFundsOpen === goal.id} onOpenChange={v => setAddFundsOpen(v ? goal.id : null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Amount</Label>
                          <Input type="number" placeholder="0.00" value={fundsAmount} onChange={e => setFundsAmount(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" />
                        </div>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleAddFunds(goal.id)}>
                          Add Funds
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
