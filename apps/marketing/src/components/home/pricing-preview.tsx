'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: 4.99,
    description: 'Perfect for small websites',
    features: [
      '1 language',
      '10,000 page views/month',
      'AI translation',
      'Visual editor',
      'SEO optimization',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: 3.99,
    description: 'For growing businesses',
    features: [
      '5 languages',
      '100,000 page views/month',
      'All AI models',
      'Priority support',
      'Custom domain',
      'Analytics',
      'API access',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Business',
    price: 2.99,
    description: 'For large sites',
    features: [
      'Unlimited languages',
      'Unlimited page views',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Team collaboration',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
];

export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Start free, scale as you grow. 60% cheaper than competitors.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                tier.featured
                  ? 'border-2 border-blue-600 shadow-xl scale-105'
                  : 'border border-gray-200 dark:border-gray-800'
              } bg-white dark:bg-gray-800 p-8`}
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
                    /language/month
                  </span>
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block mt-8">
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
            </motion.div>
          ))}
        </div>

        {/* View All Pricing Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/pricing"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View detailed pricing and comparison
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
