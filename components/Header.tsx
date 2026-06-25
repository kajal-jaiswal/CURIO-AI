import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { HeaderNav } from './HeaderNav'
import { SearchBar } from './SearchBar'

export async function Header() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch {}

  const user = session?.user
  const initial = user ? (user.name || user.email || 'U')[0].toUpperCase() : ''

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-800 bg-dark-950/95 backdrop-blur supports-[backdrop-filter]:bg-dark-950/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Curio AI
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <HeaderNav />
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <SearchBar />

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>👑</span> Admin
                  </Link>
                )}
                {user.role === 'author' && (
                  <Link
                    href="/author"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>✍️</span> Dashboard
                  </Link>
                )}
                <Link
                  href="/bookmarks"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-dark-50 rounded-lg text-xs font-medium transition-colors"
                  title="Your bookmarks"
                >
                  <span>🔖</span> Saved
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title={user.name || user.email || 'Profile'}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold shadow">
                    {initial}
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-dark-300 hover:text-primary-400 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/blog"
              className="hidden sm:inline-flex px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Browse Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
