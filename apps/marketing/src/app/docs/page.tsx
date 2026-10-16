import type { Metadata } from 'next';
import Link from 'next/link';
import { Book, Code, Rocket, Settings, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation - Civet',
  description: 'Learn how to use Civet to translate your website.',
};

const docSections = [
  {
    title: 'Getting Started',
    description: 'Quick start guides and tutorials',
    icon: Rocket,
    links: [
      { name: 'Quick Start', href: '/docs/quick-start' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Your First Translation', href: '/docs/first-translation' },
      { name: 'Best Practices', href: '/docs/best-practices' },
    ],
  },
  {
    title: 'Core Concepts',
    description: 'Understand how Civet works',
    icon: Book,
    links: [
      { name: 'How It Works', href: '/docs/how-it-works' },
      { name: 'AI Translation Models', href: '/docs/ai-models' },
      { name: 'Translation Memory', href: '/docs/translation-memory' },
      { name: 'SEO & Localization', href: '/docs/seo' },
    ],
  },
  {
    title: 'Features',
    description: 'Learn about all Civet features',
    icon: Zap,
    links: [
      { name: 'Visual Editor', href: '/docs/visual-editor' },
      { name: 'Glossaries', href: '/docs/glossaries' },
      { name: 'Analytics', href: '/docs/analytics' },
      { name: 'Team Collaboration', href: '/docs/collaboration' },
    ],
  },
  {
    title: 'API Reference',
    description: 'Integrate Civet programmatically',
    icon: Code,
    links: [
      { name: 'REST API', href: '/docs/api/rest' },
      { name: 'Webhooks', href: '/docs/api/webhooks' },
      { name: 'JavaScript SDK', href: '/docs/api/javascript' },
      { name: 'Authentication', href: '/docs/api/auth' },
    ],
  },
  {
    title: 'Integrations',
    description: 'Connect with your favorite tools',
    icon: Settings,
    links: [
      { name: 'WordPress', href: '/docs/integrations/wordpress' },
      { name: 'Shopify', href: '/docs/integrations/shopify' },
      { name: 'Webflow', href: '/docs/integrations/webflow' },
      { name: 'React/Next.js', href: '/docs/integrations/react' },
    ],
  },
  {
    title: 'Security & Privacy',
    description: 'How we keep your data safe',
    icon: Shield,
    links: [
      { name: 'Security Overview', href: '/docs/security' },
      { name: 'GDPR Compliance', href: '/docs/gdpr' },
      { name: 'Data Privacy', href: '/docs/privacy' },
      { name: 'SOC 2', href: '/docs/soc2' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about using Civet.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Search documentation..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-4">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {section.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Popular Guides
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/docs/quick-start"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Quick Start Guide
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Get your website translated in 2 minutes with this step-by-step guide.
              </p>
            </Link>

            <Link
              href="/docs/seo"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                SEO Best Practices
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Learn how to optimize your multilingual website for search engines.
              </p>
            </Link>

            <Link
              href="/docs/ai-models"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Choosing the Right AI Model
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Understand when to use Claude, GPT-4, or DeepL for best results.
              </p>
            </Link>

            <Link
              href="/docs/api/rest"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                API Reference
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Integrate Civet programmatically with our REST API.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Need help?
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-medium text-white hover:from-blue-700 hover:to-purple-700"
            >
              Contact Support
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
