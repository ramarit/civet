import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This would normally come from a CMS or database
const getPost = (slug: string) => {
  const posts: Record<string, any> = {
    'how-to-translate-website': {
      title: 'How to Translate Your Website in 2 Minutes',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Tutorial',
      content: `
        <p>Translating your website doesn't have to be complicated or expensive. With Civet, you can have a fully multilingual website up and running in just 2 minutes. Here's how:</p>

        <h2>Step 1: Sign Up for Civet (30 seconds)</h2>
        <p>Head over to <a href="/signup">civet.io/signup</a> and create your free account. No credit card required for the 14-day trial.</p>

        <h2>Step 2: Add the Code Snippet (30 seconds)</h2>
        <p>After signing up, you'll receive a single line of JavaScript code. Add this to your website's <code>&lt;head&gt;</code> tag:</p>
        <pre><code>&lt;script src="https://cdn.civet.io/v1/civet.js" data-project-id="your-id"&gt;&lt;/script&gt;</code></pre>

        <h2>Step 3: Select Your Languages (30 seconds)</h2>
        <p>In your Civet dashboard, select which languages you want to translate to. We support 110+ languages including Spanish, French, German, Chinese, Japanese, and more.</p>

        <h2>Step 4: Let AI Do the Work (30 seconds)</h2>
        <p>Click "Auto-Translate" and our AI will automatically translate your entire website. You'll see a progress bar as pages are translated.</p>

        <h2>That's It!</h2>
        <p>Your translated website is now live. Visitors will see a language selector and can switch between languages instantly. The entire process takes less than 2 minutes.</p>

        <h2>Pro Tips</h2>
        <ul>
          <li>Use the visual editor to refine AI translations</li>
          <li>Set up custom glossaries for brand terms</li>
          <li>Enable SEO features for better rankings</li>
          <li>Track analytics to see which languages convert best</li>
        </ul>

        <h2>What Happens Next?</h2>
        <p>Civet automatically detects new content and updates. When you publish new pages or make changes, they're translated within minutes. You can also manually trigger translations anytime.</p>

        <h2>Ready to Get Started?</h2>
        <p>Try Civet free for 14 days. No credit card required. Translate your website in 2 minutes and start reaching global audiences today.</p>
      `,
    },
  };

  return posts[slug] || null;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Civet Blog`,
    description: post.content.substring(0, 155),
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Post Not Found
          </h1>
          <Link href="/blog" className="mt-4 inline-block">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to try Civet?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Translate your website in 2 minutes. Start your free trial today.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button
              size="xl"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
