import { NextResponse } from 'next/server'
import { fetchTrendingNews } from '@/lib/news-service'

export const dynamic = 'force-dynamic'
export const revalidate = 1800 // 30 min cache

export async function GET() {
  try {
    const articles = await fetchTrendingNews(6)
    return NextResponse.json(articles.map(a => ({
      title: a.title,
      link: a.link,
      source: a.source || 'Tech News',
      date: a.pubDate,
    })))
  } catch {
    return NextResponse.json([])
  }
}
