import Link from 'next/link'
import Image from 'next/image'
import { formatDate, generateExcerpt, getPostCoverImage } from '@/lib/utils'
import type { Post } from '@/lib/types'
import { Pagination } from './Pagination'
import { Clock, Eye } from 'lucide-react'
import readingTime from 'reading-time'

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

export function BlogList({ posts, currentPage, limit, searchParams }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-dark-300 text-lg font-medium">No articles found</p>
        <p className="text-dark-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => {
          const rt = readingTime(post.content_md || '')
          return (
            <article
              key={post.id}
              className="group flex flex-col bg-dark-900 border border-dark-800 rounded-xl overflow-hidden hover:border-primary-500/50 hover:shadow-xl hover:shadow-dark-950/50 transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden flex-shrink-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={getPostCoverImage(post.slug, post.cover_image_url)}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 to-transparent" />
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-5">
                {post.category ? (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="text-xs font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest mb-2 transition-colors"
                  >
                    {post.category.name}
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-dark-600 uppercase tracking-widest mb-2">General</span>
                )}

                <Link href={`/blog/${post.slug}`} className="flex-1">
                  <h3 className="text-base font-bold text-dark-50 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt || generateExcerpt(post.content_md)}
                </p>

                <div className="flex items-center justify-between text-xs text-dark-500 pt-3 border-t border-dark-800">
                  <span className="text-dark-400">{formatDate(post.created_at)}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rt.text}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views_count}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <Pagination currentPage={currentPage} searchParams={searchParams} />
    </>
  )
}
