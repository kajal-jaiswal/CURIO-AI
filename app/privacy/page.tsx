import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Curio AI Blog',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-50 mb-6">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-dark-200 space-y-6">
          <p className="text-sm text-dark-400">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Introduction</h2>
            <p>
              At Curio AI Blog, we respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you visit
              our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address (when subscribing to our newsletter)</li>
              <li>Name and email (when leaving comments)</li>
              <li>Contact information (when using our contact form)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Respond to your inquiries and comments</li>
              <li>Improve our website and services</li>
              <li>Analyze website usage and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Data Storage</h2>
            <p>
              Your data is stored securely using Supabase, which provides enterprise-grade security and
              compliance with GDPR and other data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="/contact" className="text-primary-400 hover:text-primary-300">
                our contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
