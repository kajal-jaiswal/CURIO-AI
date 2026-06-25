import { db } from '@/lib/db'
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ModeratorDashboard() {
  const [pending, approved, rejected, recentComments] = await Promise.all([
    db.comment.count({ where: { status: 'pending' } }),
    db.comment.count({ where: { status: 'approved' } }),
    db.comment.count({ where: { status: 'rejected' } }),
    db.comment.findMany({
      where: { status: 'pending' },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-2">Moderator Dashboard</h1>
      <p className="text-dark-400 mb-8">Review and manage user content</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-900 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-400/30" />
          </div>
        </div>
        <div className="bg-dark-900 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{approved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400/30" />
          </div>
        </div>
        <div className="bg-dark-900 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{rejected}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-400/30" />
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-50">Recent Pending Comments</h2>
          <Link href="/moderator/comments" className="text-primary-400 hover:text-primary-300 text-sm">View All</Link>
        </div>
        {recentComments.length === 0 ? (
          <p className="text-dark-500 text-center py-8">No pending comments</p>
        ) : (
          <div className="space-y-3">
            {recentComments.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 bg-dark-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 text-sm font-bold flex-shrink-0">
                  {c.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-dark-200 font-medium text-sm">{c.name}</span>
                    <span className="text-dark-500 text-xs">on</span>
                    <Link href={"/blog/" + c.post.slug} className="text-primary-400 text-xs hover:underline truncate">{c.post.title}</Link>
                  </div>
                  <p className="text-dark-400 text-sm line-clamp-2">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
