import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 })
  }

  try {
    const comments = await db.comment.findMany({
      where: { post_id: postId, status: 'approved' },
      orderBy: { created_at: 'desc' },
    })

    const serialized = comments.map(c => ({
      id: c.id,
      post_id: c.post_id,
      user_id: c.user_id,
      parent_id: c.parent_id,
      name: c.name,
      email: c.email,
      message: c.message,
      created_at: c.created_at.toISOString(),
      updated_at: c.updated_at.toISOString(),
      status: c.status,
    }))

    return NextResponse.json(serialized)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
