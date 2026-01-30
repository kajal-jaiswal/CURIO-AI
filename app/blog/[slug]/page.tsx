import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, Eye, Share2 } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, incrementPostViews } from '@/lib/queries'
import { formatDate, generateExcerpt } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { SocialShare } from '@/components/SocialShare'
import { ReadingProgress } from '@/components/ReadingProgress'
import { RelatedPosts } from '@/components/RelatedPosts'
import { CommentsSection } from '@/components/CommentsSection'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BlogPostSchema } from './schema'
import { ViewTracker } from '@/components/ViewTracker'
import readingTime from 'reading-time'

export const revalidate = 3600

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  const post = await getPostBySlug(slug)
  if (!post) {
    return null
  }

  // Increment views (non-blocking, client-side)
  // This will be handled client-side to avoid blocking

  return post
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || generateExcerpt(post.content_md)
  const image = post.cover_image_url || '/og-image.jpg'

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
      canonical: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const readingTimeResult = readingTime(post.content_md)
  const relatedPosts = await getRelatedPosts(
    post.id,
    post.category_id,
    post.tags,
    3
  )

  return (
    <>
      <BlogPostSchema params={{ slug: params.slug }} />
      <ViewTracker postId={post.id} />
      <ReadingProgress />
      <article className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            ...(post.category
              ? [{ label: post.category.name, href: `/category/${post.category.slug}` }]
              : []),
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <header className="max-w-4xl mx-auto mb-8">
          {post.category && (
            <a
              href={`/category/${post.category.slug}`}
              className="inline-block text-sm font-medium text-primary-400 hover:text-primary-300 mb-4"
            >
              {post.category.name}
            </a>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-dark-50 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-dark-300 mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-dark-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTimeResult.text}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views_count} views</span>
            </div>
            <div className="text-dark-400">By {post.author}</div>
          </div>
        </header>

        {post.cover_image_url && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              />
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={post.content_md} />
              </div>

              <div className="mt-8 pt-8 border-t border-dark-800">
                <SocialShare
                  title={post.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blog/${post.slug}`}
                />
              </div>

              <CommentsSection postId={post.id} />
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                <TableOfContents content={post.content_md} />
              </div>
            </aside>
          </div>
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
    </>
  )
}
