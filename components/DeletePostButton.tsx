'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/app/actions/posts'
import toast from 'react-hot-toast'

interface DeletePostButtonProps {
  postId: string
  postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) return

    setLoading(true)
    try {
      await deletePost(postId)
      toast.success('Post deleted successfully')
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
      className="text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
