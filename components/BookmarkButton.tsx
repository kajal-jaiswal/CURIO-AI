'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface BookmarkButtonProps {
  postId: string
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { data: session } = useSession()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch('/api/posts/' + postId + '/bookmark')
      .then(r => r.json())
      .then(data => setBookmarked(data.bookmarked))
  }, [postId, session?.user?.id])

  const toggle = async () => {
    if (!session?.user?.id) {
      toast.error('Please login to bookmark posts')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/posts/' + postId + '/bookmark', { method: 'POST' })
      const data = await res.json()
      setBookmarked(data.bookmarked)
      toast.success(data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch {
      toast.error('Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Save for later'}
      className={"flex items-center gap-2 px-4 py-2 rounded-xl border transition-all " +
        (bookmarked
          ? "bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20"
          : "bg-dark-800 border-dark-700 text-dark-400 hover:border-primary-500/30 hover:text-primary-400")
      }
    >
      <Bookmark className={"w-4 h-4 " + (bookmarked ? "fill-primary-400" : "")} />
      <span className="text-sm font-medium">{bookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}
