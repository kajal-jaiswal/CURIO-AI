import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getCategories, getTags } from '@/lib/queries'
import { PostEditor } from '@/components/PostEditor'

interface AdminPostPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string) {
  const raw = await db.post.findUnique({ where: { id } })
  if (!raw) return null

  return {
    ...raw,
    tags: JSON.parse(raw.tags || '[]'),
    created_at: raw.created_at.toISOString(),
    updated_at: raw.updated_at.toISOString(),
    published_at: raw.published_at?.toISOString() ?? null,
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminPostPage({ params }: AdminPostPageProps) {
  const post = params.id === 'new' ? null : await getPost(params.id)

  if (params.id !== 'new' && !post) {
    notFound()
  }

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-8">
        {post ? 'Edit Post' : 'New Post'}
      </h1>
      <PostEditor post={post as any} categories={categories} tags={tags} />
    </div>
  )
}
