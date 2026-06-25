'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/app/actions/posts'
import toast from 'react-hot-toast'

interface DeleteAuthorPostButtonProps {
  postId: string
  postTitle: string
}

export function DeleteAuthorPostButton({ postId, postTitle }: DeleteAuthorPostButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This cannot be undone.`)) return

    setLoading(true)
    try {
      await deletePost(postId)
      toast.success('Post deleted')
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-dark-800 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
