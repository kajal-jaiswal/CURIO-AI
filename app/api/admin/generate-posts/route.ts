import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateBlogPost } from '@/lib/ai-service'
import { fetchTrendingNews, fetchNewsByCategory, GENERATION_CATEGORIES } from '@/lib/news-service'
import { db } from '@/lib/db'
import { isTopicDuplicate } from '@/lib/queries'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const {
    topics,
    count = 3,
    useNews = true,
    tone = 'Professional yet engaging',
    category = '',
    audience = 'Small business owners and professionals',
    wordCount = 1200,
    language = 'English',
  } = body

  const maxCount = Math.min(Math.max(1, count), 10)
  const created: { title: string; slug: string; category: string }[] = []
  const errors: { topic: string; error: string }[] = []
  const skipped: string[] = []

  interface WorkItem {
    topic: string
    category: string
    context?: string
  }

  let workItems: WorkItem[] = []

  if (topics && Array.isArray(topics) && topics.length > 0) {
    // Custom topics — assign categories round-robin for diversity
    const topicList: string[] = topics.map((t: string) => t.trim()).filter(Boolean).slice(0, maxCount)
    workItems = topicList.map((topic, i) => ({
      topic,
      category: category || GENERATION_CATEGORIES[i % GENERATION_CATEGORIES.length],
    }))
  } else if (useNews) {
    // Fetch news spread across all categories, interleaved
    const articles = await fetchTrendingNews(maxCount * 4)
    // Pick one per category slot up to maxCount
    const usedCategories = new Set<string>()
    const diverse: typeof articles = []
    // First pass — one per category
    for (const a of articles) {
      if (diverse.length >= maxCount) break
      if (!usedCategories.has(a.category)) {
        diverse.push(a)
        usedCategories.add(a.category)
      }
    }
    // Second pass — fill remaining slots with any unused article
    for (const a of articles) {
      if (diverse.length >= maxCount) break
      if (!diverse.includes(a)) diverse.push(a)
    }
    workItems = diverse.map(a => ({
      topic: a.title,
      category: a.category,
      context: a.contentSnippet || a.content || '',
    }))
  }

  if (workItems.length === 0) {
    return NextResponse.json({ error: 'No topics provided and no news found' }, { status: 400 })
  }

  for (const item of workItems) {
    if (created.length >= maxCount) break

    try {
      // --- Duplicate guard: slug check ---
      const candidateSlug = slugify(item.topic)
      const slugExists = await db.post.findUnique({ where: { slug: candidateSlug }, select: { id: true } })
      if (slugExists) {
        skipped.push(item.topic)
        continue
      }

      // --- Duplicate guard: semantic title similarity ---
      const topicAlreadyCovered = await isTopicDuplicate(item.topic)
      if (topicAlreadyCovered) {
        skipped.push(item.topic)
        continue
      }

      const generated = await generateBlogPost({
        topic: item.topic,
        tone,
        category: item.category,
        keywords: item.context,
        audience,
        wordCount,
        language,
      })

      if (!generated.success) {
        errors.push({ topic: item.topic, error: generated.error || 'Generation failed' })
        continue
      }
      if (!generated.title) {
        errors.push({ topic: item.topic, error: 'Empty title returned' })
        continue
      }

      // Final slug dedup (generated slug may differ from topic slug)
      const existing = await db.post.findUnique({ where: { slug: generated.slug }, select: { id: true } })
      if (existing) {
        skipped.push(item.topic)
        continue
      }

      // Generate cover image via Pollinations
      const imagePrompt = encodeURIComponent(
        `${generated.title} ${item.category || 'technology'} minimal blog cover illustration`
      )
      const coverImageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?nologo=true&private=true&enhance=false&width=800&height=450`

      // Resolve category from DB
      const catSlug = (item.category || generated.category_slug || 'technology')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

      let categoryId: string | null = null
      const cat = await db.category.findFirst({
        where: { OR: [{ slug: catSlug }, { name: { contains: item.category } }] },
        select: { id: true },
      })
      categoryId = cat?.id ?? null

      const post = await db.post.create({
        data: {
          title: generated.title,
          slug: generated.slug,
          excerpt: generated.excerpt,
          content_md: generated.content_md,
          cover_image_url: coverImageUrl,
          tags: JSON.stringify(generated.tags || []),
          meta_title: generated.meta_title,
          meta_description: generated.meta_description,
          status: 'published',
          category_id: categoryId,
          author_name: 'Curio AI Bot',
          published_at: new Date(),
        },
      })

      created.push({ title: post.title, slug: post.slug, category: item.category })
    } catch (err: any) {
      errors.push({ topic: item.topic, error: err.message })
    }
  }

  return NextResponse.json({
    success: true,
    count: created.length,
    created,
    skipped,
    errors,
  })
}
