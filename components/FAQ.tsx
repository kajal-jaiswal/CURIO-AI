'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What AI tools are best for small businesses?',
    answer: 'The best AI tools for small businesses include ChatGPT for content creation, Canva AI for design, Grammarly for writing, and various automation tools like Zapier. We review and recommend tools based on ease of use, cost-effectiveness, and ROI.',
  },
  {
    question: 'Are these AI tools free to use?',
    answer: 'Many AI tools offer free tiers with limited features, which are perfect for small businesses getting started. We highlight both free and paid options, always noting pricing and value propositions in our reviews.',
  },
  {
    question: 'How do I choose the right AI tool for my business?',
    answer: 'Consider your specific needs, budget, team size, and integration requirements. Our detailed reviews include use cases, pros and cons, and recommendations for different business types.',
  },
  {
    question: 'Do I need technical skills to use these tools?',
    answer: 'Most modern AI tools are designed for non-technical users with intuitive interfaces. We focus on tools that are user-friendly and provide step-by-step guides when needed.',
  },
  {
    question: 'How often do you update your reviews?',
    answer: 'We regularly update our reviews to reflect the latest features, pricing changes, and user feedback. Each review includes a "Last Updated" date so you know how current the information is.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-dark-50 mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-dark-800 transition-colors"
            >
              <span className="font-semibold text-dark-50 pr-4">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-dark-400 flex-shrink-0 transition-transform',
                  openIndex === index && 'transform rotate-180'
                )}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-dark-800">
                <p className="text-dark-300 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
