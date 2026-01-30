import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getTagBySlug, getPosts } from '@/lib/queries'
import { formatDate, generateExcerpt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const revalidate = 3600

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `#${tag.name}`,
    description: `Browse all articles tagged with ${tag.name}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug)

  if (!tag) {
    notFound()
  }

  const posts = await getPosts({ tag: tag.id, limit: 20 })

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: `#${tag.name}`, href: `/tag/${tag.slug}` },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-dark-50 mb-4">#{tag.name}</h1>
        <p className="text-lg text-dark-300">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with this topic
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-400 text-lg">No articles with this tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden hover:border-primary-500 transition-colors group"
            >
              {post.cover_image_url && (
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )}
              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-dark-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt || generateExcerpt(post.content_md)}
                </p>
                <div className="flex items-center justify-between text-xs text-dark-500">
                  <span>{formatDate(post.created_at)}</span>
                  <span>{post.views_count} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
