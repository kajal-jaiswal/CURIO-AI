import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Post, Category, Tag, Comment } from '@/lib/types'

import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_TAGS } from './mock-data'

export async function getPosts(options?: {
  limit?: number
  offset?: number
  category?: string
  tag?: string
  search?: string
  sort?: 'latest' | 'popular'
  status?: 'draft' | 'published'
}) {
  try {
    const supabase = await createClient()
    // Check if we are connected to a real instance (simple check)
    // If URL is placeholder, throw immediately to use mock
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      throw new Error('Using placeholder')
    }

    let query = supabase
      .from('posts')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    } else {
      query = query.eq('status', 'published')
    }

    if (options?.category) {
      query = query.eq('category_id', options.category)
    }

    if (options?.sort === 'popular') {
      query = query.order('views_count', { ascending: false })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as Post[]
  } catch (err) {
    console.warn('Supabase fetch failed (using mock data):', err)
    // MOCK DATA FALLBACK
    let posts = [...MOCK_POSTS]

    if (options?.category) {
      posts = posts.filter(p => p.category_id === options.category)
    }

    if (options?.sort === 'popular') {
      posts.sort((a, b) => b.views_count - a.views_count)
    } else {
      // Latest
      posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    if (options?.limit) {
      posts = posts.slice(0, options.limit)
    }

    return posts
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = await createClient()
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) throw new Error('Using placeholder')

    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) throw error
    return data as Post
  } catch (err) {
    const post = MOCK_POSTS.find(p => p.slug === slug)
    return post || null
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient()
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) throw new Error('Using placeholder')

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return (data || []) as Category[]
  } catch (err) {
    return MOCK_CATEGORIES
  }
}

export async function getCategoryBySlug(slug: string) {
  // Basic implementation for slug
  // ...
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
  return cat || null
}

export async function getTags() {
  return MOCK_TAGS
}

export async function getTagBySlug(slug: string) {
  return MOCK_TAGS.find(t => t.slug === slug) || null
}

export async function getRelatedPosts(postId: string, categoryId: string | null, tags: string[], limit: number = 3) {
  try {
    const supabase = await createClient()
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) throw new Error('Using placeholder')
    // ... existing logic ...
    const { data } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .neq('id', postId)
      .limit(limit)

    return (data || []) as Post[]
  } catch (err) {
    return MOCK_POSTS.filter(p => p.id !== postId).slice(0, limit)
  }
}

export async function getPopularPosts(limit: number = 5) {
  try {
    const supabase = await createClient()
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) throw new Error('Using placeholder')

    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .order('views_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Post[]
  } catch (err) {
    return [...MOCK_POSTS].sort((a, b) => b.views_count - a.views_count).slice(0, limit)
  }
}

export async function getPostComments(postId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return (data || []) as Comment[]
}

export async function incrementPostViews(postId: string, ipHash: string, userAgent: string | null) {
  try {
    const adminClient = createAdminClient()

    // Record page view
    adminClient.from('page_views').insert({
      post_id: postId,
      ip_hash: ipHash,
      user_agent: userAgent,
    }).then(() => { })

    // Increment views count
    adminClient.rpc('increment_post_views', { post_id: postId }).then(() => { })
  } catch (error) {
    // Silently fail - don't block page rendering
  }
}

export async function getAllPostSlugs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    return []
  }

  return (data || []).map((post) => post.slug)
}

export async function getAllCategorySlugs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('slug')

  if (error) {
    return []
  }

  return (data || []).map((cat) => cat.slug)
}

export async function getAllTagSlugs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('slug')

  if (error) {
    return []
  }

  return (data || []).map((tag) => tag.slug)
}
