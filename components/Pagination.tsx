'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  searchParams: {
    category?: string
    tag?: string
    search?: string
    sort?: 'latest' | 'popular'
  }
}

export function Pagination({ currentPage, searchParams }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams.category) params.set('category', searchParams.category)
    if (searchParams.tag) params.set('tag', searchParams.tag)
    if (searchParams.search) params.set('search', searchParams.search)
    if (searchParams.sort) params.set('sort', searchParams.sort)
    if (page > 1) params.set('page', page.toString())
    return `/blog?${params.toString()}`
  }

  // For now, we'll show a simple prev/next pagination
  // In a real app, you'd calculate total pages from the data
  const hasNext = true // This should come from your data
  const hasPrev = currentPage > 1

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link
        href={buildUrl(currentPage - 1)}
        className={cn(
          'px-4 py-2 rounded-lg border border-dark-800 text-dark-300 hover:bg-dark-800 transition-colors flex items-center gap-2',
          !hasPrev && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Link>

      <span className="px-4 py-2 text-dark-300">
        Page {currentPage}
      </span>

      <Link
        href={buildUrl(currentPage + 1)}
        className={cn(
          'px-4 py-2 rounded-lg border border-dark-800 text-dark-300 hover:bg-dark-800 transition-colors flex items-center gap-2',
          !hasNext && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
