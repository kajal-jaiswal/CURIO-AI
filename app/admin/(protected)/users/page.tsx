import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'
import { UserManagementClient } from '@/components/UserManagementClient'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      is_active: true,
      created_at: true,
      _count: { select: { posts: true, comments: true } },
    },
  })

  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    moderator: users.filter(u => u.role === 'moderator').length,
    author: users.filter(u => u.role === 'author').length,
    user: users.filter(u => u.role === 'user').length,
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-7 h-7 text-primary-400" />
        <div>
          <h1 className="text-3xl font-bold text-dark-50">User Management</h1>
          <p className="text-dark-400 text-sm mt-0.5">{users.length} total users</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Admins', count: roleCounts.admin, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Moderators', count: roleCounts.moderator, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Authors', count: roleCounts.author, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Users', count: roleCounts.user, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(r => (
          <div key={r.label} className={"bg-dark-900 border border-dark-800 rounded-xl p-4 " + r.bg.replace('bg-', 'border-').replace('/10', '/20')}>
            <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">{r.label}</p>
            <p className={"text-3xl font-bold " + r.color}>{r.count}</p>
          </div>
        ))}
      </div>

      <UserManagementClient users={users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        is_active: u.is_active,
        created_at: u.created_at.toISOString(),
        posts_count: u._count.posts,
        comments_count: u._count.comments,
      }))} />
    </div>
  )
}
