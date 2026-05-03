'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        {!submitted ? (
          <>
            <Link href="/sign-in" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
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
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Reset your password</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Password reset via email is coming soon.
              </p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-900 dark:text-zinc-100">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <Input type="email" placeholder="you@example.com" required
                    className="pl-10 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
                </div>
              </div>
              <Button type="submit" disabled className="w-full bg-blue-500 hover:bg-blue-600 text-white opacity-50 cursor-not-allowed">
                Send Reset Link (Coming Soon)
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Check your inbox</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If that email is registered, you&apos;ll receive a reset link when this feature is enabled.
              </p>
            </div>
            <Link href="/sign-in" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-4">
              Return to Sign In
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
