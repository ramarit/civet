'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: 'Civet helped us expand to 12 new markets in just 3 months. The AI translations are incredibly accurate and the setup was painless.',
    author: 'Sarah Johnson',
    role: 'Head of Growth',
    company: 'TechStartup Inc',
    rating: 5,
  },
  {
    content: 'We switched from Weglot and cut our translation costs by 60% while getting better quality. The visual editor is a game-changer.',
    author: 'Michael Chen',
    role: 'CTO',
    company: 'E-commerce Co',
    rating: 5,
  },
  {
    content: 'The SEO optimization is fantastic. We are now ranking in Google.de and Google.fr for our main keywords. ROI is incredible.',
    author: 'Emma Williams',
    role: 'Marketing Director',
    company: 'SaaS Platform',
    rating: 5,
  },
  {
    content: 'Implementation took literally 2 minutes. The AI translations are so good we barely need to edit anything. Highly recommend!',
    author: 'David Rodriguez',
    role: 'Founder',
    company: 'Digital Agency',
    rating: 5,
  },
  {
    content: 'Best translation solution we have tried. The multi-AI approach means we can choose the best model for our industry-specific content.',
    author: 'Lisa Anderson',
    role: 'VP of Product',
    company: 'B2B Software',
    rating: 5,
  },
  {
    content: 'Customer support is excellent, pricing is fair, and the technology just works. We are reaching customers in 20+ countries now.',
    author: 'James Taylor',
    role: 'CEO',
    company: 'Media Company',
    rating: 5,
  },
];

export function Testimonials() {
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
            Loved by teams worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Join 1,000+ companies using Civet to reach global audiences.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-8"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
