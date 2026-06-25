import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Zap, Bot, Clock, CheckCircle } from 'lucide-react'
import { AutomationClient } from '@/components/AutomationClient'

export const dynamic = 'force-dynamic'

export default async function AutomationPage() {
  // Get the 10 most recent AI-generated posts
  const aiBotPosts = await db.post.findMany({
    where: { author_name: 'Curio AI Bot' },
    orderBy: { created_at: 'desc' },
    take: 10,
    select: { id: true, title: true, status: true, created_at: true, views_count: true, cover_image_url: true },
  })

  const totalAiPosts = await db.post.count({ where: { author_name: 'Curio AI Bot' } })

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Bot className="w-7 h-7 text-primary-400" />
        <h1 className="text-3xl font-bold text-dark-50">AI Automation</h1>
      </div>
      <p className="text-dark-400 mb-8">Auto-generate blog posts from trending tech news</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">AI Posts Generated</p>
              <p className="text-3xl font-bold text-primary-400 mt-1">{totalAiPosts}</p>
            </div>
            <Bot className="w-10 h-10 text-primary-400/20" />
          </div>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Auto Schedule</p>
              <p className="text-lg font-bold text-dark-100 mt-1">Every 6 hours</p>
            </div>
            <Clock className="w-10 h-10 text-dark-600" />
          </div>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-400 font-bold">Active</p>
              </div>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400/20" />
          </div>
        </div>
      </div>

      <AutomationClient />

      <div className="mt-8 bg-dark-900 border border-dark-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark-50 mb-4">Recently Generated Posts</h2>
        <div className="space-y-3">
          {aiBotPosts.length === 0 ? (
            <p className="text-dark-500 text-center py-8">No AI-generated posts yet. Click "Run Now" to generate content.</p>
          ) : aiBotPosts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-dark-100 text-sm font-medium truncate">{post.title}</p>
                <p className="text-dark-500 text-xs">{formatDate(post.created_at.toISOString())} · {post.views_count} views</p>
              </div>
              <span className={"ml-3 px-2 py-0.5 rounded-full text-xs font-medium " +
                (post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400')}>
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
