'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import type { Category, Tag } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset to page 1 on filter change

    router.push(`/blog?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    
    router.push(`/blog?${params.toString()}`)
  }

  const activeCategory = searchParams.get('category')
  const activeTag = searchParams.get('tag')
  const activeSort = searchParams.get('sort') || 'latest'

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary-400" />
        <h2 className="text-lg font-semibold text-dark-50">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('category', null)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                !activeCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => updateFilter('category', activeCategory === category.id ? null : category.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('tag', null)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                !activeTag
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => updateFilter('tag', activeTag === tag.id ? null : tag.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTag === tag.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Sort By</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter('sort', 'latest')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeSort === 'latest'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              Latest
            </button>
            <button
              onClick={() => updateFilter('sort', 'popular')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeSort === 'popular'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              Popular
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(activeCategory || activeTag || search) && (
          <button
            onClick={() => {
              setSearch('')
              router.push('/blog')
            }}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}
