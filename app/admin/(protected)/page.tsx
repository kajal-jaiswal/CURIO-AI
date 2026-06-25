import { FileText, Eye, MessageSquare, TrendingUp, Users, Megaphone, MousePointerClick } from 'lucide-react'
import { getPosts } from '@/lib/queries'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [allPosts, publishedPosts, totalUsers, ads, pendingComments] = await Promise.all([
    getPosts({ status: 'all' as any, limit: 1000 }),
    getPosts({ status: 'published', limit: 1000 }),
    db.user.count(),
    db.advertisement.findMany({ select: { is_active: true, impressions_count: true, clicks_count: true } }),
    db.comment.count({ where: { status: 'pending' } }),
  ])

  const totalViews = allPosts.reduce((sum, post) => sum + (post.views_count || 0), 0)
  const topPosts = [...allPosts].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5)
  const activeAds = ads.filter(a => a.is_active).length
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions_count || 0), 0)
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50">Admin Dashboard</h1>
        <div className="text-sm text-dark-400">Overview of blog performance and statistics</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-bold text-dark-50">{totalUsers}</span>
          </div>
          <p className="text-dark-400 text-sm">Registered Users</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-primary-400" />
            <div className="text-right">
              <span className="text-3xl font-bold text-dark-50">{allPosts.length}</span>
              <span className="text-xs text-dark-400 block">{publishedPosts.length} Published</span>
            </div>
          </div>
          <p className="text-dark-400 text-sm">Total Posts</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-green-400" />
            <span className="text-3xl font-bold text-dark-50">{totalViews.toLocaleString()}</span>
          </div>
          <p className="text-dark-400 text-sm">Total Content Views</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-yellow-400" />
            <span className="text-3xl font-bold text-dark-50">{pendingComments}</span>
          </div>
          <p className="text-dark-400 text-sm">Pending Moderation</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-dark-50 mb-4">Ad Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg"><Megaphone className="w-6 h-6 text-indigo-400" /></div>
            <div><p className="text-dark-400 text-sm">Active Ads</p><div className="text-2xl font-bold text-dark-50">{activeAds}</div></div>
          </div>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg"><Eye className="w-6 h-6 text-purple-400" /></div>
            <div><p className="text-dark-400 text-sm">Total Impressions</p><div className="text-2xl font-bold text-dark-50">{totalImpressions.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-lg"><MousePointerClick className="w-6 h-6 text-pink-400" /></div>
            <div><p className="text-dark-400 text-sm">Total Clicks</p><div className="text-2xl font-bold text-dark-50">{totalClicks.toLocaleString()}</div></div>
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-dark-50">Top Performing Content</h2>
        </div>
        <div className="space-y-3">
          {topPosts.length > 0 ? topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-primary-400 font-bold w-6">{index + 1}</span>
                <span className="text-dark-200 truncate max-w-[200px] md:max-w-md">{post.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-dark-400">
                <span>{post.views_count} views</span>
                <span className="hidden md:inline">{post.likes_count} likes</span>
              </div>
            </div>
          )) : (
            <div className="text-dark-400 text-center py-4">No posts yet. Create your first post!</div>
          )}
        </div>
      </div>
    </div>
  )
}
