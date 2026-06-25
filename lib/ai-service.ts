import { GoogleGenerativeAI } from '@google/generative-ai'
import type { NewsArticle } from './news-service'
import { slugify } from './utils'

export type GeneratedPost =
  | {
      success: true
      title: string
      slug: string
      excerpt: string
      content_md: string
      meta_title: string
      meta_description: string
      category_slug: string
      tags: string[]
      reading_time: string
    }
  | {
      success: false
      title: string
      slug: string
      excerpt: string
      content_md: string
      error: string
    }

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not set')
  return new GoogleGenerativeAI(apiKey)
}

export interface GeneratePostOptions {
  topic: string
  tone?: string
  category?: string
  keywords?: string
  audience?: string
  wordCount?: number
  language?: string
}

function buildPrompt(
  topic: string,
  category: string,
  tone: string,
  audience: string,
  wordCount: number,
  language: string,
  context?: string
): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `You are a senior editorial journalist and fact-checked content strategist. Your writing appears in trusted publications where every claim is verified before publication.

## Assignment

Category: ${category}
Topic: ${topic}
Target Audience: ${audience}
Word Count: ${wordCount}
Tone: ${tone}
Language: ${language}
Date: ${currentDate}
${context ? `\nSource Context (use this as a starting reference — do not copy verbatim):\n${context.substring(0, 500)}` : ''}

---

## FACT CLASSIFICATION SYSTEM — MANDATORY

Before writing any sentence that makes a factual claim, mentally classify it into one of these tiers. Only Tiers 1–4 may be stated as fact. Tier 5 requires a qualifier. Tier 6 must be deleted.

| Tier | Type | Rule | Signal phrase |
|------|------|------|---------------|
| 1 | Officially confirmed | Write as fact | (none needed) |
| 2 | Reported by reliable media | Write as fact with source signal | "Reuters reported…", "According to…" |
| 3 | Historical / established fact | Write as fact | (none needed) |
| 4 | Scientific or technical consensus | Write as fact | (none needed) |
| 5 | Unverified / speculative | MUST use a qualifier | "reportedly", "may", "is expected to", "analysts suggest", "could" |
| 6 | Fabricated / invented | DELETE — never write this | — |

### Examples of each tier:
- ✅ Tier 1: "OpenAI develops the GPT series of language models."
- ✅ Tier 2: "Reuters reported that OpenAI is in talks with Broadcom to develop custom AI chips."
- ✅ Tier 3: "GPUs have been widely used for AI training workloads since the early 2010s."
- ✅ Tier 4: "Specialized hardware such as ASICs can improve throughput for inference tasks."
- ⚠️ Tier 5: "The partnership may reduce infrastructure costs for the company." ← qualifier required
- ❌ Tier 6: "Jalapeño chips are 30% faster than Nvidia A100s." ← invented — DELETE

### Hard rules derived from the classification system:
1. Never invent a statistic. If you don't know the exact number, describe the trend without a figure.
2. Never fabricate a company name, product name, person's quote, or research paper title.
3. Never present speculation as established fact. If you are not certain, qualify it.
4. If a claim requires a source you cannot name, either attribute it vaguely ("industry observers note…") or omit it.
5. Do not state future outcomes as certainties. Use "may", "could", "is expected to".

---

## WRITING RULES

### Style
- Write as a human expert author, not as an AI assistant.
- Avoid all AI clichés: "In today's fast-paced world", "game-changer", "whether you're a", "the possibilities are endless", "as we move forward", "it's worth noting", "in conclusion".
- Vary sentence length. Mix short punchy sentences with longer explanatory ones.
- Use concrete examples and real-world context, not abstract generalisations.
- Short paragraphs. Maximum 3–4 sentences per paragraph.

### Scope
- Stay entirely on the provided topic. Do not drift into unrelated subjects.
- Write at an 8th–10th grade reading level. Clear, not dumbed down.

---

## OUTPUT FORMAT — FOLLOW EXACTLY

Return the article in this precise Markdown structure. Do not add any preamble or commentary before it.

# [SEO-optimised title — specific, not clickbait]

Meta Description: [150–160 characters, includes primary keyword]

Slug: [lowercase-hyphenated-slug]

Category: ${category}

Tags: [5–8 comma-separated tags]

Reading Time: [X min read]

Featured Image Suggestion: [one sentence describing the ideal cover image]

---

[Opening paragraph — no heading. Hook the reader immediately with a specific, concrete observation. No AI clichés.]

---

## [Section heading — descriptive, not generic]

[3–5 paragraphs. Every factual claim must pass the Tier 1–4 test or be qualified per Tier 5.]

## [Section heading]

[Content. If referencing a specific statistic you are not certain of, omit the number and describe the direction of the trend instead.]

## [Section heading]

[Content.]

## [Section heading]

[Content.]

[Add 2–4 more H2 sections as the topic requires. Minimum 4, maximum 8 total.]

---

## Frequently Asked Questions

**Q: [Specific question a reader would actually search for]?**
A: [Direct, factual answer. Apply the same Tier 1–5 classification — no invented facts.]

**Q: [Question]?**
A: [Answer]

**Q: [Question]?**
A: [Answer]

---

## Key Takeaways

- [Concrete takeaway — a fact or verified insight, not a vague statement]
- [Takeaway]
- [Takeaway]
- [Takeaway]

---

## Conclusion

[2–3 paragraphs. Synthesise the article without repeating it word for word. End with a forward-looking statement that is appropriately qualified if speculative.]

---

## Editorial Self-Check — verify every item before returning

Before outputting the article, run through this checklist mentally:

- [ ] Every statistic can be attributed to a real, named source or is removed
- [ ] No company, product, or person is invented
- [ ] All speculative statements use a qualifying word (may, could, reportedly, expected to)
- [ ] No sentence presents a future outcome as a confirmed fact
- [ ] No AI clichés appear anywhere in the article
- [ ] The article stays on topic throughout
- [ ] The intro does not start with "In today's" or "Whether you're"
- [ ] Quotes, if any, are attributed to a real person with context — not invented
- [ ] The conclusion does not start with "In conclusion"

---

## Conclusion

[A meaningful conclusion that summarizes without repeating earlier paragraphs]

---

## Final Quality Checklist (verify before returning):

✓ Every factual claim is accurate
✓ No fabricated companies, products, or statistics
✓ No contradictory statements
✓ No repetitive paragraphs
✓ No AI clichés
✓ Every section adds value
✓ Article remains focused on the topic
✓ Grammar and spelling are correct
✓ Reads naturally and professionally`
}

