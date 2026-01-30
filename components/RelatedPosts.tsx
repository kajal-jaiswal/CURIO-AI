import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/types'

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="bg-dark-900 border-t border-dark-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark-50">Related Articles</h2>
          <Link
            href="/blog"
            className="text-primary-400 hover:text-primary-300 flex items-center text-sm font-medium"
          >
            View All
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-dark-950 border border-dark-800 rounded-lg overflow-hidden hover:border-primary-500 transition-colors group"
            >
              {post.cover_image_url && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-dark-500">{formatDate(post.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
