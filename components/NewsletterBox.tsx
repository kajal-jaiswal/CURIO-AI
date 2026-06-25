'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import toast from 'react-hot-toast'

export function NewsletterBox() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const result = await subscribeNewsletter(email)
      if (!result.success) {
        toast.error(result.error || 'Something went wrong')
        return
      }
      setIsSuccess(true)
      setEmail('')
      toast.success('Successfully subscribed!')
      setTimeout(() => setIsSuccess(false), 5000)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Mail className="w-12 h-12 text-primary-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-dark-50 mb-2">Stay Updated</h2>
      <p className="text-dark-300 mb-6">Get the latest AI tools and insights delivered to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading || isSuccess}
        />
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSuccess ? (<><Check className="w-5 h-5" /> Subscribed</>) : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