function parseGeneratedContent(text: string, topic: string, category: string) {
  let title = topic
  let content = text
  let metaDescription = ''
  let slug = ''
  let tags: string[] = []
  let readingTime = ''

  // Extract title from first H1
  const titleMatch = text.match(/^#\s+(.+?)$/m)
  if (titleMatch) {
    title = titleMatch[1].trim()
  }

  // Extract meta description
  const metaMatch = text.match(/Meta Description:\s*(.+?)(?:\n|$)/i)
  if (metaMatch) metaDescription = metaMatch[1].trim()

  // Extract slug from content
  const slugMatch = text.match(/Slug:\s*(.+?)(?:\n|$)/i)
  if (slugMatch) slug = slugify(slugMatch[1].trim())

  // Extract tags
  const tagsMatch = text.match(/Tags:\s*(.+?)(?:\n|$)/i)
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
  }

  // Extract reading time
  const rtMatch = text.match(/Reading Time:\s*(.+?)(?:\n|$)/i)
  if (rtMatch) readingTime = rtMatch[1].trim()

  // Clean up the content — remove the metadata header lines, keep markdown body
  const metadataLines = [
    /^Meta Description:.*$/m,
    /^Slug:.*$/m,
    /^Category:.*$/m,
    /^Tags:.*$/m,
    /^Reading Time:.*$/m,
    /^Featured Image Suggestion:.*$/m,
  ]
  metadataLines.forEach(re => { content = content.replace(re, '') })

  // Remove the Final Quality Checklist section from content
  content = content.replace(/## Final Quality Checklist[\s\S]*$/, '').trim()

  // Clean up excessive blank lines
  content = content.replace(/\n{3,}/g, '\n\n').trim()

  // Generate excerpt from first real paragraph (skip headers and metadata)
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.trim().startsWith('#'))
  const firstPara = paragraphs[0] || content.substring(0, 200)
  const excerpt = metaDescription || firstPara.replace(/[#*`_>]/g, '').substring(0, 160).trim() + '...'

  const finalSlug = slug || slugify(title)
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'general'

  // Auto-add relevant tags if none extracted
  if (tags.length === 0) {
    const keywords = ['AI', 'tools', 'small business', 'productivity', 'automation', 'software', 'technology']
    tags = keywords.filter(kw =>
      title.toLowerCase().includes(kw.toLowerCase()) ||
      content.toLowerCase().includes(kw.toLowerCase())
    )
  }

  return {
    success: true as const,
    title,
    slug: finalSlug,
    excerpt,
    content_md: content,
    meta_title: title.substring(0, 60),
    meta_description: excerpt.substring(0, 160),
    category_slug: categorySlug,
    tags,
    reading_time: readingTime,
  }
}

export async function generateBlogPost(options: GeneratePostOptions | NewsArticle): Promise<GeneratedPost> {
  let topic: string
  let context = ''

  if ('title' in options && 'link' in options) {
    topic = options.title
    context = options.contentSnippet || options.content || ''
  } else {
    topic = options.topic
    context = options.keywords || ''
  }

  const tone = ('tone' in options && options.tone) ? options.tone : 'Professional yet engaging'
  const category = ('category' in options && options.category) ? options.category : 'AI Tools'
  const audience = ('audience' in options && options.audience) ? options.audience : 'Small business owners and professionals'
  const wordCount = ('wordCount' in options && options.wordCount) ? options.wordCount : 1200
  const language = ('language' in options && options.language) ? options.language : 'English'

  const systemInstruction =
    'You are a senior editorial journalist writing for a fact-checked publication. ' +
    'Every claim must be classifiable as: (1) officially confirmed, (2) reported by a named reliable source, ' +
    '(3) established historical fact, or (4) scientific/technical consensus. ' +
    'Claims that do not meet one of those four standards MUST be qualified with ' +
    '"reportedly", "may", "could", "is expected to", or "analysts suggest" — or omitted entirely. ' +
    'NEVER invent statistics, percentages, company names, product names, quotes, or research paper titles. ' +
    'Return ONLY Markdown. No preamble, no "Here is your article", no "Sure!". ' +
    'Start directly with the # Title line.'

  const prompt = buildPrompt(topic, category, tone, audience, wordCount, language, context)

  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        topP: 0.9,
      },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    if (!text?.trim()) throw new Error('Empty response from Gemini')

    return parseGeneratedContent(text, topic, category)
  } catch (error: any) {
    console.error('Gemini Generation Error:', error.message)
    return {
      success: false as const,
      title: '',
      slug: '',
      excerpt: '',
      content_md: '',
      error: error.message,
    }
  }
}
