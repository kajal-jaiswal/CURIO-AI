'use client'

import { useState } from 'react'
import { Edit2, CheckCircle, XCircle, KeyRound, Copy } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface UserItem {
  id: string
  email: string
  full_name: string | null
  role: string
  is_active: boolean
  created_at: string
  posts_count: number
  comments_count: number
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  moderator: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  author: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  user: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export function UserManagementClient({ users: initial }: { users: UserItem[] }) {
  const [users, setUsers] = useState(initial)
  const [editing, setEditing] = useState<string | null>(null)
  const [resetLink, setResetLink] = useState<string | null>(null)

  const generateResetLink = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.resetUrl) {
        setResetLink(data.resetUrl)
        toast.success('Reset link generated')
      }
    } catch {
      toast.error('Failed to generate reset link')
    }
  }

  const updateUser = async (id: string, data: Partial<UserItem>) => {
    try {
      const res = await fetch('/api/admin/users/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setUsers(us => us.map(u => u.id === id ? { ...u, ...data } : u))
      toast.success('User updated')
      setEditing(null)
    } catch {
      toast.error('Failed to update user')
    }
  }

  return (
    <div className="space-y-4">
    {resetLink && (
      <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
        <KeyRound className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-300 mb-1">Password Reset Link (share with user):</p>
          <p className="text-xs text-dark-300 break-all">{resetLink}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(resetLink); toast.success('Copied!') }} className="p-1.5 text-primary-400 hover:bg-dark-800 rounded-lg transition-colors flex-shrink-0">
          <Copy className="w-4 h-4" />
        </button>
      </div>
    )}
    <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-800 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Role</th>
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Stats</th>
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-800">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-dark-800/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(u.full_name || u.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-dark-100 font-medium text-sm">{u.full_name || 'No name'}</p>
                    <p className="text-dark-500 text-xs">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {editing === u.id ? (
                  <select
                    defaultValue={u.role}
                    onChange={e => updateUser(u.id, { role: e.target.value })}
                    className="bg-dark-800 border border-dark-700 text-dark-100 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="author">Author</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={"px-2 py-1 rounded-lg text-xs font-semibold border " + (ROLE_COLORS[u.role] || ROLE_COLORS.user)}>
                    {u.role}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-xs text-dark-400">
                {u.posts_count} posts · {u.comments_count} comments
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-xs text-dark-500">
                {formatDate(u.created_at)}
              </td>
              <td className="px-4 py-3">
                <span className={"px-2 py-1 rounded-full text-xs font-medium " +
                  (u.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                  {u.is_active ? 'Active' : 'Banned'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(editing === u.id ? null : u.id)}
                    className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-dark-800 rounded-lg transition-colors"
                    title="Edit role"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                    className={"p-1.5 rounded-lg transition-colors " +
                      (u.is_active ? "text-dark-400 hover:text-red-400 hover:bg-dark-800" : "text-dark-400 hover:text-green-400 hover:bg-dark-800")}
                    title={u.is_active ? 'Ban user' : 'Activate user'}
                  >
                    {u.is_active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => generateResetLink(u.email)}
                    className="p-1.5 text-dark-400 hover:text-yellow-400 hover:bg-dark-800 rounded-lg transition-colors"
                    title="Generate password reset link"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
