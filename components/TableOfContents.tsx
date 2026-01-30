'use client'

import { useEffect, useState } from 'react'
import { Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))
    const tocItems: TocItem[] = matches.map((match, index) => {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      return { id, text, level }
    })
    setHeadings(tocItems)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-primary-400" />
        <h3 className="font-semibold text-dark-50">Table of Contents</h3>
      </div>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }}
            className={cn(
              'block text-sm transition-colors hover:text-primary-400',
              heading.level === 3 && 'ml-4',
              activeId === heading.id
                ? 'text-primary-400 font-medium'
                : 'text-dark-400'
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
