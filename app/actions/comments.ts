'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function submitComment(data: {
  postId: string
  name: string
  email: string
  message: string
}) {
  if (!data.name || !data.email || !data.message) {
    return { success: false, error: 'All fields are required' }
  }

  if (!data.email.includes('@')) {
    return { success: false, error: 'Invalid email address' }
  }

  try {
    await db.comment.create({
      data: {
        post_id: data.postId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim(),
        status: 'pending',
      },
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to submit comment' }
  }
}

export async function approveComment(commentId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') throw new Error('Admin only')

  const comment = await db.comment.update({
    where: { id: commentId },
    data: { status: 'approved' },
  })

  await db.post.update({
    where: { id: comment.post_id },
    data: { comments_count: { increment: 1 } },
  })

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function rejectComment(commentId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') throw new Error('Admin only')

  await db.comment.update({
    where: { id: commentId },
    data: { status: 'rejected' },
  })

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Not authenticated')

  const comment = await db.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new Error('Comment not found')

  if (session.user.role !== 'admin') throw new Error('Admin only')

  await db.comment.delete({ where: { id: commentId } })

  revalidatePath('/admin/comments')
  return { success: true }
}
