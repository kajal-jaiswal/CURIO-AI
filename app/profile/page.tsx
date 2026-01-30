'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Shield, LogOut, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UserProfile } from '@/lib/types'

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)

    if (!supabase) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Missing</h1>
                    <p className="text-dark-300">
                        Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
                    </p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
            }
        } catch (error) {
            console.error('Error loading profile:', error)
            toast.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
            router.push('/')
            router.refresh()
        } catch (error) {
            toast.error('Failed to logout')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950">
                <div className="text-center">
                    <p className="text-dark-300 mb-4">Profile not found</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'admin':
                return { icon: '👑', label: 'Administrator', color: 'text-red-400' }
            case 'author':
                return { icon: '✍️', label: 'Author', color: 'text-green-400' }
            default:
                return { icon: '👁️', label: 'User', color: 'text-blue-400' }
        }
    }

    const roleInfo = getRoleInfo(profile.role)

    return (
        <div className="min-h-screen bg-dark-950 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-50 mb-2">My Profile</h1>
                    <p className="text-dark-400">Manage your account settings</p>
                </div>

                {/* Profile Card */}
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 mb-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-dark-50 mb-1">
                                {profile.full_name || 'User'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{roleInfo.icon}</span>
                                <span className={`font-medium ${roleInfo.color}`}>
                                    {roleInfo.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                            <Mail className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500 mb-1">Email Address</p>
                                <p className="text-dark-200">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                            <Shield className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500 mb-1">Account Type</p>
                                <p className="text-dark-200">{roleInfo.label}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-lg">
                            <User className="w-5 h-5 text-dark-400" />
                            <div>
                                <p className="text-xs text-dark-500 mb-1">Member Since</p>
                                <p className="text-dark-200">
                                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {profile.bio && (
                            <div className="p-4 bg-dark-800 rounded-lg">
                                <p className="text-xs text-dark-500 mb-2">Bio</p>
                                <p className="text-dark-200">{profile.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    {/* Dashboard Link */}
                    {(profile.role === 'admin' || profile.role === 'author') && (
                        <button
                            onClick={() => router.push(profile.role === 'admin' ? '/admin' : '/author')}
                            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Go to {profile.role === 'admin' ? 'Admin' : 'Author'} Dashboard
                        </button>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-red-400 rounded-lg font-medium transition-colors border border-dark-700"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

                {/* Capabilities */}
                <div className="mt-8 p-6 bg-dark-900 border border-dark-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-dark-50 mb-4">Your Capabilities</h3>
                    <ul className="space-y-2 text-sm text-dark-300">
                        {profile.role === 'admin' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Manage all users and content
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Create and manage advertisements
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> View advanced analytics
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Configure site settings
                                </li>
                            </>
                        )}
                        {profile.role === 'author' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Create and publish blog posts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Manage your own posts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> View post analytics
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Moderate comments on your posts
                                </li>
                            </>
                        )}
                        {profile.role === 'user' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Read and browse all posts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Comment on posts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Like posts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span> Subscribe to newsletter
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
