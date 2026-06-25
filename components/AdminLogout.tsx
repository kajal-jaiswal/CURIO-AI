'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

export function AdminLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch {
      toast.error('Failed to logout')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-dark-300 hover:text-primary-400 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  )
}
