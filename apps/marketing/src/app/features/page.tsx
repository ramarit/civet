import type { Metadata } from 'next';
import {
  Bot,
  Search,
  Edit,
  Zap,
  BarChart3,
  Shield,
  Users,
  Code,
  Globe,
  Sparkles,
  Languages,
  TrendingUp,
} from 'lucide-react';
import { CTASection } from '@/components/shared/cta-section';

export const metadata: Metadata = {
  title: 'Features - Civet',
  description:
    'Explore all Civet features: Multi-AI translation, SEO optimization, visual editor, analytics, and more.',
};

const features = [
  {
    name: 'Multi-AI Translation',
    description:
      'Choose between Claude, GPT-4, and DeepL for the best translation quality. Each AI model has unique strengths - Claude excels at creative content, GPT-4 at technical documentation, and DeepL at European languages.',
    icon: Bot,
    benefits: [
      'Access to 3+ leading AI models',
      'Industry-specific optimization',
      'Continuous quality improvements',
      'Fallback models for reliability',
    ],
  },
  {
    name: 'SEO Optimization',
    description:
      'Rank in every market with automatic SEO best practices. We handle hreflang tags, meta tag localization, URL structure, and sitemap generation so you can focus on content.',
    icon: Search,
    benefits: [
      'Automatic hreflang tags',
      'Localized meta descriptions',
      'SEO-friendly URLs',
      'Multilingual sitemaps',
      'Schema markup translation',
    ],
  },
  {
    name: 'Visual Editor',
    description:
      'Edit translations in context with our intuitive visual editor. See exactly how your translations look on the live site. No technical skills required - if you can use Google Docs, you can use Civet.',
    icon: Edit,
    benefits: [
      'In-context editing',
      'Real-time preview',
      'Bulk editing tools',
      'Revision history',
      'Collaborative editing',
    ],
  },
  {
    name: 'Translation Caching',
    description:
      'Lightning-fast page loads with intelligent caching. Once a page is translated, it is served instantly from our global CDN. Updates are detected automatically and re-translated within minutes.',
    icon: Zap,
    benefits: [
      'Global CDN delivery',
      'Sub-100ms response times',
      'Automatic cache invalidation',
      'Edge caching',
    ],
  },
  {
    name: 'Analytics & Insights',
    description:
      'Track engagement, conversion rates, and ROI for each language. Understand which markets perform best and optimize your international strategy with data-driven insights.',
    icon: BarChart3,
    benefits: [
      'Language-specific analytics',
      'Conversion tracking',
      'User engagement metrics',
      'ROI calculator',
      'A/B testing support',
    ],
  },
  {
    name: 'Enterprise Security',
    description:
      'Your content is always secure with SOC 2 compliance, end-to-end encryption, and regular security audits. We never share your data with third parties.',
    icon: Shield,
    benefits: [
      'SOC 2 Type II certified',
      'End-to-end encryption',
      'GDPR compliant',
      'Regular security audits',
      'Data residency options',
    ],
  },
  {
    name: 'Team Collaboration',
    description:
      'Work together with your team, translators, and stakeholders. Assign roles, manage permissions, and collaborate in real-time on translations.',
    icon: Users,
    benefits: [
      'Role-based permissions',
      'Translator workflows',
      'Comment threads',
      'Approval workflows',
      'Activity logs',
    ],
  },
  {
    name: 'API Access',
    description:
      'Integrate Civet with your existing tools and workflows. Our REST API and webhooks let you automate translation workflows and build custom integrations.',
    icon: Code,
    benefits: [
      'RESTful API',
      'Webhook support',
      'SDK libraries',
      'OpenAPI documentation',
      'Rate limiting',
    ],
  },
  {
    name: '110+ Languages',
    description:
      'Reach audiences worldwide with support for 110+ languages. From major languages like Spanish and Chinese to regional dialects and rare languages.',
    icon: Globe,
    benefits: [
      '110+ languages supported',
      'Regional dialect support',
      'RTL language support',
      'Non-Latin alphabets',
    ],
  },
  {
    name: 'Translation Memory',
    description:
      'Save time and money with translation memory. Previously translated phrases are automatically reused, ensuring consistency and reducing costs.',
    icon: Sparkles,
    benefits: [
      'Automatic phrase matching',
      'Consistency across pages',
      'Cost savings on updates',
      'Import/export TM',
    ],
  },
  {
    name: 'Glossary Management',
    description:
      'Maintain brand consistency with custom glossaries. Define how specific terms, product names, and branded phrases should be translated.',
    icon: Languages,
    benefits: [
      'Custom term management',
      'Brand name protection',
      'Context-aware suggestions',
      'Bulk import/export',
    ],
  },
  {
    name: 'Continuous Improvement',
    description:
      'Our AI models improve over time. We continuously update our translation engines, add new features, and optimize performance based on user feedback.',
    icon: TrendingUp,
    benefits: [
      'Regular model updates',
      'Feature improvements',
      'Performance optimization',
      'User feedback integration',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Powerful features for global growth
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to translate your website, reach new markets, and grow
            your international revenue.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={feature.name}
                  className={`grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Icon & Title */}
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {feature.name}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {feature.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start text-gray-600 dark:text-gray-300"
                        >
                          <span className="mr-2 text-blue-600">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image/Visual */}
                  <div
                    className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  >
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Icon className="h-24 w-24 text-blue-600 dark:text-blue-400 opacity-50" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
