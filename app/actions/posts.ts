'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function requireAuth(session: any) {
  if (!session?.user) throw new Error('Not authenticated')
  return session.user
}

export async function createPost(data: {
  title: string
  slug: string
  excerpt: string
  content_md: string
  cover_image_url?: string
  category_id?: string
  tags?: string[]
  meta_title?: string
  meta_description?: string
  focus_keyword?: string
  status: 'draft' | 'published' | 'archived'
  is_featured?: boolean
}) {
  const session = await getServerSession(authOptions)
  const user = requireAuth(session)

  if (!['admin', 'author'].includes(user.role)) {
    throw new Error('Only authors and admins can create posts')
  }

  const post = await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_md: data.content_md,
      cover_image_url: data.cover_image_url ?? null,
      category_id: data.category_id ?? null,
      tags: JSON.stringify(data.tags ?? []),
      author_id: user.id,
      author_name: user.name || user.email,
      meta_title: data.meta_title ?? null,
      meta_description: data.meta_description ?? null,
      focus_keyword: data.focus_keyword ?? null,
      status: data.status,
      is_featured: data.is_featured ?? false,
      published_at: data.status === 'published' ? new Date() : null,
    },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/author/posts')
  revalidatePath('/')

  return { success: true, postId: post.id, slug: post.slug }
}

export async function updatePost(
  postId: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string
    content_md?: string
    cover_image_url?: string | null
    category_id?: string | null
    tags?: string[]
    meta_title?: string | null
    meta_description?: string | null
    focus_keyword?: string | null
    status?: 'draft' | 'published' | 'archived'
    is_featured?: boolean
  }
) {
  const session = await getServerSession(authOptions)
  const user = requireAuth(session)

  const existing = await db.post.findUnique({ where: { id: postId } })
  if (!existing) throw new Error('Post not found')

  // Authors can only edit their own posts; admins can edit any
  if (user.role !== 'admin' && existing.author_id !== user.id) {
    throw new Error('Not authorized to edit this post')
  }

  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content_md !== undefined && { content_md: data.content_md }),
      ...(data.cover_image_url !== undefined && { cover_image_url: data.cover_image_url }),
      ...(data.category_id !== undefined && { category_id: data.category_id }),
      ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
      ...(data.meta_title !== undefined && { meta_title: data.meta_title }),
      ...(data.meta_description !== undefined && { meta_description: data.meta_description }),
      ...(data.focus_keyword !== undefined && { focus_keyword: data.focus_keyword }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.is_featured !== undefined && { is_featured: data.is_featured }),
      ...(data.status === 'published' && !existing.published_at && { published_at: new Date() }),
    },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/author/posts')
  revalidatePath(`/blog/${updatedPost.slug}`)
  revalidatePath('/')

  return { success: true }
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions)
  const user = requireAuth(session)

  const existing = await db.post.findUnique({ where: { id: postId } })
  if (!existing) throw new Error('Post not found')

  if (user.role !== 'admin' && existing.author_id !== user.id) {
    throw new Error('Not authorized to delete this post')
  }

  await db.post.delete({ where: { id: postId } })

  revalidatePath('/admin/posts')
  revalidatePath('/author/posts')
  revalidatePath('/')

  return { success: true }
}

export async function toggleFeatured(postId: string, isFeatured: boolean) {
  const session = await getServerSession(authOptions)
  const user = requireAuth(session)
  if (user.role !== 'admin') throw new Error('Admin only')

  await db.post.update({
    where: { id: postId },
    data: { is_featured: isFeatured },
  })

  revalidatePath('/')
  revalidatePath('/admin/posts')

  return { success: true }
}
