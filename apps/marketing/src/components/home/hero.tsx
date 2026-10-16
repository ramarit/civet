'use client';

import { motion } from 'framer-motion';
import { TranslationDemo } from '@/components/interactive/TranslationDemo';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-purple-blue gradient-shift">
        {/* Morphing blob shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-civet-purple-600/20 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-civet-blue-600/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: '2s' }} />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-40 right-40 w-3 h-3 bg-white/20 rounded-full animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-20 w-5 h-5 bg-white/25 rounded-full animate-float-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 text-white font-medium shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-civet-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-civet-green-500" />
              </span>
              <span>Now with Claude AI - 70% faster with caching</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-display-lg md:text-display-xl text-white mb-6 leading-tight">
              Translate Your Website
              <br />
              <span className="text-shimmer">with AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Reach global audiences in 110+ languages.
              <br />
              <span className="font-semibold">Watch it work right now.</span>
            </p>
          </motion.div>

          {/* Interactive Translation Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <TranslationDemo languages={['es', 'fr', 'ja']} showFloatingBubbles />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://dashboard.civet.io/auth/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-civet-purple-600 font-bold text-lg rounded-xl shadow-float hover:shadow-glow-purple transition-all hover:-translate-y-1"
            >
              <span>Try It Free</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
            >
              <span>View Pricing</span>
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-center text-white/80 text-sm"
          >
            No credit card required • 14-day free trial • 2-minute setup
          </motion.div>
        </div>
      </div>

      {/* Diagonal divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0% 100%)' }} />
    </section>
  );
}
