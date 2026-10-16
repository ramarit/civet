'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PricingCalculatorProps {
  competitors?: string[];
  showSavings?: boolean;
}

interface PricingTier {
  name: string;
  basePrice: number;
  pricePerLanguage: number;
  color: string;
}

const PRICING: Record<string, PricingTier> = {
  civet: {
    name: 'Civet',
    basePrice: 29,
    pricePerLanguage: 5,
    color: 'civet-purple-600',
  },
  weglot: {
    name: 'Weglot',
    basePrice: 99,
    pricePerLanguage: 12,
    color: 'warm-400',
  },
  lantis: {
    name: 'Lantis',
    basePrice: 79,
    pricePerLanguage: 10,
    color: 'warm-500',
  },
};

export function PricingCalculator({
  competitors = ['weglot', 'lantis'],
  showSavings = true,
}: PricingCalculatorProps) {
  const [languages, setLanguages] = useState(5);
  const [pageViews, setPageViews] = useState(50000);

  const calculatePrice = (tier: PricingTier, numLanguages: number) => {
    return tier.basePrice + tier.pricePerLanguage * (numLanguages - 1);
  };

  const civetPrice = calculatePrice(PRICING.civet, languages);
  const competitorPrices = competitors.map((comp) => ({
    name: PRICING[comp].name,
    price: calculatePrice(PRICING[comp], languages),
  }));

  const maxSaving = Math.max(...competitorPrices.map((c) => c.price - civetPrice));
  const savingsPercentage = Math.round((maxSaving / competitorPrices[0].price) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
          See How Much You'll Save
        </h3>
        <p className="text-xl text-warm-600">
          Calculate your costs with Civet vs. competitors
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-glow-purple p-8 border border-civet-purple-200">
        {/* Sliders */}
        <div className="space-y-8 mb-12">
          {/* Languages slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-warm-700">
                Number of Languages
              </label>
              <div className="text-2xl font-bold text-civet-purple-600">
                {languages}
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={languages}
              onChange={(e) => setLanguages(Number(e.target.value))}
              className="w-full h-3 bg-warm-200 rounded-full appearance-none cursor-pointer accent-civet-purple-600"
              style={{
                background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${(languages / 20) * 100}%, #E7E5E4 ${(languages / 20) * 100}%, #E7E5E4 100%)`,
              }}
              aria-label="Number of languages"
            />
            <div className="flex justify-between text-xs text-warm-500 mt-2">
              <span>1 language</span>
              <span>20 languages</span>
            </div>
          </div>

          {/* Page views slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-warm-700">
                Monthly Page Views
              </label>
              <div className="text-2xl font-bold text-civet-blue-600">
                {pageViews.toLocaleString()}
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={pageViews}
              onChange={(e) => setPageViews(Number(e.target.value))}
              className="w-full h-3 bg-warm-200 rounded-full appearance-none cursor-pointer accent-civet-blue-600"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((pageViews - 10000) / 490000) * 100}%, #E7E5E4 ${((pageViews - 10000) / 490000) * 100}%, #E7E5E4 100%)`,
              }}
              aria-label="Monthly page views"
            />
            <div className="flex justify-between text-xs text-warm-500 mt-2">
              <span>10K/mo</span>
              <span>500K/mo</span>
            </div>
          </div>
        </div>

        {/* Price comparison */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Civet */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative bg-gradient-to-br from-civet-purple-500 to-civet-blue-600 rounded-xl p-6 text-white shadow-glow-purple"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-civet-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              Best Value 🏆
            </div>
            <div className="text-sm font-medium opacity-90 mb-2">Civet</div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-bold">${civetPrice}</span>
              <span className="text-sm opacity-75">/month</span>
            </div>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <span className="text-civet-green-400">✓</span>
                <span>{languages} languages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-civet-green-400">✓</span>
                <span>Unlimited page views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-civet-green-400">✓</span>
                <span>70% cache hit rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-civet-green-400">✓</span>
                <span>Claude AI translations</span>
              </div>
            </div>
          </motion.div>

          {/* Competitors */}
          {competitorPrices.map((comp, index) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-warm-100 rounded-xl p-6 border-2 border-warm-200"
            >
              <div className="text-sm font-medium text-warm-600 mb-2">
                {comp.name}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold text-warm-900">
                  ${comp.price}
                </span>
                <span className="text-sm text-warm-600">/month</span>
              </div>
              <div className="space-y-2 text-sm text-warm-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>{languages} languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {pageViews >= 100000 ? 'Extra fees apply' : 'Limited page views'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✗</span>
                  <span className="line-through">Smart caching</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✗</span>
                  <span className="line-through">AI translations</span>
                </div>
              </div>

              {/* Difference indicator */}
              <div className="mt-4 pt-4 border-t border-warm-200">
                <div className="text-xs text-warm-600 mb-1">More expensive by</div>
                <div className="text-2xl font-bold text-red-600">
                  +${comp.price - civetPrice}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Savings summary */}
        {showSavings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-civet-green-500/10 to-civet-blue-500/10 rounded-xl p-6 border border-civet-green-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-warm-700 mb-1">
                  Your Annual Savings with Civet
                </div>
                <div className="text-4xl font-bold text-civet-green-600">
                  ${maxSaving * 12}/year
                </div>
                <div className="text-sm text-warm-600 mt-1">
                  That's {savingsPercentage}% less than {competitorPrices[0].name}
                </div>
              </div>
              <div className="text-6xl">💰</div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-civet-purple-600 hover:bg-civet-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-glow-purple"
          >
            Get Started for ${civetPrice}/month
            <span>→</span>
          </a>
          <p className="text-sm text-warm-600 mt-3">
            No credit card required • 14-day free trial
          </p>
        </motion.div>
      </div>
    </div>
  );
}
