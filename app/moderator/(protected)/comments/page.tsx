import { db } from '@/lib/db'
import Link from 'next/link'
import { CommentModerationClient } from '@/components/CommentModerationClient'

export const dynamic = 'force-dynamic'

export default async function ModeratorCommentsPage() {
  const comments = await db.comment.findMany({
    where: { status: 'pending' },
    include: { post: { select: { title: true, slug: true } } },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-2">Comment Moderation</h1>
      <p className="text-dark-400 mb-8">{comments.length} comment{comments.length !== 1 ? 's' : ''} pending review</p>
      <CommentModerationClient comments={comments.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        message: c.message,
        created_at: c.created_at.toISOString(),
        post_title: c.post.title,
        post_slug: c.post.slug,
      }))} />
    </div>
  )
}
