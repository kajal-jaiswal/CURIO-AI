import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, BookOpen } from 'lucide-react'
import { getPosts, getCategories, getPopularPosts } from '@/lib/queries'
import { formatDate, generateExcerpt } from '@/lib/utils'
import { NewsletterBox } from '@/components/NewsletterBox'
import { FAQ } from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'AI Tools for Jobs & Small Businesses',
  description: 'Discover the best AI tools for jobs and small businesses. Expert reviews, guides, and insights to help you leverage AI for productivity and growth.',
  openGraph: {
    title: 'AI Tools for Jobs & Small Businesses',
    description: 'Discover the best AI tools for jobs and small businesses.',
  },
}

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  let featuredPosts = []
  let categories = []
  let popularPosts = []

  try {
    const [postsData, categoriesData, popularData] = await Promise.all([
      getPosts({ limit: 6, sort: 'latest' }),
      getCategories(),
      getPopularPosts(5),
    ])
    featuredPosts = postsData
    categories = categoriesData
    popularPosts = popularData
  } catch (error) {
    console.error('HomePage fetching error:', error)
    // Fallback to empty or could import mocks here if needed
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-dark-50 mb-6 animate-fade-in">
              AI Tools for Jobs &{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Small Businesses
              </span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 animate-slide-up">
              Discover expert reviews, guides, and insights to help you leverage AI for productivity and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Explore Articles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-50 rounded-lg font-medium transition-colors border border-dark-700"
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-dark-50">Featured Articles</h2>
            <Link
              href="/blog"
              className="text-primary-400 hover:text-primary-300 flex items-center text-sm font-medium"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
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
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark-50 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors group"
              >
                <BookOpen className="w-8 h-8 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-dark-400 text-sm">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <h2 className="text-3xl font-bold text-dark-50">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex gap-4 bg-dark-900 border border-dark-800 rounded-lg p-6 hover:border-primary-500 transition-colors group"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  {post.category && (
                    <span className="text-xs font-medium text-primary-400 mb-1 block">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-dark-500">
                    <span>{formatDate(post.created_at)}</span>
                    <span>{post.views_count} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary-900/20 to-primary-800/20 border-y border-primary-900/30">
        <div className="container mx-auto px-4">
          <NewsletterBox />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4">
          <FAQ />
        </div>
      </section>
    </>
  )
}
