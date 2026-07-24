import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Maintenance Mode | Zyho Store',
  description: 'We are currently undergoing maintenance to improve our services. Thank you for your patience.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/media/maintenance.png"
            alt="Maintenance Illustration"
            width={600}
            height={400}
            className="w-full max-w-lg mx-auto h-auto object-contain"
            priority
            unoptimized
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Under Maintenance
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-2">
          We are currently improving our services to serve you better.
        </p>

        <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Thank you for your patience and understanding. We apologize for any inconvenience caused.
          Our team is working hard to bring you an even better shopping experience.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Why are we doing this?
          </h3>
          <p className="text-blue-700 text-sm">
            To enhance performance, add new features, and ensure the best possible experience for all our valued customers.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Refresh Page
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Zyho Store. All rights reserved.</p>
      </div>
    </div>
  )
}
