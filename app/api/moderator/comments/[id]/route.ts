import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin', 'moderator'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { status } = await req.json()
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    // Read current status BEFORE updating — needed for comments_count bookkeeping
    const before = await db.comment.findUnique({ where: { id: params.id }, select: { status: true, post_id: true } })
    if (!before) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

    const comment = await db.comment.update({
      where: { id: params.id },
      data: { status },
    })

    // Adjust post comments_count based on transition
    if (status === 'approved' && before.status !== 'approved') {
      await db.post.update({ where: { id: before.post_id }, data: { comments_count: { increment: 1 } } })
    } else if (status !== 'approved' && before.status === 'approved') {
      await db.post.update({ where: { id: before.post_id }, data: { comments_count: { decrement: 1 } } })
    }

    return NextResponse.json({ success: true, comment })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['admin', 'moderator'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await db.comment.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
