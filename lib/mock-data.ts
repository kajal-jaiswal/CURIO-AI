import { Post, Category, Tag } from './types'

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'c1',
        name: 'Productivity Tools',
        slug: 'productivity-tools',
        description: 'AI tools to boost your productivity and efficiency',
    },
    {
        id: 'c2',
        name: 'Marketing',
        slug: 'marketing',
        description: 'AI-powered marketing tools and strategies',
    },
    {
        id: 'c3',
        name: 'Content Creation',
        slug: 'content-creation',
        description: 'Tools for creating content with AI',
    },
    {
        id: 'c4',
        name: 'Business Automation',
        slug: 'business-automation',
        description: 'Automate your business processes with AI',
    },
]

export const MOCK_TAGS: Tag[] = [
    { id: 't1', name: 'ChatGPT', slug: 'chatgpt' },
    { id: 't2', name: 'Free Tools', slug: 'free-tools' },
    { id: 't3', name: 'Small Business', slug: 'small-business' },
    { id: 't4', name: 'SEO', slug: 'seo' },
    { id: 't5', name: 'Copywriting', slug: 'copywriting' },
]

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        title: '10 Best AI Tools for Small Business Growth in 2024',
        slug: 'best-ai-tools-small-business-2024',
        excerpt: 'Discover the top AI tools that are revolutionizing how small businesses operate, from customer service to marketing automation.',
        content_md: `
# The Revolution of AI in Small Business

Small businesses are leveraging AI like never before. In 2024, the landscape has shifted from "nice to have" to "essential for survival".

## 1. ChatGPT for Customer Support
ChatGPT isn't just for writing funny poems. It's a powerhouse for:
- Drafting email responses
- Creating FAQ sections
- Analyzing customer sentiment

## 2. Jasper AI for Content Marketing
Writing blog posts consistently is hard. Jasper AI acts as your dedicated copywriter, helping you produce SEO-optimized content in minutes.

## 3. Otter.ai for Meetings
Never take meeting notes again. Otter.ai transcribes your Zoom and Teams calls automatically.

### Why Adoption Matters
Businesses that adopt AI report a **30% increase in operational efficiency**.

> "AI is the new electricity." - Andrew Ng

## Conclusion
Start small. Pick one tool this week and implement it.
    `,
        cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
        category_id: 'c1',
        category: MOCK_CATEGORIES[0],
        tags: ['t2', 't3'],
        author_id: 'author-1',
        author_name: 'Sarah Johnson',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        meta_title: '10 Best AI Tools for Small Business Growth in 2024 Review',
        meta_description: 'We reviewed the top 10 AI tools for small businesses in 2026. See which tools can save you time and money.',
        focus_keyword: 'AI tools small business',
        status: 'published',
        views_count: 1250,
        likes_count: 45,
        comments_count: 12,
        is_featured: true,
    },
    {
        id: 'p2',
        title: 'How to Automate Your Marketing with AI',
        slug: 'automate-marketing-ai-guide',
        excerpt: 'Detailed guide on setting up automated marketing funnels using the latest AI technology.',
        content_md: `# Marketing Automation Guide
    
Marketing automation is the holy grail of small business efficiency.

## The Stack
1. **Zapier** for connecting apps
2. **HubSpot** for CRM
3. **Midjourney** for visuals

## Step 1: Define Your Funnel
Don't automate a broken process. Map out your customer journey first.

## Step 2: Choose Your Tools
Select tools that integrate well together.

## Step 3: Test and Iterate
Start with one automation and expand gradually.
    `,
        cover_image_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=1200&h=630&fit=crop',
        category_id: 'c2',
        category: MOCK_CATEGORIES[1],
        tags: ['t1', 't4'],
        author_id: 'author-2',
        author_name: 'Michael Chen',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        published_at: new Date(Date.now() - 86400000).toISOString(),
        meta_title: 'Complete Guide to AI Marketing Automation',
        meta_description: 'Learn how to put your marketing on autopilot using AI tools.',
        focus_keyword: 'marketing automation',
        status: 'published',
        views_count: 890,
        likes_count: 32,
        comments_count: 8,
        is_featured: false,
    },
    {
        id: 'p3',
        title: 'Top Free AI Tools You Should Use Today',
        slug: 'top-free-ai-tools',
        excerpt: 'You do not need a big budget to use AI. Here are the best free tools available right now.',
        content_md: `# Free AI Tools
    
Budget is no longer a barrier.

## 1. Canva Magic Edit
Free image editing with AI.

## 2. ChatGPT (Free Tier)
Still the king of text generation.

## 3. Notion AI
Great for organizing thoughts.

## 4. Grammarly Free
Essential for error-free writing.

## 5. Perplexity AI
Free AI-powered search engine.
    `,
        cover_image_url: 'https://images.unsplash.com/photo-1655720031554-a929695a6761?w=1200&h=630&fit=crop',
        category_id: 'c1',
        category: MOCK_CATEGORIES[0],
        tags: ['t2'],
        author_id: 'author-1',
        author_name: 'Sarah Johnson',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        published_at: new Date(Date.now() - 172800000).toISOString(),
        meta_title: 'Best Free AI Tools 2024',
        meta_description: 'Save money with these incredible free AI tools for business.',
        focus_keyword: 'free ai tools',
        status: 'published',
        views_count: 2300,
        likes_count: 89,
        comments_count: 23,
        is_featured: true,
    },
    {
        id: 'p4',
        title: 'The Future of Content Creation with AI',
        slug: 'future-content-creation-ai',
        excerpt: 'Will AI replace writers? We analyze the trends and future of content creation.',
        content_md: `# The Future is Hybrid
    
AI won't replace writers, but writers who use AI will replace those who don't.

## The Current State
AI tools are getting better every day.

## What This Means for Creators
- Faster content production
- Better quality control
- More time for strategy

## The Human Element
Creativity and emotional intelligence remain uniquely human.
    `,
        cover_image_url: 'https://images.unsplash.com/photo-1676239169435-082468369688?w=1200&h=630&fit=crop',
        category_id: 'c3',
        category: MOCK_CATEGORIES[2],
        tags: ['t5'],
        author_id: 'author-3',
        author_name: 'Emma Rodriguez',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString(),
        published_at: new Date(Date.now() - 259200000).toISOString(),
        meta_title: 'Future of Content Creation with AI',
        meta_description: 'Analysis of how AI is changing the content creation landscape.',
        focus_keyword: 'content creation future',
        status: 'published',
        views_count: 560,
        likes_count: 18,
        comments_count: 5,
        is_featured: false,
    },
    {
        id: 'p5',
        title: 'Midjourney v6 vs DALL-E 3: Which is Better?',
        slug: 'midjourney-vs-dalle-3-comparison',
        excerpt: 'A comprehensive comparison of the two leading AI image generators.',
        content_md: `# Image Generation Showdown

We tested both tools with the same prompts.

## The Results
Midjourney wins on style. DALL-E 3 wins on prompt adherence.

## Midjourney Strengths
- Artistic quality
- Community features
- Consistent style

## DALL-E 3 Strengths
- Better prompt understanding
- Integration with ChatGPT
- Easier to use

## Verdict
Choose based on your needs: art vs accuracy.
    `,
        cover_image_url: 'https://images.unsplash.com/photo-1675557009875-436f52a78adf?w=1200&h=630&fit=crop',
        category_id: 'c3',
        category: MOCK_CATEGORIES[2],
        tags: ['t2'],
        author_id: 'author-2',
        author_name: 'Michael Chen',
        created_at: new Date(Date.now() - 400000000).toISOString(),
        updated_at: new Date(Date.now() - 400000000).toISOString(),
        published_at: new Date(Date.now() - 400000000).toISOString(),
        meta_title: null,
        meta_description: null,
        focus_keyword: null,
        status: 'published',
        views_count: 1540,
        likes_count: 67,
        comments_count: 15,
        is_featured: false,
    }
]
