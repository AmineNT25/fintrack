import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireOwner(id: string, userId: string) {
  const g = await prisma.savingsGoal.findUnique({ where: { id } })
  if (!g || g.userId !== userId) return null
  return g
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await requireOwner(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { name, targetAmount, currentAmount, deadline, color } = await req.json()

  const updated = await prisma.savingsGoal.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(targetAmount !== undefined && { targetAmount }),
      ...(currentAmount !== undefined && { currentAmount }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      ...(color !== undefined && { color }),
    },
  })

  return NextResponse.json({
    ...updated,
    targetAmount: Number(updated.targetAmount),
    currentAmount: Number(updated.currentAmount),
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await requireOwner(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.savingsGoal.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
