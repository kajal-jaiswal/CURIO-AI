'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface LikeButtonProps {
  postId: string
  initialCount?: number
}

export function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return
    fetch('/api/posts/' + postId + '/like')
      .then(r => r.json())
      .then(data => {
        setLiked(data.liked)
        setCount(data.count)
      })
  }, [postId, session?.user?.id])

  const toggle = async () => {
    if (!session?.user?.id) {
      toast.error('Please login to like posts')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/posts/' + postId + '/like', { method: 'POST' })
      const data = await res.json()
      setLiked(data.liked)
      setCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch {
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={"flex items-center gap-2 px-4 py-2 rounded-xl border transition-all " +
        (liked
          ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
          : "bg-dark-800 border-dark-700 text-dark-400 hover:border-red-500/30 hover:text-red-400")
      }
    >
      <Heart className={"w-4 h-4 " + (liked ? "fill-red-400" : "")} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
