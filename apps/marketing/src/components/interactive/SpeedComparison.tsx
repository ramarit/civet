'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SpeedComparisonProps {
  civetSpeed?: number;
  competitorSpeed?: number;
  showAnimation?: boolean;
}

export function SpeedComparison({
  civetSpeed = 200,
  competitorSpeed = 2000,
  showAnimation = true,
}: SpeedComparisonProps) {
  const [isRacing, setIsRacing] = useState(false);
  const [civetProgress, setCivetProgress] = useState(0);
  const [competitorProgress, setCompetitorProgress] = useState(0);

  const speedDifference = Math.round(((competitorSpeed - civetSpeed) / competitorSpeed) * 100);

  useEffect(() => {
    if (showAnimation) {
      const interval = setInterval(() => {
        setIsRacing(true);
        setCivetProgress(0);
        setCompetitorProgress(0);

        // Animate Civet progress
        const civetDuration = civetSpeed;
        const civetSteps = 60;
        const civetIncrement = 100 / civetSteps;
        let civetStep = 0;

        const civetInterval = setInterval(() => {
          civetStep++;
          setCivetProgress(Math.min(civetStep * civetIncrement, 100));
          if (civetStep >= civetSteps) {
            clearInterval(civetInterval);
          }
        }, civetDuration / civetSteps);

        // Animate competitor progress (slower)
        const competitorDuration = competitorSpeed;
        const competitorSteps = 60;
        const competitorIncrement = 100 / competitorSteps;
        let competitorStep = 0;

        const competitorInterval = setInterval(() => {
          competitorStep++;
          setCompetitorProgress(Math.min(competitorStep * competitorIncrement, 100));
          if (competitorStep >= competitorSteps) {
            clearInterval(competitorInterval);
            setIsRacing(false);
          }
        }, competitorDuration / competitorSteps);

        return () => {
          clearInterval(civetInterval);
          clearInterval(competitorInterval);
        };
      }, 5000);

      // Start first race immediately
      setIsRacing(true);

      return () => clearInterval(interval);
    }
  }, [showAnimation, civetSpeed, competitorSpeed]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
          See the Speed Difference
        </h3>
        <p className="text-xl text-warm-600">
          Civet is <span className="text-civet-purple-600 font-bold">{speedDifference}% faster</span> than competitors with intelligent caching
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Civet */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-civet-purple-500 to-civet-blue-600 rounded-2xl p-8 text-white shadow-glow-purple">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">Civet</div>
                <div className="text-4xl font-bold">{civetSpeed}ms</div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                ⚡
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${civetProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="mt-4 text-sm opacity-90">
              {civetProgress === 100 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Translation complete!</span>
                </div>
              ) : (
                <div>Translating with AI + Cache...</div>
              )}
            </div>

            {/* Cache hit indicator */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs opacity-75 mb-2">Cache Hit Rate</div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-civet-green-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: '70%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold">70%</div>
              </div>
            </div>
          </div>

          {/* Winner badge */}
          {civetProgress === 100 && competitorProgress < 100 && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute -top-4 -right-4 bg-civet-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg text-sm"
            >
              Winner! 🏆
            </motion.div>
          )}
        </motion.div>

        {/* Competitor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-warm-100 rounded-2xl p-8 border-2 border-warm-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-warm-600 mb-1">Competitor</div>
                <div className="text-4xl font-bold text-warm-900">{competitorSpeed}ms</div>
              </div>
              <div className="w-16 h-16 bg-warm-200 rounded-full flex items-center justify-center text-3xl">
                🐌
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 bg-warm-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-warm-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${competitorProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="mt-4 text-sm text-warm-600">
              {competitorProgress === 100 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Translation complete</span>
                </div>
              ) : (
                <div>Translating without cache...</div>
              )}
            </div>

            {/* Cache hit indicator */}
            <div className="mt-6 pt-6 border-t border-warm-200">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-warm-600 mb-2">Cache Hit Rate</div>
                  <div className="h-2 bg-warm-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-warm-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: '10%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold text-warm-900">10%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 grid md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 border border-warm-200 text-center">
          <div className="text-4xl font-bold text-civet-purple-600 mb-2">
            {speedDifference}%
          </div>
          <div className="text-sm text-warm-600">Faster</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-warm-200 text-center">
          <div className="text-4xl font-bold text-civet-blue-600 mb-2">
            70%
          </div>
          <div className="text-sm text-warm-600">Cache Hit Rate</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-warm-200 text-center">
          <div className="text-4xl font-bold text-civet-green-500 mb-2">
            99.9%
          </div>
          <div className="text-sm text-warm-600">Uptime</div>
        </div>
      </motion.div>
    </div>
  );
}
