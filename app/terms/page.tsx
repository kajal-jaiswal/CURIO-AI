import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Curio AI Blog',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-50 mb-6">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-dark-200 space-y-6">
          <p className="text-sm text-dark-400">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using Curio AI Blog, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Curio AI Blog for personal,
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">User Content</h2>
            <p>
              By posting comments or other content on our website, you grant us a non-exclusive, royalty-free,
              perpetual license to use, modify, and display such content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Disclaimer</h2>
            <p>
              The materials on Curio AI Blog are provided on an 'as is' basis. We make no warranties, expressed
              or implied, and hereby disclaim all warranties including, without limitation, implied warranties
              of merchantability or fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Limitations</h2>
            <p>
              In no event shall Curio AI Blog or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit) arising out of the use or inability to use the
              materials on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-dark-50 mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
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
