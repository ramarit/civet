import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CTASection } from '@/components/shared/cta-section';
import { PricingCalculator } from '@/components/interactive/PricingCalculator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - Civet',
  description:
    'Simple, transparent pricing. Start at $4.99/language/month. 60% cheaper than competitors. 14-day free trial.',
};

const tiers = [
  {
    name: 'Starter',
    price: 4.99,
    description: 'Perfect for small websites and blogs',
    features: {
      included: [
        '1 language',
        '10,000 page views/month',
        'AI translation (Claude)',
        'Visual editor',
        'SEO optimization',
        'Email support (48h)',
        'Translation caching',
        'Language switcher widget',
      ],
      notIncluded: [
        'Multiple AI models',
        'Custom domain',
        'Analytics',
        'API access',
      ],
    },
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: 3.99,
    description: 'For growing businesses',
    features: {
      included: [
        'Up to 5 languages',
        '100,000 page views/month',
        'All AI models (Claude, GPT-4, DeepL)',
        'Visual editor',
        'SEO optimization',
        'Priority support (24h)',
        'Translation caching',
        'Custom domain',
        'Analytics dashboard',
        'API access',
        'Glossary management',
        'Translation memory',
      ],
      notIncluded: [
        'Unlimited languages',
        'Dedicated support',
        'Custom integrations',
      ],
    },
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Business',
    price: 2.99,
    description: 'For high-traffic websites',
    features: {
      included: [
        'Unlimited languages',
        'Unlimited page views',
        'All AI models',
        'Visual editor',
        'Advanced SEO features',
        'Priority support (12h)',
        'Translation caching',
        'Custom domain',
        'Advanced analytics',
        'API access',
        'Glossary management',
        'Translation memory',
        'Team collaboration (10 users)',
        'Workflow automation',
        'Custom integrations',
      ],
      notIncluded: [
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment',
      ],
    },
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For agencies managing multiple clients',
    priceNote: '/month (unlimited sites)',
    features: {
      included: [
        'Unlimited websites',
        'Unlimited languages',
        'Unlimited page views',
        'All AI models',
        'White-label solution',
        'Dedicated account manager',
        'Priority support (4h)',
        'SLA guarantee (99.9%)',
        'All Business features',
        'Team collaboration (unlimited)',
        'Client portal access',
        'Reseller pricing',
        'Custom branding',
        'Priority feature requests',
      ],
      notIncluded: [],
    },
    cta: 'Contact Sales',
    featured: false,
  },
];

const faqs = [
  {
    question: 'How does the page view limit work?',
    answer:
      'A page view is counted each time a translated page is loaded. If you exceed your plan limit, we will notify you and you can upgrade. We never stop serving your translations.',
  },
  {
    question: 'Can I change plans anytime?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you will be charged a prorated amount. When downgrading, the change takes effect at your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can pay via invoice.',
  },
  {
    question: 'Is there a setup fee?',
    answer:
      'No setup fees. No hidden costs. You only pay the monthly subscription fee based on your chosen plan.',
  },
  {
    question: 'What happens when I cancel?',
    answer:
      'You can cancel anytime. Your translations will remain active until the end of your billing period. You can export all your translations before canceling.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes! Pay annually and get 2 months free (17% discount). Contact sales for multi-year discounts.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-civet-purple-50 via-white to-civet-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-warm-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-warm-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start free, scale as you grow.
            <span className="font-semibold text-civet-purple-600"> 60% cheaper than competitors.</span>
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-civet-purple-100 px-4 py-2 text-sm font-medium text-civet-purple-700">
            <span>14-day free trial • No credit card required</span>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator */}
      <section className="py-24 bg-gradient-to-b from-warm-50 to-white">
        <PricingCalculator competitors={['weglot', 'lantis']} showSavings />
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl ${
                  tier.featured
                    ? 'border-2 border-blue-600 shadow-xl lg:scale-105'
                    : 'border border-gray-200 dark:border-gray-800'
                } bg-white dark:bg-gray-800 p-8 ${tier.featured ? 'lg:row-span-1' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {tier.description}
                  </p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {tier.priceNote || '/language/month'}
                    </span>
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {tier.features.included.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {tier.features.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start opacity-50">
                      <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="ml-3 text-sm text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.cta === 'Contact Sales' ? '/contact' : '/signup'}
                  className="block mt-8"
                >
                  <Button
                    className={`w-full ${
                      tier.featured
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : ''
                    }`}
                    variant={tier.featured ? 'default' : 'outline'}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Compare all features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier.name}
                      className="py-4 px-4 text-center text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    Languages
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    1
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Up to 5
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Unlimited
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    Page Views
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    10,000/mo
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    100,000/mo
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Unlimited
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    AI Models
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-blue-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-blue-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Pricing FAQ
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 bg-white dark:bg-gray-800"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
