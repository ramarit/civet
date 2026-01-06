import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Civet</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Landing Pages for Professional Services
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create simple landing pages with multi-step intake forms, automatically score leads,
            and manage follow-up - all in one tool.
          </p>
          <Link
            href="/signup"
            className="inline-flex px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700"
          >
            Start Building Free
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Simple Page Builder
            </h3>
            <p className="text-gray-600">
              Create professional landing pages in minutes. No coding required.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-Step Forms
            </h3>
            <p className="text-gray-600">
              Build custom intake forms with multiple steps to collect detailed information.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lead Scoring
            </h3>
            <p className="text-gray-600">
              Automatically score leads based on their responses to prioritize follow-up.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lead Management
            </h3>
            <p className="text-gray-600">
              View all leads, add notes, and track status in a simple dashboard.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Built-in Email
            </h3>
            <p className="text-gray-600">
              Send follow-up emails directly from the dashboard. No external tools needed.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600">
              Track page views, form submissions, and conversion rates.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-blue-600 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to start collecting leads?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Create your free account and launch your first landing page in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Civet. Built for professional services.
          </p>
        </div>
      </footer>
    </div>
  );
}
