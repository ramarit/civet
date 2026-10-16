'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Search,
  Edit,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';

const features = [
  {
    name: 'Multi-AI Translation',
    description: 'Choose between Claude, GPT-4, and DeepL for the best translation quality in your industry.',
    icon: Bot,
  },
  {
    name: 'SEO Optimized',
    description: 'Automatic meta tags, hreflang tags, and URL localization to rank in every market.',
    icon: Search,
  },
  {
    name: 'Visual Editor',
    description: 'Edit translations in context with our intuitive visual editor. No technical skills needed.',
    icon: Edit,
  },
  {
    name: 'Lightning Fast',
    description: 'Smart caching and CDN delivery ensure your translated pages load instantly worldwide.',
    icon: Zap,
  },
  {
    name: 'Analytics & Insights',
    description: 'Track user engagement, conversion rates, and ROI for each language market.',
    icon: BarChart3,
  },
  {
    name: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption. Your content is always secure.',
    icon: Shield,
  },
];

export function Features() {
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
            Everything you need to go global
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Powerful features that make website translation simple, fast, and effective.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
                  {/* Icon */}
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
