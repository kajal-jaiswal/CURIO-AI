
import Parser from 'rss-parser';

export interface NewsArticle {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    content?: string;
    source: string;
}

// List of high-quality tech RSS feeds
const RSS_FEEDS = [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://www.artificialintelligence-news.com/feed',
];

export async function fetchTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
    const parser = new Parser();
    const allArticles: NewsArticle[] = [];

    try {
        // Fetch from all sources in parallel
        const feedPromises = RSS_FEEDS.map(async (url) => {
            try {
                const feed = await parser.parseURL(url);
                return feed.items.map((item) => ({
                    title: item.title || 'Untitled',
                    link: item.link || '',
                    pubDate: item.pubDate || new Date().toISOString(),
                    contentSnippet: item.contentSnippet || '',
                    content: item.content || '',
                    source: feed.title || 'Unknown Source',
                }));
            } catch (err) {
                console.error(`Error fetching RSS feed ${url}:`, err);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);

        // Flatten results
        results.forEach((items) => {
            allArticles.push(...items);
        });

        // Sort by date (newest first)
        allArticles.sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        // Return the top N articles
        return allArticles.slice(0, limit);

    } catch (error) {
        console.error('Error fetching trending news:', error);
        return [];
    }
}
