import Parser from 'rss-parser'

export interface NewsArticle {
  title: string
  link: string
  pubDate: string
  contentSnippet?: string
  content?: string
  source: string
  category: string
}

// Feeds organized by category — each category has 1–3 feeds
const FEEDS_BY_CATEGORY: Record<string, string[]> = {
  'AI Tools': [
    'https://www.artificialintelligence-news.com/feed/',
    'https://www.zdnet.com/topic/artificial-intelligence/rss.xml',
  ],
  'Technology': [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://feeds.feedburner.com/oreilly/radar/atom',
  ],
  'Business': [
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://www.entrepreneur.com/latest.rss',
  ],
  'Healthcare': [
    'https://www.medicalnewstoday.com/rss/all',
    'https://www.healthline.com/rss/news',
  ],
  'Information': [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  ],
  'Crime': [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  ],
}

// The full category list in the order we'll try to fill slots
export const GENERATION_CATEGORIES = Object.keys(FEEDS_BY_CATEGORY)

async function fetchFeed(url: string, category: string): Promise<NewsArticle[]> {
  const parser = new Parser({ timeout: 8000 })
  try {
    const feed = await parser.parseURL(url)
    return feed.items.slice(0, 10).map(item => ({
      title: (item.title || '').trim(),
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: (item.contentSnippet || '').substring(0, 500),
      content: (item.content || '').substring(0, 1000),
      source: feed.title || 'Unknown',
      category,
    }))
  } catch {
    return []
  }
}

// Returns articles spread across all categories, sorted newest-first within each
export async function fetchTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
  // Fetch all categories in parallel
  const byCategory: Record<string, NewsArticle[]> = {}

  await Promise.all(
    Object.entries(FEEDS_BY_CATEGORY).map(async ([category, urls]) => {
      const results = await Promise.all(urls.map(url => fetchFeed(url, category)))
      const articles = results.flat().sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      // De-dupe by title within same category
      const seen = new Set<string>()
      byCategory[category] = articles.filter(a => {
        const key = normalizeTitle(a.title)
        if (seen.has(key) || !a.title) return false
        seen.add(key)
        return true
      })
    })
  )

  // Interleave: pick one from each category in rotation until we have `limit`
  const selected: NewsArticle[] = []
  const categories = GENERATION_CATEGORIES
  let round = 0

  while (selected.length < limit) {
    let addedThisRound = 0
    for (const cat of categories) {
      if (selected.length >= limit) break
      const article = byCategory[cat]?.[round]
      if (article) {
        selected.push(article)
        addedThisRound++
      }
    }
    if (addedThisRound === 0) break
    round++
  }

  return selected
}

// Returns articles for a single specific category
export async function fetchNewsByCategory(category: string, limit: number = 5): Promise<NewsArticle[]> {
  const urls = FEEDS_BY_CATEGORY[category] || []
  if (urls.length === 0) return []
  const results = await Promise.all(urls.map(url => fetchFeed(url, category)))
  return results.flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit)
}

export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}
