import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Eye } from 'lucide-react'
import { DeleteAuthorPostButton } from '@/components/DeleteAuthorPostButton'

export const dynamic = 'force-dynamic'

export default async function AuthorPostsPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const postsRaw = userId ? await db.post.findMany({
        where: { author_id: userId },
        orderBy: { created_at: 'desc' },
    }) : []

    const posts = postsRaw.map(p => ({
        ...p,
        created_at: p.created_at.toISOString(),
        tags: JSON.parse(p.tags || '[]'),
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">My Posts</h1>
                    <p className="text-dark-400">Manage your blog content</p>
                </div>
                <Link href="/author/posts/new" className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {posts.length > 0 ? posts.map((post) => (
                    <div key={post.id} className="bg-dark-900 border border-dark-800 rounded-lg p-6 hover:border-primary-500/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-dark-50">{post.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.status}
                                    </span>
                                </div>
                                {post.excerpt && <p className="text-dark-400 mb-4 line-clamp-2">{post.excerpt}</p>}
                                <div className="flex items-center gap-6 text-sm text-dark-400">
                                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views_count || 0} views</span>
                                    <span>{post.likes_count || 0} likes</span>
                                    <span>{post.comments_count || 0} comments</span>
                                    <span>·</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/author/posts/${post.id}/edit`} className="p-2 bg-dark-800 hover:bg-dark-700 text-primary-400 rounded-lg transition-colors" title="Edit post">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                {post.status === 'published' && (
                                    <Link href={`/blog/${post.slug}`} className="p-2 bg-dark-800 hover:bg-dark-700 text-blue-400 rounded-lg transition-colors" title="View post" target="_blank">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                )}
                                <DeleteAuthorPostButton postId={post.id} postTitle={post.title} />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-dark-900 border border-dark-800 rounded-lg p-12 text-center">
                        <p className="text-dark-400 mb-4">You haven&apos;t created any posts yet</p>
                        <Link href="/author/posts/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            Create Your First Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
