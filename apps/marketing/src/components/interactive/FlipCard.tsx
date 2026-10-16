'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  before: {
    stat: string;
    label: string;
    icon: string;
    problem: string;
  };
  after: {
    stat: string;
    label: string;
    icon: string;
    improvement: string;
  };
  company?: {
    name: string;
    logo?: string;
    person: string;
    role: string;
  };
}

export function FlipCard({ before, after, company }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[400px] cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - Before */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-warm-100 border-2 border-warm-200 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full mb-4">
                <span>📉</span>
                <span>Before Civet</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{before.icon}</div>
                <div>
                  <div className="text-5xl font-bold text-warm-900 mb-1">
                    {before.stat}
                  </div>
                  <div className="text-sm text-warm-600">{before.label}</div>
                </div>
              </div>

              <p className="text-warm-700 leading-relaxed">{before.problem}</p>
            </div>

            {company && (
              <div className="flex items-center gap-3 pt-6 border-t border-warm-200">
                <div className="w-12 h-12 bg-warm-200 rounded-full flex items-center justify-center text-2xl">
                  {company.logo || '🏢'}
                </div>
                <div>
                  <div className="font-medium text-warm-900">{company.name}</div>
                  <div className="text-sm text-warm-600">
                    {company.person}, {company.role}
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 text-civet-purple-400 text-sm font-medium">
              Hover to see results →
            </div>
          </div>
        </div>

        {/* Back - After */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-civet-purple-500 to-civet-blue-600 rounded-2xl p-8 flex flex-col justify-between text-white shadow-glow-purple">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                <span>📈</span>
                <span>After Civet</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{after.icon}</div>
                <div>
                  <div className="text-5xl font-bold mb-1">{after.stat}</div>
                  <div className="text-sm opacity-90">{after.label}</div>
                </div>
              </div>

              <p className="leading-relaxed opacity-95">{after.improvement}</p>

              {/* Success indicators */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">✓</div>
                  <div className="text-xs mt-1 opacity-75">Fast Setup</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">✓</div>
                  <div className="text-xs mt-1 opacity-75">Better SEO</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">✓</div>
                  <div className="text-xs mt-1 opacity-75">More Sales</div>
                </div>
              </div>
            </div>

            {company && (
              <div className="flex items-center gap-3 pt-6 border-t border-white/20">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                  {company.logo || '🏢'}
                </div>
                <div>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm opacity-90">
                    {company.person}, {company.role}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function TestimonialFlipCards({
  beforeAfter = true,
  showMetrics = true,
}: {
  beforeAfter?: boolean;
  showMetrics?: boolean;
}) {
  const testimonials: FlipCardProps[] = [
    {
      before: {
        stat: '12 days',
        label: 'to launch in new market',
        icon: '😰',
        problem:
          'Manual translation was taking forever. We needed translators for each language, and coordination was a nightmare.',
      },
      after: {
        stat: '2 minutes',
        label: 'to go live globally',
        icon: '🚀',
        improvement:
          'With Civet, we launched in 8 new languages in just 2 minutes. Our international revenue grew 127% in 3 months.',
      },
      company: {
        name: 'TechFlow',
        person: 'Sarah Chen',
        role: 'Head of Growth',
      },
    },
    {
      before: {
        stat: '$2,400',
        label: 'monthly translation costs',
        icon: '💸',
        problem:
          'Weglot was eating our budget. We were paying per page view and the costs kept climbing with our growth.',
      },
      after: {
        stat: '$89',
        label: 'all-inclusive pricing',
        icon: '💰',
        improvement:
          'Switched to Civet and saved $27,732 in the first year. Better translations, unlimited page views, and 60% cheaper.',
      },
      company: {
        name: 'ShopGlobal',
        person: 'Marcus Johnson',
        role: 'CEO',
      },
    },
    {
      before: {
        stat: '2.4s',
        label: 'page load time',
        icon: '🐌',
        problem:
          'Our site was slow with old translation widget. International customers were bouncing because pages took too long to load.',
      },
      after: {
        stat: '0.2s',
        label: 'with smart caching',
        icon: '⚡',
        improvement:
          'Page speed improved 10x with Civet\'s caching. Bounce rate dropped 43% and conversions increased 89% for international visitors.',
      },
      company: {
        name: 'FastCommerce',
        person: 'Elena Rodriguez',
        role: 'CTO',
      },
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
          Real Results from Real Companies
        </h3>
        <p className="text-xl text-warm-600">
          Hover over the cards to see the transformation
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <FlipCard {...testimonial} />
          </motion.div>
        ))}
      </div>

      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-civet-purple-600 mb-2">
              1,000+
            </div>
            <div className="text-sm text-warm-600">Websites Translated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-civet-blue-600 mb-2">
              10M+
            </div>
            <div className="text-sm text-warm-600">Translations Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-civet-green-500 mb-2">
              127%
            </div>
            <div className="text-sm text-warm-600">Avg. Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-civet-purple-600 mb-2">
              99.9%
            </div>
            <div className="text-sm text-warm-600">Customer Satisfaction</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
