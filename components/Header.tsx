import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HeaderNav } from './HeaderNav'
import { SearchBar } from './SearchBar'

export async function Header() {
  let user = null
  let userProfile = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()
      userProfile = profile
    }
  } catch (error) {
    // Ignore error, treat as logged out
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-800 bg-dark-950/95 backdrop-blur supports-[backdrop-filter]:bg-dark-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Curio AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <HeaderNav />
          </nav>

          <div className="flex items-center space-x-4">
            <SearchBar />

            {user && userProfile ? (
              <>
                {/* Dashboard Link based on role */}
                {userProfile.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    👑 Admin
                  </Link>
                )}
                {userProfile.role === 'author' && (
                  <Link
                    href="/author"
                    className="text-sm text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    ✍️ Dashboard
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-400">
                    {userProfile.full_name || user.email}
                  </span>
                  <Link
                    href="/profile"
                    className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-dark-50 rounded-lg transition-colors text-sm"
                  >
                    Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <Link
                  href="/login"
                  className="px-4 py-2 text-dark-300 hover:text-primary-400 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              href="/blog"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Browse Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
