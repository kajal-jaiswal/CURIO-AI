-- This file contains sample blog posts for seeding the database
-- Run this after creating the schema

-- Get category and tag IDs (adjust these based on your actual IDs)
DO $$
DECLARE
  productivity_id UUID;
  marketing_id UUID;
  content_id UUID;
  chatgpt_tag_id UUID;
  free_tools_tag_id UUID;
  small_business_tag_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO productivity_id FROM categories WHERE slug = 'productivity-tools' LIMIT 1;
  SELECT id INTO marketing_id FROM categories WHERE slug = 'marketing' LIMIT 1;
  SELECT id INTO content_id FROM categories WHERE slug = 'content-creation' LIMIT 1;

  -- Get tag IDs
  SELECT id INTO chatgpt_tag_id FROM tags WHERE slug = 'chatgpt' LIMIT 1;
  SELECT id INTO free_tools_tag_id FROM tags WHERE slug = 'free-tools' LIMIT 1;
  SELECT id INTO small_business_tag_id FROM tags WHERE slug = 'small-business' LIMIT 1;

  -- Insert sample posts
  INSERT INTO posts (title, slug, excerpt, content_md, category_id, tags, author, status, meta_title, meta_description, focus_keyword) VALUES
  (
    '10 Best Free AI Tools for Small Businesses in 2024',
    '10-best-free-ai-tools-small-businesses-2024',
    'Discover the top free AI tools that can help your small business automate tasks, improve productivity, and grow without breaking the bank.',
    '# 10 Best Free AI Tools for Small Businesses in 2024

Small businesses are always looking for ways to do more with less. AI tools can be game-changers, but many come with hefty price tags. Here are 10 free AI tools that can transform your business operations.

## 1. ChatGPT

ChatGPT is one of the most versatile AI tools available. Use it for:
- Content creation
- Customer service responses
- Email drafting
- Brainstorming sessions

## 2. Canva AI

Canva''s AI features help you create professional graphics without design skills. The free tier includes:
- AI image generation
- Background removal
- Text-to-image conversion

## 3. Grammarly

Improve your writing with AI-powered grammar and style suggestions. Perfect for:
- Email communication
- Blog posts
- Social media content

## 4. Notion AI

Notion AI helps you write, edit, and organize content. Use it to:
- Draft documents
- Summarize meetings
- Generate ideas

## 5. Otter.ai

Transcribe meetings and interviews automatically. Great for:
- Meeting notes
- Interview transcripts
- Content creation

## Conclusion

These free AI tools can significantly improve your business operations without any upfront costs. Start with one or two tools and gradually expand as you see results.',
    productivity_id,
    ARRAY[chatgpt_tag_id::text, free_tools_tag_id::text, small_business_tag_id::text],
    'Admin',
    'published',
    '10 Best Free AI Tools for Small Businesses in 2024',
    'Discover the top free AI tools that can help your small business automate tasks and improve productivity.',
    'free AI tools small business'
  ),
  (
    'How to Use ChatGPT for Content Marketing',
    'how-to-use-chatgpt-content-marketing',
    'Learn how to leverage ChatGPT to create engaging content, improve your marketing strategy, and save time on content creation.',
    '# How to Use ChatGPT for Content Marketing

Content marketing is essential for business growth, but creating quality content consistently can be challenging. ChatGPT can be your secret weapon.

## Getting Started with ChatGPT

First, understand that ChatGPT works best when you provide clear, specific prompts. Instead of "write a blog post," try "write a 1000-word blog post about AI tools for small businesses, targeting entrepreneurs, with a friendly tone."

## Content Ideas Generation

Use ChatGPT to brainstorm:
- Blog post topics
- Social media content ideas
- Email newsletter themes
- Video script concepts

## Writing Assistance

ChatGPT can help you:
- Draft initial content
- Improve existing drafts
- Create multiple variations
- Adapt tone and style

## SEO Optimization

Ask ChatGPT to:
- Generate meta descriptions
- Create SEO-friendly titles
- Suggest keywords
- Write alt text for images

## Best Practices

1. Always review and edit AI-generated content
2. Add your unique perspective and voice
3. Fact-check all information
4. Use ChatGPT as a starting point, not the final product

## Conclusion

ChatGPT is a powerful tool for content marketing, but it works best when combined with human creativity and expertise.',
    marketing_id,
    ARRAY[chatgpt_tag_id::text],
    'Admin',
    'published',
    'How to Use ChatGPT for Content Marketing - Complete Guide',
    'Learn how to leverage ChatGPT to create engaging content and improve your marketing strategy.',
    'ChatGPT content marketing'
  )
ON CONFLICT (slug) DO NOTHING;
END $$;
