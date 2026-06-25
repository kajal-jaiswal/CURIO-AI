import { db } from '@/lib/db'
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_TAGS } from './mock-data'
import type { Post, Category, Tag, Comment } from '@/lib/types'

// Convert Prisma post row → TypeScript Post type
function serializePost(raw: any): Post {
  let tags: string[] = []
  try {
    tags = JSON.parse(raw.tags || '[]')
  } catch {}

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    content_md: raw.content_md,
    cover_image_url: raw.cover_image_url,
    category_id: raw.category_id,
    tags,
    author_id: raw.author_id,
    author_name: raw.author_name,
    created_at: raw.created_at instanceof Date ? raw.created_at.toISOString() : raw.created_at,
    updated_at: raw.updated_at instanceof Date ? raw.updated_at.toISOString() : raw.updated_at,
    published_at: raw.published_at instanceof Date ? raw.published_at.toISOString() : raw.published_at,
    meta_title: raw.meta_title,
    meta_description: raw.meta_description,
    focus_keyword: raw.focus_keyword,
    status: raw.status as Post['status'],
    views_count: raw.views_count,
    likes_count: raw.likes_count,
    comments_count: raw.comments_count,
    is_featured: raw.is_featured,
    category: raw.category ?? undefined,
  }
}

function serializeCategory(raw: any): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
  }
}

function serializeTag(raw: any): Tag {
  return { id: raw.id, name: raw.name, slug: raw.slug }
}

export async function getPosts(options?: {
  limit?: number
  offset?: number
  category?: string
  tag?: string
  search?: string
  sort?: 'latest' | 'popular'
  status?: 'draft' | 'published' | 'archived'
}): Promise<Post[]> {
  try {
    const where: any = {}

    if (options?.status && options.status !== ('all' as any)) {
      where.status = options.status
    } else if (!options?.status) {
      where.status = 'published'
    }
    // if status === 'all', no filter — admin use case

    if (options?.category) {
      where.category_id = options.category
    }

    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { excerpt: { contains: options.search } },
      ]
    }

    // SQLite JSON array search: check if tags string contains the tag value
    if (options?.tag) {
      where.tags = { contains: options.tag }
    }

    const posts = await db.post.findMany({
      where,
      include: { category: true },
      orderBy: options?.sort === 'popular'
        ? { views_count: 'desc' }
        : { created_at: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    })

    return posts.map(serializePost)
  } catch (err) {
    console.warn('DB fetch failed, using mock data:', err)
    let posts = [...MOCK_POSTS]

    if (options?.status && options.status !== ('all' as any)) {
      posts = posts.filter(p => p.status === options.status)
    } else if (!options?.status) {
      posts = posts.filter(p => p.status === 'published')
    }

    if (options?.category) posts = posts.filter(p => p.category_id === options.category)

    if (options?.search) {
      const q = options.search.toLowerCase()
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q)
      )
    }

    if (options?.tag) {
      posts = posts.filter(p => Array.isArray(p.tags) && p.tags.includes(options.tag!))
    }

    if (options?.sort === 'popular') {
      posts.sort((a, b) => b.views_count - a.views_count)
    } else {
      posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    if (options?.offset) posts = posts.slice(options.offset)
    if (options?.limit) posts = posts.slice(0, options.limit)

    return posts
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await db.post.findFirst({
      where: { slug, status: 'published' },
      include: { category: true },
    })
    return post ? serializePost(post) : null
  } catch {
    return MOCK_POSTS.find(p => p.slug === slug) || null
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: { category: true },
    })
    return post ? serializePost(post) : null
  } catch {
    return MOCK_POSTS.find(p => p.id === id) || null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const cats = await db.category.findMany({ orderBy: { name: 'asc' } })
    return cats.map(serializeCategory)
  } catch {
    return MOCK_CATEGORIES
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const cat = await db.category.findUnique({ where: { slug } })
    return cat ? serializeCategory(cat) : null
  } catch {
    return MOCK_CATEGORIES.find(c => c.slug === slug) || null
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const tags = await db.tag.findMany({ orderBy: { name: 'asc' } })
    return tags.map(serializeTag)
  } catch {
    return MOCK_TAGS
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const tag = await db.tag.findUnique({ where: { slug } })
    return tag ? serializeTag(tag) : null
  } catch {
    return MOCK_TAGS.find(t => t.slug === slug) || null
  }
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  _tags: string[],
  limit: number = 3
): Promise<Post[]> {
  try {
    const posts = await db.post.findMany({
      where: {
        status: 'published',
        id: { not: postId },
        ...(categoryId ? { category_id: categoryId } : {}),
      },
      include: { category: true },
      take: limit,
    })
    return posts.map(serializePost)
  } catch {
    return MOCK_POSTS.filter(p => p.id !== postId).slice(0, limit)
  }
}

