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
              href="/pricing"
              className="text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
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
            Translate Your Website with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Reach global audiences with AI-powered translation in 110+ languages.
            Simple integration, powerful results.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href="/dashboard"
              className="inline-flex px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="inline-flex px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            60% cheaper than Weglot • No credit card required • 2-minute setup
          </p>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-AI Translation
            </h3>
            <p className="text-gray-600">
              Claude, GPT-4, and DeepL work together to deliver the highest quality translations for every language pair.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              2-Minute Setup
            </h3>
            <p className="text-gray-600">
              Add one line of code to your website. Translations start working instantly with our smart caching system.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              SEO Optimized
            </h3>
            <p className="text-gray-600">
              Dedicated URLs for each language (/en/, /fr/) with proper hreflang tags for maximum search visibility.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Visual Editor
            </h3>
            <p className="text-gray-600">
              Click any text to edit translations directly. Perfect for brand voice and marketing copy.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pay Per Language
            </h3>
            <p className="text-gray-600">
              Starting at $4.99/month per language. Unlimited traffic, unlimited changes, no hidden fees.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-Time Analytics
            </h3>
            <p className="text-gray-600">
              Track translation usage, cache performance, and visitor languages with our built-in dashboard.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $4.99<span className="text-lg text-gray-500">/lang/mo</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Up to 5 languages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">2,500 unique strings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Unlimited traffic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Community support</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="border-2 border-blue-600 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $3.99<span className="text-lg text-gray-500">/lang/mo</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Up to 15 languages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">5,000 unique strings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Visual editor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Email support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Team collaboration</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business */}
            <div className="border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $2.99<span className="text-lg text-gray-500">/lang/mo</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Up to 50 languages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">10,000 unique strings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">Custom glossary</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8">
            <Link href="/pricing" className="text-blue-600 hover:underline">
              View all plans and features →
            </Link>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-blue-600 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to go global?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses translating their websites with Civet. No credit card required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100"
          >
            Start Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/ramarit/civet" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Civet</h4>
              <p className="text-gray-600 text-sm">
                AI-powered website translation for global businesses.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Civet. Built with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
