'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { mockLogin, MOCK_AUTH_ENABLED, MOCK_USERS } from '@/lib/mock-auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (MOCK_AUTH_ENABLED) {
                // Use mock authentication
                const user = mockLogin(formData.email, formData.password)
                
                toast.success('Welcome back!')

                // Redirect based on role
                if (user.role === 'admin') {
                    router.push('/admin')
                } else if (user.role === 'author') {
                    router.push('/author')
                } else {
                    router.push('/')
                }
                router.refresh()
            } else {
                // Use Supabase (future implementation)
                toast.error('Supabase not configured')
            }
        } catch (error: any) {
            console.error('Login error:', error)
            toast.error(error.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-dark-50 mb-2">
                        Welcome to <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Curio AI</span>
                    </h1>
                    <p className="text-dark-300">Sign in to your account</p>
                </div>

                {/* Form Card */}
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 shadow-xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-700 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-dark-400">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Login Info */}
                    <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-dark-700">
                        <p className="text-xs text-dark-400 mb-2">Demo Accounts (if using mock mode):</p>
                        <div className="space-y-1 text-xs">
                            <p className="text-dark-300">👁️ User: user@demo.com / password</p>
                            <p className="text-dark-300">✍️ Author: author@demo.com / password</p>
                            <p className="text-dark-300">👑 Admin: admin@curioai.com / password</p>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-dark-400 text-sm">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-dark-400 hover:text-dark-300 text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
