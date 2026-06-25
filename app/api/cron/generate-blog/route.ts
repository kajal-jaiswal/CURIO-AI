import { NextRequest, NextResponse } from 'next/server'
import { fetchTrendingNews } from '@/lib/news-service'
import { generateBlogPost } from '@/lib/ai-service'
import { isTopicDuplicate } from '@/lib/queries'
import { slugify } from '@/lib/utils'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // Fetch articles interleaved across all categories
    const articles = await fetchTrendingNews(30)

    if (articles.length === 0) {
      return NextResponse.json({ message: 'No news found' })
    }

    let createdCount = 0
    const errors: { title: string; error: string }[] = []
    const skipped: string[] = []
    const maxPosts = 5
    const usedCategories = new Set<string>()

    for (const article of articles) {
      if (createdCount >= maxPosts) break
      if (!article.title?.trim()) continue

      // Skip if same category already covered this run (enforce diversity)
      if (usedCategories.has(article.category)) continue

      // Slug pre-check
      const candidateSlug = slugify(article.title)
      const slugExists = await db.post.findUnique({ where: { slug: candidateSlug }, select: { id: true } })
      if (slugExists) {
        skipped.push(article.title)
        continue
      }

      // Semantic duplicate check
      const alreadyCovered = await isTopicDuplicate(article.title)
      if (alreadyCovered) {
        skipped.push(article.title)
        continue
      }

      const generatedPost = await generateBlogPost({
        topic: article.title,
        category: article.category,
        tone: 'Professional yet engaging',
        keywords: article.contentSnippet || article.content || '',
        audience: 'Small business owners and professionals',
        wordCount: 1200,
        language: 'English',
      })

      if (!generatedPost.success) {
        errors.push({ title: article.title, error: generatedPost.error || 'Generation failed' })
        continue
      }

      // Final slug dedup
      const existing = await db.post.findUnique({ where: { slug: generatedPost.slug }, select: { id: true } })
      if (existing) {
        skipped.push(article.title)
        continue
      }

      const imagePrompt = encodeURIComponent(
        `${generatedPost.title} ${article.category || 'tech'} minimal blog illustration`
      )
      const coverImageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?nologo=true&private=true&enhance=false&width=800&height=450`

      const catSlug = article.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      let categoryId: string | null = null
      const cat = await db.category.findFirst({
        where: { OR: [{ slug: catSlug }, { name: { contains: article.category } }] },
        select: { id: true },
      })
      categoryId = cat?.id ?? null

      try {
        await db.post.create({
          data: {
            title: generatedPost.title,
            slug: generatedPost.slug,
            excerpt: generatedPost.excerpt,
            content_md: generatedPost.content_md,
            cover_image_url: coverImageUrl,
            tags: JSON.stringify(generatedPost.tags || []),
            meta_title: generatedPost.meta_title,
            meta_description: generatedPost.meta_description,
            status: 'published',
            category_id: categoryId,
            author_name: 'Curio AI Bot',
            published_at: new Date(),
          },
        })
        createdCount++
        usedCategories.add(article.category)
      } catch (err: any) {
        errors.push({ title: generatedPost.title, error: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      count: createdCount,
      skipped: skipped.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
