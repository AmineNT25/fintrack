import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireOwner(id: string, userId: string) {
  const t = await prisma.transaction.findUnique({ where: { id } })
  if (!t || t.userId !== userId) return null
  return t
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await requireOwner(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { amount, type, category, date, description, notes } = await req.json()

  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...(amount !== undefined && { amount }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(description !== undefined && { description }),
      ...(notes !== undefined && { notes }),
    },
  })

  return NextResponse.json({ ...updated, amount: Number(updated.amount) })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await requireOwner(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.transaction.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
