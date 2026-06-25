import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Login required to bookmark posts' }, { status: 401 })
  }

  const postId = params.id

  try {
    const existing = await db.bookmark.findUnique({
      where: { post_id_user_id: { post_id: postId, user_id: session.user.id } },
    })

    if (existing) {
      await db.bookmark.delete({ where: { id: existing.id } })
      return NextResponse.json({ bookmarked: false })
    } else {
      await db.bookmark.create({ data: { post_id: postId, user_id: session.user.id } })
      return NextResponse.json({ bookmarked: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ bookmarked: false })

  const bookmark = await db.bookmark.findUnique({
    where: { post_id_user_id: { post_id: params.id, user_id: session.user.id } },
  })

  return NextResponse.json({ bookmarked: !!bookmark })
}
