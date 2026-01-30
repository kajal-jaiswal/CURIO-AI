
import { NewsArticle } from './news-service';

export interface GeneratedPost {
    title: string;
    slug: string;
    excerpt: string;
    content_md: string;
    tags: string[];
    meta_title: string;
    meta_description: string;
    category_slug: string; // To map to existing categories
}

export async function generateBlogPost(article: NewsArticle): Promise<GeneratedPost | null> {
    const groqKey = process.env.GROQ_API_KEY;
    const isPlaceholder = !groqKey || groqKey === 'YOUR_GROQ_KEY_HERE';

    if (isPlaceholder) {
        console.warn('⚠️ GROQ_API_KEY is missing. Running in DEMO MODE.');
        return {
            title: `[DEMO] ${article.title}`,
            slug: `demo-${article.link.split('/').pop() || Date.now()}`,
            excerpt: article.contentSnippet?.slice(0, 150) || 'This is a demo automated blog post generated because no API key was found.',
            content_md: `## ${article.title}\n\nThis is a **automatically generated** demo post.\n\nOriginal Source: [${article.source}](${article.link})\n\n${article.contentSnippet}`,
            tags: ['AI', 'Tech', 'Automation', 'Demo'],
            meta_title: `Demo: ${article.title}`,
            meta_description: `Read about ${article.title} in our automated blog demo.`,
            category_slug: 'business-automation'
        };
    }

    try {
        const prompt = `
      You are an expert tech blogger for "Curio AI Blog". 
      Your task is to write a high-quality, engaging, and SEO-optimized blog post based on this news article:
      
      Title: ${article.title}
      Source: ${article.source}
      Context: ${article.contentSnippet}
      Link: ${article.link}

      **Requirements:**
      1. **Tone**: Professional, insightful, yet accessible. Avoid robotic language.
      2. **Structure**: 
         - Catchy Title (different from the original).
         - Engaging Introduction.
         - Key Takeaways (bullet points).
         - In-depth Analysis (why this matters).
         - Conclusion.
      3. **Format**: Use valid Markdown (## Headers, **bold**, *italics*).
      4. **SEO**: Include a meta title, meta description, and 3-5 relevant tags.
      5. **Category**: Choose the best fit from: 'productivity-tools', 'marketing', 'content-creation', 'business-automation', 'customer-service'. If none fit perfectly, default to 'business-automation'.

      **Output Format (JSON only):**
      {
        "title": "Your Catchy Title",
        "slug": "your-catchy-title-slugified",
        "excerpt": "A short, engaging summary (approx 150 chars).",
        "content_md": "The full blog post in Markdown...",
        "tags": ["Tag1", "Tag2"],
        "meta_title": "SEO Title",
        "meta_description": "SEO Description",
        "category_slug": "chosen-category-slug"
      }

      Return ONLY the JSON. No preamble or post-script. Ensure Markdown newlines are escaped as \\n.
    `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                stream: false,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API call failed');
        }

        const result = await response.json();
        const content = JSON.parse(result.choices[0].message.content);

        return {
            title: content.title,
            slug: content.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            excerpt: content.excerpt,
            content_md: content.content_md,
            tags: content.tags,
            meta_title: content.meta_title,
            meta_description: content.meta_description,
            category_slug: content.category_slug
        };

    } catch (error: any) {
        console.error('❌ Groq Error:', error.message);
        return null;
    }
}
