import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Login required to like posts' }, { status: 401 })
  }

  const postId = params.id

  try {
    const existing = await db.postLike.findUnique({
      where: { post_id_user_id: { post_id: postId, user_id: session.user.id } },
    })

    if (existing) {
      await db.postLike.delete({ where: { id: existing.id } })
      await db.post.update({ where: { id: postId }, data: { likes_count: { decrement: 1 } } })
      return NextResponse.json({ liked: false })
    } else {
      await db.postLike.create({ data: { post_id: postId, user_id: session.user.id } })
      await db.post.update({ where: { id: postId }, data: { likes_count: { increment: 1 } } })
      return NextResponse.json({ liked: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ liked: false, count: 0 })

  const [like, post] = await Promise.all([
    db.postLike.findUnique({
      where: { post_id_user_id: { post_id: params.id, user_id: session.user.id } },
    }),
    db.post.findUnique({ where: { id: params.id }, select: { likes_count: true } }),
  ])

  return NextResponse.json({ liked: !!like, count: post?.likes_count ?? 0 })
}
