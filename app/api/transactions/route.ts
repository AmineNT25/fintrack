import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const category = searchParams.get('category')
  const type = searchParams.get('type')

  const where: Record<string, unknown> = { userId: session.user.id }

  if (month) {
    const [year, mon] = month.split('-').map(Number)
    where.date = { gte: new Date(year, mon - 1, 1), lt: new Date(year, mon, 1) }
  }
  if (category) where.category = category
  if (type) where.type = type

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(
    transactions.map(t => ({ ...t, amount: Number(t.amount) }))
  )
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount, type, category, date, description, notes } = await req.json()

  if (!amount || !type || !category || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      amount,
      type,
      category,
      description: description || null,
      date: new Date(date),
      notes: notes || null,
    },
  })

  return NextResponse.json({ ...transaction, amount: Number(transaction.amount) }, { status: 201 })
}
