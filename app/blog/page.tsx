import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getPosts, getCategories, getTags } from '@/lib/queries'
import { BlogList } from '@/components/BlogList'
import { BlogFilters } from '@/components/BlogFilters'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse all our articles about AI tools for jobs and small businesses.',
}

export const revalidate = 3600

interface BlogPageProps {
  searchParams: {
    category?: string
    tag?: string
    search?: string
    sort?: 'latest' | 'popular'
    page?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  const [posts, categories, tags] = await Promise.all([
    getPosts({
      limit,
      offset,
      category: searchParams.category,
      tag: searchParams.tag,
      search: searchParams.search,
      sort: searchParams.sort || 'latest',
    }),
    getCategories(),
    getTags(),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 pb-8 border-b border-dark-800">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-50 mb-3">All Articles</h1>
        <p className="text-dark-400">
          Expert insights on AI tools, productivity, and growth for small businesses.
        </p>
      </div>

      <Suspense fallback={<div className="text-dark-400">Loading filters...</div>}>
        <BlogFilters categories={categories} tags={tags} />
      </Suspense>

      <Suspense fallback={<div className="text-dark-400">Loading posts...</div>}>
        <BlogList
          posts={posts}
          currentPage={page}
          limit={limit}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  )
}
