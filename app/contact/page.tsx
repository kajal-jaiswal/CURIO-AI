import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Curio AI Blog. We\'d love to hear from you!',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-50 mb-6">Contact Us</h1>
        <p className="text-lg text-dark-300 mb-8">
          Have a question, suggestion, or want to collaborate? We'd love to hear from you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <Mail className="w-6 h-6 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-dark-50 mb-2">Email</h3>
            <p className="text-dark-300">contact@curioai.com</p>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <MessageSquare className="w-6 h-6 text-primary-400 mb-3" />
            <h3 className="text-lg font-semibold text-dark-50 mb-2">Response Time</h3>
            <p className="text-dark-300">We typically respond within 24-48 hours</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
