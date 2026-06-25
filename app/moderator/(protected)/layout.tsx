import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, MessageSquare, FileText, Home, LogOut } from 'lucide-react'
import { AdminLogout } from '@/components/AdminLogout'

export const dynamic = 'force-dynamic'

export default async function ModeratorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!['admin', 'moderator'].includes(session.user.role as string)) redirect('/')

  return (
    <div className="flex min-h-screen bg-dark-950">
      <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-dark-50">Moderator</span>
          </div>
          <p className="text-xs text-dark-500 mt-1">{session.user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/moderator" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors text-sm">
            <Shield className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/moderator/comments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors text-sm">
            <MessageSquare className="w-4 h-4" /> Comments
          </Link>
          <Link href="/moderator/posts" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors text-sm">
            <FileText className="w-4 h-4" /> Post Queue
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors text-sm">
            <Home className="w-4 h-4" /> View Site
          </Link>
        </nav>
        <div className="p-4 border-t border-dark-800">
          <AdminLogout />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
