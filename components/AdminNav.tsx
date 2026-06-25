import Link from 'next/link'
import { LogOut, Home, FileText, MessageSquare, BarChart3, Users, Megaphone, TrendingUp, Bot } from 'lucide-react'
import { AdminLogout } from './AdminLogout'

export function AdminNav() {
  return (
    <nav className="bg-dark-900 border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-400">Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Posts
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <Users className="w-4 h-4" />
                Users
              </Link>
              <Link
                href="/admin/comments"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Comments
              </Link>
              <Link
                href="/admin/ads"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                Ads
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
              <Link
                href="/admin/automation"
                className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
              >
                <Bot className="w-4 h-4" />
                Automation
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              View Site
            </Link>
            <AdminLogout />
          </div>
        </div>
      </div>
    </nav>
  )
}
