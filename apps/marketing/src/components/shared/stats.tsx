'use client';

import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/utils';

const stats = [
  { name: 'Active Websites', value: '1,000+' },
  { name: 'Languages Supported', value: '110+' },
  { name: 'Translations Per Day', value: '1M+' },
  { name: 'Customer Satisfaction', value: '98%' },
];

export function Stats() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 sm:text-base">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
