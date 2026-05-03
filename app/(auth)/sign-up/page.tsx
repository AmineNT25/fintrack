'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

function passwordStrength(pwd: string) {
  if (pwd.length === 0) return { strength: 0, label: '', color: '' }
  if (pwd.length < 6)   return { strength: 33,  label: 'Weak',   color: 'bg-red-500' }
  if (pwd.length < 10)  return { strength: 66,  label: 'Medium', color: 'bg-amber-500' }
  return                       { strength: 100, label: 'Strong', color: 'bg-green-500' }
}

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      let message = 'Registration failed'
      try { message = (await res.json()).error ?? message } catch { /* non-JSON body */ }
      setError(message)
      setLoading(false)
      return
    }
    await signIn('credentials', { email, password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-500/30 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-blue-500/10 to-green-500/10 p-4 rounded-2xl">
              <Image src="/logo.png" alt="FINTRACK Logo" width={64} height={64} className="drop-shadow-2xl" />
            </div>
          </div>
          <h2 className="font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400 mb-3">
            FINTRACK
          </h2>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <Input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)}
                className="pl-10 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="pl-10 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <Input type={showPassword ? 'text' : 'password'} placeholder="Create a password"
                value={password} onChange={e => setPassword(e.target.value)} required
                className="pl-10 pr-10 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-1">
                <div className="h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${strength.color}`} style={{ width: `${strength.strength}%` }} />
                </div>
                <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <Input type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password"
                value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="pl-10 pr-10 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400">
              I agree to the{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Terms and Privacy Policy
              </a>
            </label>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {loading ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}
