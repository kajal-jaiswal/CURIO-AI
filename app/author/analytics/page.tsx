import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { BarChart3, FileText, Eye, Heart, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AuthorAnalyticsPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const postsRaw = userId ? await db.post.findMany({
        where: { author_id: userId },
        orderBy: { created_at: 'desc' },
    }) : []

    const posts = postsRaw.map(p => ({
        ...p,
        created_at: p.created_at.toISOString(),
    }))

    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.status === 'published').length
    const totalViews = posts.reduce((sum, p) => sum + (p.views_count || 0), 0)
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0)
    const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0)
    const avgViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0

    const topPosts = [...posts]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 5)

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-50 mb-2">Your Analytics</h1>
                <p className="text-dark-400">Track your content performance and engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary-500/10 rounded-lg"><FileText className="w-6 h-6 text-primary-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Posts</p><p className="text-2xl font-bold text-dark-50">{totalPosts}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">{publishedPosts} published</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-lg"><Eye className="w-6 h-6 text-blue-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Views</p><p className="text-2xl font-bold text-dark-50">{totalViews.toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">Avg: {avgViews} per post</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-500/10 rounded-lg"><Heart className="w-6 h-6 text-red-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Likes</p><p className="text-2xl font-bold text-dark-50">{totalLikes}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">Reader appreciation</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-green-500/10 rounded-lg"><TrendingUp className="w-6 h-6 text-green-400" /></div>
                        <div><p className="text-sm text-dark-400">Engagement</p><p className="text-2xl font-bold text-dark-50">{totalLikes + totalComments}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">{totalComments} comments</p>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-semibold text-dark-50">Top Performing Posts</h2>
                </div>
                {topPosts.length > 0 ? (
                    <div className="space-y-4">
                        {topPosts.map((post, index) => (
                            <div key={post.id} className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary-500/10 rounded-lg">
                                    <span className="text-primary-400 font-bold">{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-dark-50 truncate">{post.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-dark-400">
                                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views_count || 0}</span>
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{post.likes_count || 0}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-dark-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No posts yet. Start creating content to see analytics!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
