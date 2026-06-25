import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getCategories, getTags } from '@/lib/queries'
import { PostEditor } from '@/components/PostEditor'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user) redirect('/login')

    const raw = await db.post.findUnique({ where: { id: params.id } })

    if (!raw) return notFound()

    if (raw.author_id !== session.user.id && session.user.role !== 'admin') {
        return (
            <div className="p-8 text-center text-red-400">
                You are not authorized to edit this post.
            </div>
        )
    }

    const post = {
        ...raw,
        tags: JSON.parse(raw.tags || '[]'),
        created_at: raw.created_at.toISOString(),
        updated_at: raw.updated_at.toISOString(),
        published_at: raw.published_at?.toISOString() ?? null,
    }

    const [categories, tags] = await Promise.all([
        getCategories(),
        getTags()
    ])

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-dark-50 mb-2">Edit Post</h1>
                <p className="text-dark-400">Update your content.</p>
            </div>

            <PostEditor
                post={post as any}
                categories={categories}
                tags={tags}
            />
        </div>
    )
}
