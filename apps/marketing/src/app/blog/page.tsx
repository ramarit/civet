import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog - Civet',
  description: 'Learn about website translation, internationalization, and global growth.',
};

const posts = [
  {
    title: 'How to Translate Your Website in 2 Minutes',
    slug: 'how-to-translate-website',
    excerpt:
      'A step-by-step guide to translating your website with AI. Learn how to set up Civet and go global in under 2 minutes.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Tutorial',
  },
  {
    title: 'SEO Best Practices for Multilingual Websites',
    slug: 'seo-multilingual-websites',
    excerpt:
      'Everything you need to know about hreflang tags, localized URLs, and ranking in international markets.',
    date: '2024-01-10',
    readTime: '8 min read',
    category: 'SEO',
  },
  {
    title: 'Claude vs GPT-4 vs DeepL: Which AI Translates Best?',
    slug: 'ai-translation-comparison',
    excerpt:
      'We tested the top AI translation models on 1,000 websites. Here are the results and when to use each one.',
    date: '2024-01-05',
    readTime: '10 min read',
    category: 'Research',
  },
  {
    title: 'Case Study: How SaaS Company Increased Revenue by 40%',
    slug: 'saas-revenue-case-study',
    excerpt:
      'Learn how a B2B SaaS company used Civet to expand to 5 new markets and increase MRR by $50k in 3 months.',
    date: '2024-01-01',
    readTime: '6 min read',
    category: 'Case Study',
  },
  {
    title: 'The Complete Guide to Website Localization',
    slug: 'website-localization-guide',
    excerpt:
      'Translation is just the beginning. Learn how to truly localize your website for international audiences.',
    date: '2023-12-20',
    readTime: '12 min read',
    category: 'Guide',
  },
  {
    title: 'Top 10 Markets for International Expansion in 2024',
    slug: 'top-markets-2024',
    excerpt:
      'Data-driven analysis of the best countries to expand to based on market size, competition, and growth potential.',
    date: '2023-12-15',
    readTime: '7 min read',
    category: 'Research',
  },
];

const categories = ['All', 'Tutorial', 'SEO', 'Research', 'Case Study', 'Guide'];

export default function BlogPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Learn about website translation, internationalization, and global growth.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Subscribe to our newsletter
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get the latest tips on website translation and international growth.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-white"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
