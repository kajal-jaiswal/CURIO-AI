import type { Metadata } from 'next'
import { Target, Users, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Curio AI Blog and our mission to help jobs and small businesses leverage AI tools.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-50 mb-6">About Curio AI Blog</h1>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-dark-200 text-lg leading-relaxed mb-6">
            Welcome to Curio AI Blog, your trusted source for AI tools and insights designed specifically
            for jobs and small businesses. We understand that navigating the world of artificial intelligence
            can be overwhelming, which is why we're here to simplify it for you.
          </p>

          <p className="text-dark-200 text-lg leading-relaxed mb-6">
            Our mission is to help professionals and entrepreneurs discover, understand, and implement AI
            solutions that drive real results. We believe that AI shouldn't be reserved for tech giants—
            it should be accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <Target className="w-8 h-8 text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">Our Mission</h3>
            <p className="text-dark-300">
              To democratize AI tools and make them accessible to small businesses and professionals.
            </p>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <Users className="w-8 h-8 text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">Who We Serve</h3>
            <p className="text-dark-300">
              Small business owners, freelancers, and professionals looking to leverage AI for growth.
            </p>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <Lightbulb className="w-8 h-8 text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">What We Do</h3>
            <p className="text-dark-300">
              We review, test, and recommend the best AI tools with honest, actionable insights.
            </p>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-dark-50 mb-4">Why Trust Us?</h2>
          <ul className="space-y-3 text-dark-200">
            <li className="flex items-start">
              <span className="text-primary-400 mr-2">✓</span>
              <span>We test every tool we review</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-400 mr-2">✓</span>
              <span>Our reviews are unbiased and honest</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-400 mr-2">✓</span>
              <span>We focus on practical, real-world use cases</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-400 mr-2">✓</span>
              <span>We keep our content updated with the latest information</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
