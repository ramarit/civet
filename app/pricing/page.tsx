import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Civet
          </Link>
          <div className="space-x-4">
            <Link
              href="/pricing"
              className="text-gray-900 font-semibold"
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

      <main className="max-w-7xl mx-auto px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pay only for the languages you need. No hidden fees, no surprises.
            Start free and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Starter */}
          <div className="border-2 border-gray-200 rounded-xl p-8 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <p className="text-gray-500 mb-6">Perfect for small sites</p>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              $4.99
            </p>
            <p className="text-gray-500 mb-6">per language / month</p>
            <Link
              href="/dashboard"
              className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 mb-6"
            >
              Start Free Trial
            </Link>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Up to 5 languages</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">2,500 unique strings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">500 new translations/mo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">1 website</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Unlimited traffic</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Community support</span>
              </li>
            </ul>
          </div>

          {/* Professional */}
          <div className="border-2 border-blue-600 rounded-xl p-8 bg-white relative shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
            <p className="text-gray-500 mb-6">Best value for growing businesses</p>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              $3.99
            </p>
            <p className="text-gray-500 mb-6">per language / month</p>
            <Link
              href="/dashboard"
              className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 mb-6"
            >
              Start Free Trial
            </Link>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Up to 15 languages</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">5,000 unique strings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">1,000 new translations/mo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">3 websites</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Visual editor</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Team collaboration (5 users)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div className="border-2 border-gray-200 rounded-xl p-8 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
            <p className="text-gray-500 mb-6">For large-scale operations</p>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              $2.99
            </p>
            <p className="text-gray-500 mb-6">per language / month</p>
            <Link
              href="/dashboard"
              className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 mb-6"
            >
              Start Free Trial
            </Link>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Up to 50 languages</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">10,000 unique strings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">2,500 new translations/mo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">10 websites</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Custom glossary</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Priority support (24/7)</span>
              </li>
            </ul>
          </div>

          {/* Agency */}
          <div className="border-2 border-gray-200 rounded-xl p-8 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Agency</h3>
            <p className="text-gray-500 mb-6">For agencies and resellers</p>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              $99
            </p>
            <p className="text-gray-500 mb-6">flat / month</p>
            <Link
              href="/dashboard"
              className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 mb-6"
            >
              Start Free Trial
            </Link>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">25 websites</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">5 languages per site</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">10,000 strings per site</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">1,000 translations/site/mo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">White-label option</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Custom branding</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Dedicated support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How does the free trial work?
              </h3>
              <p className="text-gray-600">
                Start with any plan and try it free for 14 days. No credit card required.
                Cancel anytime during the trial with no charges.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What counts as a "unique string"?
              </h3>
              <p className="text-gray-600">
                A unique string is a piece of text on your website that needs translation.
                For example, "Contact Us" is one string. Repeated text only counts once.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! Upgrade or downgrade anytime. Changes take effect immediately,
                and we'll prorate your billing accordingly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                You'll receive email alerts at 80% and 90% usage. We'll automatically
                suggest upgrading if it's cheaper than overage fees. Service never stops unexpectedly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you offer custom enterprise plans?
              </h3>
              <p className="text-gray-600">
                Yes! Contact us for custom pricing on large-scale deployments,
                on-premise installations, or special requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-blue-600 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to start translating?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses going global with Civet. Start your free trial today.
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
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Civet. All pricing in USD. Taxes may apply.
          </p>
        </div>
      </footer>
    </div>
  );
}
