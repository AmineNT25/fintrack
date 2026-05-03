import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(goals.map(g => ({
    ...g,
    targetAmount: Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
  })))
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, targetAmount, deadline, color } = await req.json()

  if (!name || !targetAmount) {
    return NextResponse.json({ error: 'Name and target amount are required' }, { status: 400 })
  }

  const goal = await prisma.savingsGoal.create({
    data: {
      userId: session.user.id,
      name,
      targetAmount,
      deadline: deadline ? new Date(deadline) : null,
      color: color || null,
    },
  })

  return NextResponse.json({ ...goal, targetAmount: Number(goal.targetAmount), currentAmount: Number(goal.currentAmount) }, { status: 201 })
}
