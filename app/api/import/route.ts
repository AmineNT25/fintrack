import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { transactions } = await req.json()

  if (!Array.isArray(transactions)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const valid: {
    userId: string; amount: number; type: string; category: string;
    description: string | null; date: Date; notes: string | null
  }[] = []
  let skipped = 0

  for (const t of transactions) {
    const amount = parseFloat(t.amount)
    const date = new Date(t.date)
    if (!t.type || !t.category || isNaN(amount) || isNaN(date.getTime())) {
      skipped++
      continue
    }
    valid.push({
      userId: session.user.id,
      amount,
      type: t.type,
      category: t.category,
      description: t.description || null,
      date,
      notes: t.notes || null,
    })
  }

  if (valid.length > 0) {
    await prisma.transaction.createMany({ data: valid })
  }

  return NextResponse.json({ created: valid.length, skipped })
}
