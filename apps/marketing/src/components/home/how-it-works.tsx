'use client';

import { motion } from 'framer-motion';
import { Code2, Wand2, Globe2 } from 'lucide-react';

const steps = [
  {
    name: 'Add Code Snippet',
    description: 'Copy-paste a single line of code into your website. Works with any platform or framework.',
    icon: Code2,
    time: '30 seconds',
  },
  {
    name: 'Auto-Translate with AI',
    description: 'Our AI scans your site and translates all content automatically. Review and edit as needed.',
    icon: Wand2,
    time: '1 minute',
  },
  {
    name: 'Go Live Globally',
    description: 'Publish your translations instantly. Watch visitors from around the world engage with your content.',
    icon: Globe2,
    time: '30 seconds',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
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
            Go global in 3 simple steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            From setup to going live in just 2 minutes. No technical expertise required.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 hidden lg:block" style={{ top: '80px' }} />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl">
                    <div className="flex flex-col items-center">
                      <Icon className="h-12 w-12 mb-2" />
                      <span className="text-sm font-medium">Step {index + 1}</span>
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div className="mt-4 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                    {step.time}
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Ready to get started?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Start Free Trial
          </a>
        </motion.div>
      </div>
    </section>
  );
}
