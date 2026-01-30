import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-dark-400 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 ? (
            <Link href={item.href} className="hover:text-primary-400 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              {index === items.length - 1 ? (
                <span className="text-dark-300">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary-400 transition-colors">
                  {item.label}
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  )
}
