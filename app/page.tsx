import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Clock, Eye } from 'lucide-react'
import { getPosts, getCategories, getPopularPosts } from '@/lib/queries'
import { formatDate, generateExcerpt, getPostCoverImage } from '@/lib/utils'
import { NewsletterBox } from '@/components/NewsletterBox'
import { FAQ } from '@/components/FAQ'
import readingTime from 'reading-time'
import type { Post, Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'AI Tools for Jobs & Small Businesses',
  description: 'Discover the best AI tools for jobs and small businesses. Expert reviews, guides, and insights to help you leverage AI for productivity and growth.',
  openGraph: {
    title: 'AI Tools for Jobs & Small Businesses',
    description: 'Discover the best AI tools for jobs and small businesses.',
  },
}

export const revalidate = 3600

export default async function HomePage() {
  let featuredPosts: Post[] = []
  let categories: Category[] = []
  let popularPosts: Post[] = []

  try {
    const [postsData, categoriesData, popularData] = await Promise.all([
      getPosts({ limit: 7, sort: 'latest' }),
      getCategories(),
      getPopularPosts(5),
    ])
    featuredPosts = postsData || []
    categories = categoriesData || []
    popularPosts = popularData || []
  } catch (error) {
    console.error('HomePage fetching error:', error)
  }

  const heroPost = featuredPosts[0] || null
  const gridPosts = featuredPosts.slice(1)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold rounded-full uppercase tracking-widest mb-6">
              AI Tools & Insights
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-dark-50 mb-6 leading-tight">
              AI Tools for Jobs &{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Small Businesses
              </span>
            </h1>
            <p className="text-lg text-dark-300 mb-10 leading-relaxed">
              Expert reviews, guides, and insights to help you leverage AI for productivity and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-900/30"
              >
                Explore Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-50 rounded-xl font-semibold transition-colors border border-dark-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-dark-50">Latest Articles</h2>
              <p className="text-dark-400 text-sm mt-1">Fresh insights and guides</p>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {heroPost ? (
            <div className="mb-8">
              {/* Hero Post */}
              <article className="group relative overflow-hidden rounded-2xl bg-dark-900 border border-dark-800 hover:border-primary-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-950/30">
                <Link href={`/blog/${heroPost.slug}`} className="block">
                  <div className="relative h-72 md:h-96 w-full overflow-hidden">
                    <Image
                      src={getPostCoverImage(heroPost.slug, heroPost.cover_image_url)}
                      alt={heroPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      {heroPost.category && (
                        <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3">
                          {heroPost.category.name}
                        </span>
                      )}
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                        {heroPost.title}
                      </h2>
                      <p className="text-dark-300 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                        {heroPost.excerpt || generateExcerpt(heroPost.content_md)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-dark-400">
                        <span>{formatDate(heroPost.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readingTime(heroPost.content_md || '').text}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {heroPost.views_count} views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          ) : null}

          {/* Post Grid */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => {
                const rt = readingTime(post.content_md || '')
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col bg-dark-900 border border-dark-800 rounded-xl overflow-hidden hover:border-primary-500/50 hover:shadow-xl hover:shadow-dark-950/60 transition-all duration-300"
                  >
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden flex-shrink-0">
                      <div className="relative h-44 w-full">
                        <Image
                          src={getPostCoverImage(post.slug, post.cover_image_url)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/30 to-transparent" />
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
                      ) : null}
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-base font-bold text-dark-50 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-dark-400 text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt || generateExcerpt(post.content_md)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-dark-500 pt-3 border-t border-dark-800">
                        <span>{formatDate(post.created_at)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rt.text}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views_count}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {featuredPosts.length === 0 && (
            <div className="text-center py-20 bg-dark-900 rounded-2xl border border-dark-800">
              <div className="text-5xl mb-4">✍️</div>
              <p className="text-dark-300 font-medium">No articles yet</p>
              <p className="text-dark-500 text-sm mt-1">Check back soon for fresh content.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-dark-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-dark-50">Browse by Topic</h2>
              <p className="text-dark-400 text-sm mt-1">Find articles tailored to your needs</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-primary-500/60 hover:bg-dark-700/50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-primary-600/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-600/20 transition-colors">
                    <span className="text-xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-dark-50 text-sm group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-dark-500 text-xs mt-1 line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending */}
      {popularPosts.length > 0 && (
        <section className="py-16 bg-dark-950">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-10">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              <h2 className="text-2xl font-bold text-dark-50">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 bg-dark-900 border border-dark-800 rounded-xl p-5 hover:border-primary-500/50 hover:bg-dark-900/80 transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-xl font-black text-white/80">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="text-xs font-bold text-primary-400 uppercase tracking-wider block mb-1">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-dark-50 group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-dark-500">
                      <span>{formatDate(post.created_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary-900/20 via-dark-900 to-primary-900/20 border-y border-primary-900/30">
        <div className="container mx-auto px-4">
          <NewsletterBox />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4">
          <FAQ />
        </div>
      </section>
    </>
  )
}
