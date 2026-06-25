import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, Eye, Share2 } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, incrementPostViews } from '@/lib/queries'
import { formatDate, generateExcerpt } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { SocialShare } from '@/components/SocialShare'
import { LikeButton } from '@/components/LikeButton'
import { BookmarkButton } from '@/components/BookmarkButton'
import { ReadingProgress } from '@/components/ReadingProgress'
import { RelatedPosts } from '@/components/RelatedPosts'
import { CommentsSection } from '@/components/CommentsSection'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BlogPostSchema } from './schema'
import { ViewTracker } from '@/components/ViewTracker'
import { TrendingNewsSidebar } from '@/components/TrendingNewsSidebar'
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
      authors: [(post.author || post.author_name || 'Curio AI Bot') as string],
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
          <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                {((post.author || post.author_name || 'C')[0]).toUpperCase()}
              </div>
              <span className="text-dark-300 font-medium">{post.author || post.author_name || 'Curio AI'}</span>
            </div>
            <span className="text-dark-700">·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTimeResult.text}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{post.views_count} views</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden">
            <Image
              src={post.cover_image_url || `https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=896&h=400&fit=crop&auto=format`}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={post.content_md} />
              </div>

              <div className="mt-8 pt-8 border-t border-dark-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <LikeButton postId={post.id} initialCount={post.likes_count} />
                    <BookmarkButton postId={post.id} />
                  </div>
                  <SocialShare
                    title={post.title}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/blog/${post.slug}`}
                  />
                </div>
              </div>

              <CommentsSection postId={post.id} />
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                <TableOfContents content={post.content_md} />
              </div>
                <div className="mt-6">
                  <TrendingNewsSidebar />
                </div>
            </aside>
          </div>
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
    </>
  )
}
