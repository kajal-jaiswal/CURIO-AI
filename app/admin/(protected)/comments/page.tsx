import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { ApproveCommentButton, DeleteCommentButton } from '@/components/CommentActions'

export const dynamic = 'force-dynamic'

export default async function AdminCommentsPage() {
  const commentsRaw = await db.comment.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      post: { select: { title: true, slug: true } },
    },
  })

  const comments = commentsRaw.map(c => ({
    ...c,
    created_at: c.created_at.toISOString(),
    updated_at: c.updated_at.toISOString(),
  }))

  const pendingComments = comments.filter(c => c.status === 'pending')
  const approvedComments = comments.filter(c => c.status === 'approved')

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-50 mb-8">Comments</h1>

      <div className="space-y-8">
        {pendingComments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-dark-50 mb-4">Pending ({pendingComments.length})</h2>
            <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
              <div className="divide-y divide-dark-800">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-dark-50">{comment.name}</span>
                          <span className="text-sm text-dark-400">{comment.email}</span>
                        </div>
                        <a href={`/blog/${comment.post?.slug}`} className="text-sm text-primary-400 hover:text-primary-300">
                          {comment.post?.title}
                        </a>
                      </div>
                      <span className="text-sm text-dark-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-dark-200 mb-4">{comment.message}</p>
                    <div className="flex gap-2">
                      <ApproveCommentButton commentId={comment.id} />
                      <DeleteCommentButton commentId={comment.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-dark-50 mb-4">Approved ({approvedComments.length})</h2>
          <div className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-dark-800">
              {approvedComments.length === 0 ? (
                <div className="p-6 text-dark-400">No approved comments yet.</div>
              ) : (
                approvedComments.map((comment) => (
                  <div key={comment.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-dark-50">{comment.name}</span>
                          <span className="text-sm text-dark-400">{comment.email}</span>
                        </div>
                        <a href={`/blog/${comment.post?.slug}`} className="text-sm text-primary-400 hover:text-primary-300">
                          {comment.post?.title}
                        </a>
                      </div>
                      <span className="text-sm text-dark-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-dark-200 mb-4">{comment.message}</p>
                    <DeleteCommentButton commentId={comment.id} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
