import { createClient } from '@/lib/supabase/server'
import { FileText, Eye, MessageSquare, TrendingUp } from 'lucide-react'
import { getPosts } from '@/lib/queries'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [allPosts, publishedPosts] = await Promise.all([
    getPosts({ status: undefined, limit: 1000 }),
    getPosts({ status: 'published', limit: 1000 }),
  ])

  const totalViews = allPosts.reduce((sum, post) => sum + post.views_count, 0)
  const topPosts = [...allPosts].sort((a, b) => b.views_count - a.views_count).slice(0, 5)

  // Get pending comments count
  const { count: pendingComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-primary-400" />
            <span className="text-3xl font-bold text-dark-50">{allPosts.length}</span>
          </div>
          <p className="text-dark-400 text-sm">Total Posts</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-primary-400" />
            <span className="text-3xl font-bold text-dark-50">{totalViews.toLocaleString()}</span>
          </div>
          <p className="text-dark-400 text-sm">Total Views</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-green-400" />
            <span className="text-3xl font-bold text-dark-50">{publishedPosts.length}</span>
          </div>
          <p className="text-dark-400 text-sm">Published</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-yellow-400" />
            <span className="text-3xl font-bold text-dark-50">{pendingComments || 0}</span>
          </div>
          <p className="text-dark-400 text-sm">Pending Comments</p>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-dark-50">Top Posts</h2>
        </div>
        <div className="space-y-3">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-primary-400 font-bold w-6">{index + 1}</span>
                <span className="text-dark-200">{post.title}</span>
              </div>
              <span className="text-dark-400 text-sm">{post.views_count} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
