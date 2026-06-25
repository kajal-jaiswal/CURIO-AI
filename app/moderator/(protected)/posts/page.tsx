import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { FileText, ExternalLink } from 'lucide-react'
import { PostApprovalClient } from '@/components/PostApprovalClient'

export const dynamic = 'force-dynamic'

export default async function ModeratorPostsPage() {
  const posts = await db.post.findMany({
    where: { status: 'draft' },
    include: { author: { select: { full_name: true, email: true } } },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-2">Post Review Queue</h1>
      <p className="text-dark-400 mb-8">{posts.length} draft post{posts.length !== 1 ? 's' : ''} awaiting review</p>
      <PostApprovalClient posts={posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        author: p.author?.full_name || p.author?.email || 'Unknown',
        created_at: p.created_at.toISOString(),
        status: p.status,
      }))} />
    </div>
  )
}
