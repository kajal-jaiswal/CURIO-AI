import type { Metadata } from 'next'
import { getPostBySlug } from '@/lib/queries'
import { generateExcerpt } from '@/lib/utils'

interface BlogPostLayoutProps {
  params: {
    slug: string
  }
  children: React.ReactNode
}

export async function generateMetadata({ params }: BlogPostLayoutProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || generateExcerpt(post.content_md)
  const image = post.cover_image_url || '/og-image.jpg'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author || post.author_name || 'Curio AI Bot'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    other: {
      'article:published_time': post.created_at,
      'article:modified_time': post.updated_at,
      'article:author': post.author || post.author_name || 'Curio AI Bot',
      ...(post.category && { 'article:section': post.category.name }),
      ...(post.tags && { 'article:tag': post.tags.join(', ') }),
    },
  }
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return <>{children}</>
}
