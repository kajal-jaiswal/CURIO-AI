'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [resetUrl, setResetUrl] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed')
            // Store reset URL in state to display if no email service configured
            if (data.resetUrl) setResetUrl(data.resetUrl)
            setSent(true)
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-dark-50 mb-2">Reset Password</h1>
                    <p className="text-dark-300">We&apos;ll help you regain access</p>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 shadow-xl">
                    {sent ? (
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-dark-50 mb-2">Reset Link Generated</h2>
                            <p className="text-dark-300 mb-4">
                                A password reset link has been created for <span className="text-primary-400">{email}</span>.
                                {' '}It expires in 24 hours.
                            </p>
                            {resetUrl && (
                                <div className="mb-5 p-3 bg-dark-800 rounded-lg text-left">
                                    <p className="text-xs text-dark-400 mb-1">Your reset link:</p>
                                    <a href={resetUrl} className="text-primary-400 text-xs break-all hover:underline">{resetUrl}</a>
                                </div>
                            )}
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : (<>Send Reset Request <ArrowRight className="w-5 h-5" /></>)}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="text-primary-400 hover:text-primary-300 text-sm">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
