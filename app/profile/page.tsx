'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, LogOut, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
        )
    }

    if (!session?.user) {
        router.push('/login')
        return null
    }

    const user = session.user

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false })
            toast.success('Logged out successfully')
            router.push('/')
            router.refresh()
        } catch {
            toast.error('Failed to logout')
        }
    }

    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'admin': return { icon: '👑', label: 'Administrator', color: 'text-red-400' }
            case 'author': return { icon: '✍️', label: 'Author', color: 'text-green-400' }
            default: return { icon: '👁️', label: 'User', color: 'text-blue-400' }
        }
    }

    const roleInfo = getRoleInfo(user.role)

    return (
        <div className="min-h-screen bg-dark-950 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">My Profile</h1>
                    <p className="text-dark-400">Manage your account settings</p>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-dark-50 mb-1">{user.name || 'User'}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{roleInfo.icon}</span>
                                <span className={`font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                            <Mail className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500 mb-1">Email Address</p>
                                <p className="text-dark-200">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                            <Shield className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500 mb-1">Account Type</p>
                                <p className="text-dark-200">{roleInfo.label}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {(user.role === 'admin' || user.role === 'author') && (
                        <button
                            onClick={() => router.push(user.role === 'admin' ? '/admin' : '/author')}
                            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Go to {user.role === 'admin' ? 'Admin' : 'Author'} Dashboard
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-red-400 rounded-lg font-medium transition-colors border border-dark-700"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                <div className="mt-8 p-6 bg-dark-900 border border-dark-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-dark-50 mb-4">Your Capabilities</h3>
                    <ul className="space-y-2 text-sm text-dark-300">
                        {user.role === 'admin' && (
                            <>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Manage all users and content</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Create and manage advertisements</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> View advanced analytics</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Configure site settings</li>
                            </>
                        )}
                        {user.role === 'author' && (
                            <>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Create and publish blog posts</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Manage your own posts</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> View post analytics</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Moderate comments on your posts</li>
                            </>
                        )}
                        {user.role === 'user' && (
                            <>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Read and browse all posts</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Comment on posts</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Like posts</li>
                                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Subscribe to newsletter</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
