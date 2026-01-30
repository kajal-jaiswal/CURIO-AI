import Link from 'next/link'
import Image from 'next/image'
import { formatDate, generateExcerpt } from '@/lib/utils'
import type { Post } from '@/lib/types'
import { Pagination } from './Pagination'

interface BlogListProps {
  posts: Post[]
  currentPage: number
  limit: number
  searchParams: {
    category?: string
    tag?: string
    search?: string
    sort?: 'latest' | 'popular'
  }
}

export function BlogList({ posts, posts: postsList, currentPage, limit, searchParams }: BlogListProps) {
  if (postsList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-400 text-lg">No articles found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {postsList.map((post) => (
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
              {post.category && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="text-xs font-medium text-primary-400 hover:text-primary-300 mb-2 inline-block"
                >
                  {post.category.name}
                </Link>
              )}
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

      <Pagination currentPage={currentPage} searchParams={searchParams} />
    </>
  )
}
