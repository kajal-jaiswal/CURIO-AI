'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function AdminLogout() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
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
