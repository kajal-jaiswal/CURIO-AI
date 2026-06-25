'use client'

import { useState } from 'react'
import { CheckCircle, Eye, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface PostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  created_at: string
  status: string
}

export function PostApprovalClient({ posts: initial }: { posts: PostItem[] }) {
  const [posts, setPosts] = useState(initial)

  const publish = async (id: string) => {
    try {
      const res = await fetch('/api/admin/posts/' + id + '/publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error()
      setPosts(p => p.filter(x => x.id !== id))
      toast.success('Post published!')
    } catch {
      toast.error('Failed to publish post')
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-dark-900 rounded-xl border border-dark-800">
        <CheckCircle className="w-12 h-12 text-green-400/40 mx-auto mb-3" />
        <p className="text-dark-300 font-medium">Queue is empty</p>
        <p className="text-dark-500 text-sm">No posts waiting for review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(p => (
        <div key={p.id} className="bg-dark-900 border border-dark-800 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-dark-50 mb-1 line-clamp-2">{p.title}</h3>
              <p className="text-dark-400 text-sm line-clamp-2 mb-2">{p.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-dark-500">
                <span>By {p.author}</span>
                <span>{formatDate(p.created_at)}</span>
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full capitalize">{p.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => publish(p.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Publish
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
