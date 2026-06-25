import { getPosts } from '@/lib/queries'
import { TrendingUp, Eye, Heart, MessageSquare, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    const allPosts = await getPosts({ status: undefined, limit: 1000 })

    const totalViews = allPosts.reduce((sum, post) => sum + (post.views_count || 0), 0)
    const totalLikes = allPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0)
    const totalComments = allPosts.reduce((sum, post) => sum + (post.comments_count || 0), 0)
    const avgEngagement = allPosts.length > 0
        ? ((totalLikes + totalComments) / allPosts.length).toFixed(1)
        : 0

    const topByViews = [...allPosts]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 10)

    const topByEngagement = [...allPosts]
        .sort((a, b) => {
            const engA = (a.likes_count || 0) + (a.comments_count || 0)
            const engB = (b.likes_count || 0) + (b.comments_count || 0)
            return engB - engA
        })
        .slice(0, 10)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentPosts = allPosts.filter(post => new Date(post.created_at) > thirtyDaysAgo)

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-50 mb-2">Analytics Dashboard</h1>
                <p className="text-dark-400">Detailed insights into your blog performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-lg"><Eye className="w-6 h-6 text-blue-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Views</p><p className="text-2xl font-bold text-dark-50">{totalViews.toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">Across all posts</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-500/10 rounded-lg"><Heart className="w-6 h-6 text-red-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Likes</p><p className="text-2xl font-bold text-dark-50">{totalLikes.toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">User appreciation</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-yellow-500/10 rounded-lg"><MessageSquare className="w-6 h-6 text-yellow-400" /></div>
                        <div><p className="text-sm text-dark-400">Total Comments</p><p className="text-2xl font-bold text-dark-50">{totalComments.toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">User discussions</p>
                </div>
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-green-500/10 rounded-lg"><TrendingUp className="w-6 h-6 text-green-400" /></div>
                        <div><p className="text-sm text-dark-400">Avg Engagement</p><p className="text-2xl font-bold text-dark-50">{avgEngagement}</p></div>
                    </div>
                    <p className="text-xs text-dark-500 mt-2">Per post</p>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-semibold text-dark-50">Last 30 Days</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-dark-400 text-sm mb-1">Posts Published</p>
                        <p className="text-3xl font-bold text-dark-50">{recentPosts.length}</p>
                    </div>
                    <div>
                        <p className="text-dark-400 text-sm mb-1">Total Views</p>
                        <p className="text-3xl font-bold text-dark-50">{recentPosts.reduce((sum, p) => sum + (p.views_count || 0), 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-dark-400 text-sm mb-1">Engagement</p>
                        <p className="text-3xl font-bold text-dark-50">{recentPosts.reduce((sum, p) => sum + (p.likes_count || 0) + (p.comments_count || 0), 0)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-50 mb-4">Top Posts by Views</h2>
                    <div className="space-y-3">
                        {topByViews.length > 0 ? topByViews.map((post, index) => (
                            <div key={post.id} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                                <span className="text-primary-400 font-bold w-6">{index + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-dark-50 truncate">{post.title}</p>
                                    <p className="text-sm text-dark-400">{post.views_count} views</p>
                                </div>
                            </div>
                        )) : <p className="text-dark-400 text-center py-4">No posts yet</p>}
                    </div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-50 mb-4">Top Posts by Engagement</h2>
                    <div className="space-y-3">
                        {topByEngagement.length > 0 ? topByEngagement.map((post, index) => {
                            const engagement = (post.likes_count || 0) + (post.comments_count || 0)
                            return (
                                <div key={post.id} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                                    <span className="text-primary-400 font-bold w-6">{index + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-dark-50 truncate">{post.title}</p>
                                        <p className="text-sm text-dark-400">{post.likes_count} likes · {post.comments_count} comments</p>
                                    </div>
                                    <span className="text-green-400 font-semibold">{engagement}</span>
                                </div>
                            )
                        }) : <p className="text-dark-400 text-center py-4">No posts yet</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