export async function getPopularPosts(limit: number = 5): Promise<Post[]> {
  try {
    const posts = await db.post.findMany({
      where: { status: 'published' },
      include: { category: true },
      orderBy: { views_count: 'desc' },
      take: limit,
    })
    return posts.map(serializePost)
  } catch {
    return [...MOCK_POSTS].sort((a, b) => b.views_count - a.views_count).slice(0, limit)
  }
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  try {
    const comments = await db.comment.findMany({
      where: { post_id: postId, status: 'approved' },
      orderBy: { created_at: 'desc' },
    })
    return comments.map(c => ({
      id: c.id,
      post_id: c.post_id,
      user_id: c.user_id,
      parent_id: c.parent_id,
      name: c.name,
      email: c.email,
      message: c.message,
      created_at: c.created_at instanceof Date ? c.created_at.toISOString() : c.created_at,
      updated_at: c.updated_at instanceof Date ? c.updated_at.toISOString() : c.updated_at,
      status: c.status as Comment['status'],
    }))
  } catch {
    return []
  }
}

export async function incrementPostViews(
  postId: string,
  ipHash: string,
  userAgent: string | null
) {
  // Non-blocking — runs in background
  ;(async () => {
    try {
      await db.pageView.create({
        data: { post_id: postId, ip_hash: ipHash, user_agent: userAgent },
      })
      await db.post.update({
        where: { id: postId },
        data: { views_count: { increment: 1 } },
      })
    } catch {
      // Silently swallow — analytics must not affect page rendering
    }
  })()
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await db.post.findMany({
      where: { status: 'published' },
      select: { slug: true },
    })
    return posts.map(p => p.slug)
  } catch {
    return []
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const cats = await db.category.findMany({ select: { slug: true } })
    return cats.map(c => c.slug)
  } catch {
    return []
  }
}

export async function getAllTagSlugs(): Promise<string[]> {
  try {
    const tags = await db.tag.findMany({ select: { slug: true } })
    return tags.map(t => t.slug)
  } catch {
    return []
  }
}

const STOPWORDS = new Set([
  'the','a','an','and','or','for','in','on','at','to','of','is','are',
  'was','how','why','what','when','will','with','that','this','from',
  'about','new','top','best','using','use','your','our','its','has',
  'into','can','more','most','some','been','have','had','not','than',
])

function topicKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w))
}

// Returns true if a post covering a very similar topic already exists in the DB.
// Matches when 2+ significant keywords overlap with an existing post title.
export async function isTopicDuplicate(topic: string): Promise<boolean> {
  try {
    const keywords = topicKeywords(topic)
    if (keywords.length === 0) return false

    const posts = await db.post.findMany({ select: { title: true } })

    for (const post of posts) {
      const postKeywords = topicKeywords(post.title)
      let matches = 0
      for (const kw of keywords) {
        if (postKeywords.some(pk => pk === kw || pk.startsWith(kw) || kw.startsWith(pk))) {
          matches++
          if (matches >= 2) return true
        }
      }
    }
    return false
  } catch {
    return false
  }
}
