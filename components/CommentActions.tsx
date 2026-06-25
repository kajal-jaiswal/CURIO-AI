'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { approveComment, deleteComment } from '@/app/actions/comments'
import toast from 'react-hot-toast'

interface CommentActionProps {
  commentId: string
}

export function ApproveCommentButton({ commentId }: CommentActionProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveComment(commentId)
      toast.success('Comment approved')
      router.refresh()
    } catch {
      toast.error('Failed to approve comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
    >
      <Check className="w-4 h-4" />
      Approve
    </button>
  )
}

export function DeleteCommentButton({ commentId }: CommentActionProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setLoading(true)
    try {
      await deleteComment(commentId)
      toast.success('Comment deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
    >
      <X className="w-4 h-4" />
      Delete
    </button>
  )
}
