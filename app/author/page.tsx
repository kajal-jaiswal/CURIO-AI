import { createClient } from '@/lib/supabase/server'
import { BarChart3, FileText, Eye, Heart } from 'lucide-react'
import Link from 'next/link'

export default async function AuthorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get author's posts
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const totalPosts = posts?.length || 0
    const publishedPosts = posts?.filter(p => p.status === 'published').length || 0
    const totalViews = posts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0
    const totalLikes = posts?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-50 mb-2">Welcome Back, Author! 👋</h1>
                <p className="text-dark-400">Here's an overview of your content performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FileText className="w-8 h-8 text-primary-400" />
                        <span className="text-xs text-dark-500">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-dark-50 mb-1">{totalPosts}</div>
                    <div className="text-sm text-dark-400">Posts Created</div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="w-8 h-8 text-green-400" />
                        <span className="text-xs text-dark-500">Published</span>
                    </div>
                    <div className="text-3xl font-bold text-dark-50 mb-1">{publishedPosts}</div>
                    <div className="text-sm text-dark-400">Live Posts</div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Eye className="w-8 h-8 text-blue-400" />
                        <span className="text-xs text-dark-500">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-dark-50 mb-1">{totalViews.toLocaleString()}</div>
                    <div className="text-sm text-dark-400">Views</div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Heart className="w-8 h-8 text-red-400" />
                        <span className="text-xs text-dark-500">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-dark-50 mb-1">{totalLikes}</div>
                    <div className="text-sm text-dark-400">Likes</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link
                    href="/author/posts/new"
                    className="bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg p-6 transition-all"
                >
                    <h3 className="text-xl font-bold mb-2">✍️ Create New Post</h3>
                    <p className="text-primary-100 text-sm">Start writing your next article</p>
                </Link>

                <Link
                    href="/author/posts"
                    className="bg-dark-900 border border-dark-800 hover:border-primary-500 rounded-lg p-6 transition-all"
                >
                    <h3 className="text-xl font-bold text-dark-50 mb-2">📝 Manage Posts</h3>
                    <p className="text-dark-400 text-sm">Edit and organize your content</p>
                </Link>

                <Link
                    href="/author/analytics"
                    className="bg-dark-900 border border-dark-800 hover:border-primary-500 rounded-lg p-6 transition-all"
                >
                    <h3 className="text-xl font-bold text-dark-50 mb-2">📊 View Analytics</h3>
                    <p className="text-dark-400 text-sm">Track your performance</p>
                </Link>
            </div>

            {/* Recent Posts */}
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-dark-50 mb-4">Recent Posts</h2>
                {posts && posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-dark-50 mb-1">{post.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-dark-400">
                                        <span className={`px-2 py-1 rounded text-xs ${post.status === 'published'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {post.status}
                                        </span>
                                        <span>{post.views_count || 0} views</span>
                                        <span>{post.likes_count || 0} likes</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/author/posts/${post.id}/edit`}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-dark-400 mb-4">You haven't created any posts yet</p>
                        <Link
                            href="/author/posts/new"
                            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                            Create Your First Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
