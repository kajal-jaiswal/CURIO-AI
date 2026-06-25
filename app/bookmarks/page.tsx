import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getPostCoverImage } from '@/lib/utils'
import { Bookmark, Clock } from 'lucide-react'
import readingTime from 'reading-time'

export const dynamic = 'force-dynamic'

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const bookmarks = await db.bookmark.findMany({
    where: { user_id: session.user.id },
    include: {
      post: {
        include: { category: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-7 h-7 text-primary-400" />
        <div>
          <h1 className="text-3xl font-bold text-dark-50">Your Bookmarks</h1>
          <p className="text-dark-400 text-sm mt-0.5">{bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-2xl border border-dark-800">
          <Bookmark className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-300 mb-2">No bookmarks yet</h2>
          <p className="text-dark-500 mb-6">Save articles to read them later</p>
          <Link href="/blog" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors">
            Browse Articles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => {
            const { post, created_at } = bm as typeof bm & { post: NonNullable<typeof bm.post> }
            const rt = readingTime(post.content_md || '')
            return (
              <article key={post.id} className="flex gap-4 bg-dark-900 border border-dark-800 rounded-xl p-4 hover:border-primary-500/40 transition-colors group">
                <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={getPostCoverImage(post.slug, post.cover_image_url)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {post.category && (
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">{post.category.name}</span>
                  )}
                  <Link href={"/blog/" + post.slug}>
                    <h3 className="text-dark-50 font-semibold line-clamp-2 group-hover:text-primary-400 transition-colors mt-0.5">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-dark-500">
                    <span>{formatDate(created_at.toString())}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rt.text}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
