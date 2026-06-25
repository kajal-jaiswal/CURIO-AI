import { ExternalLink, TrendingUp } from 'lucide-react'

interface NewsItem {
  title: string
  link: string
  source: string
  date?: string
}

async function getTrendingNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(baseUrl + '/api/trending', {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function TrendingNewsSidebar() {
  const news = await getTrendingNews()

  if (news.length === 0) return null

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary-400" />
        <h3 className="font-semibold text-dark-100 text-sm">Trending in Tech</h3>
      </div>
      <div className="space-y-3">
        {news.slice(0, 5).map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-start gap-2">
              <span className="text-primary-400 font-bold text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
              <div>
                <p className="text-dark-300 text-xs leading-snug group-hover:text-primary-400 transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-dark-600 text-xs">{item.source}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-dark-600" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
