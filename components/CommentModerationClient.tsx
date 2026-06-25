'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface CommentItem {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  post_title: string
  post_slug: string
}

export function CommentModerationClient({ comments: initial }: { comments: CommentItem[] }) {
  const [comments, setComments] = useState(initial)

  const handle = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/moderator/comments/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })
      if (!res.ok) throw new Error()
      setComments(c => c.filter(x => x.id !== id))
      toast.success(action === 'approved' ? 'Comment approved' : 'Comment rejected')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const del = async (id: string) => {
    try {
      await fetch('/api/moderator/comments/' + id, { method: 'DELETE' })
      setComments(c => c.filter(x => x.id !== id))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-20 bg-dark-900 rounded-xl border border-dark-800">
        <CheckCircle className="w-12 h-12 text-green-400/40 mx-auto mb-3" />
        <p className="text-dark-300 font-medium">All caught up!</p>
        <p className="text-dark-500 text-sm">No pending comments to review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map(c => (
        <div key={c.id} className="bg-dark-900 border border-dark-800 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-dark-100">{c.name}</span>
                <span className="text-dark-500 text-xs">{c.email}</span>
                <span className="text-dark-600">·</span>
                <span className="text-dark-500 text-xs">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-dark-300 text-sm mb-2">{c.message}</p>
              <p className="text-xs text-dark-500">
                On: <Link href={"/blog/" + c.post_slug} className="text-primary-400 hover:underline">{c.post_title}</Link>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handle(c.id, 'approved')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handle(c.id, 'rejected')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => del(c.id)}
                className="p-1.5 bg-dark-800 hover:bg-dark-700 text-dark-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
