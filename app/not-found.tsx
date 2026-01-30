import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-dark-50 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-dark-100 mb-4">Page Not Found</h2>
        <p className="text-dark-300 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-50 rounded-lg font-medium transition-colors border border-dark-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
