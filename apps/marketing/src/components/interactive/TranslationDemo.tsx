'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', demo: 'Hola, mundo' },
  { code: 'fr', name: 'French', flag: '🇫🇷', demo: 'Bonjour, monde' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', demo: 'こんにちは、世界' },
  { code: 'de', name: 'German', flag: '🇩🇪', demo: 'Hallo, Welt' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', demo: '你好，世界' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', demo: 'Olá, mundo' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', demo: 'Ciao, mondo' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', demo: 'Привет, мир' },
];

const DEMO_PHRASES = [
  { en: 'Hello, world', es: 'Hola, mundo', fr: 'Bonjour, monde', ja: 'こんにちは、世界', de: 'Hallo, Welt', zh: '你好，世界' },
  { en: 'Welcome to our site', es: 'Bienvenido a nuestro sitio', fr: 'Bienvenue sur notre site', ja: '私たちのサイトへようこそ', de: 'Willkommen auf unserer Seite', zh: '欢迎来到我们的网站' },
  { en: 'Get started today', es: 'Comience hoy', fr: 'Commencez aujourd\'hui', ja: '今日から始めましょう', de: 'Heute beginnen', zh: '今天开始' },
];

interface TranslationDemoProps {
  languages?: string[];
  showFloatingBubbles?: boolean;
}

export function TranslationDemo({ languages = ['es', 'fr', 'ja'], showFloatingBubbles = true }: TranslationDemoProps) {
  const [inputText, setInputText] = useState('Hello, world');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [floatingBubbles, setFloatingBubbles] = useState<typeof LANGUAGES>([]);

  useEffect(() => {
    // Select random languages for floating bubbles
    if (showFloatingBubbles) {
      const shuffled = [...LANGUAGES].sort(() => Math.random() - 0.5);
      setFloatingBubbles(shuffled.slice(0, 6));
    }
  }, [showFloatingBubbles]);

  useEffect(() => {
    // Cycle through demo phrases
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % DEMO_PHRASES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value.trim()) {
      setIsTranslating(true);
      setTimeout(() => setIsTranslating(false), 800);
    }
  };

  const selectedLanguages = LANGUAGES.filter((lang) => languages.includes(lang.code));
  const currentPhrase = DEMO_PHRASES[currentPhraseIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Floating language bubbles */}
      {showFloatingBubbles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingBubbles.map((lang, index) => (
            <motion.div
              key={lang.code}
              className="absolute bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.6, 0.8, 0.6],
                scale: [1, 1.1, 1],
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
              style={{
                top: `${10 + index * 15}%`,
                left: `${index % 2 === 0 ? 10 + index * 5 : 80 - index * 5}%`,
              }}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.name}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main translation input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-glow-purple p-8 border border-civet-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-civet-purple-50 rounded-lg">
              <span className="text-2xl">🌍</span>
              <span className="text-sm font-medium text-civet-purple-700">English</span>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-civet-purple-500"
            >
              →
            </motion.div>
            <div className="flex items-center gap-2 px-4 py-2 bg-civet-blue-500 text-white rounded-lg">
              <span className="text-sm font-medium">110+ Languages</span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type anything to see Civet in action..."
              className="w-full px-6 py-4 text-lg rounded-xl border-2 border-warm-200 focus:border-civet-purple-500 focus:outline-none transition-colors"
              aria-label="Text to translate"
            />
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-civet-purple-600"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-civet-purple-600 border-t-transparent rounded-full"
                  />
                  Translating...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Translated results */}
          <div className="mt-6 space-y-3">
            {selectedLanguages.map((lang, index) => {
              const translatedText = currentPhrase[lang.code as keyof typeof currentPhrase] || lang.demo;

              return (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-civet-purple-50 to-civet-blue-50 rounded-lg group hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-warm-600 mb-1">
                      {lang.name}
                    </div>
                    <motion.div
                      key={translatedText}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg font-medium text-warm-900"
                    >
                      {translatedText}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-civet-green-500"
                  >
                    ✓
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Real-time translation indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-warm-600"
          >
            <div className="w-2 h-2 bg-civet-green-500 rounded-full animate-pulse-glow" />
            Powered by Claude AI • Translated in &lt;200ms
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex items-center justify-center gap-8 text-white/90 text-sm"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-civet-green-500 rounded-full"
          />
          <span>10M+ translations</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <span>110+ languages</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <span>70% faster with caching</span>
        </div>
      </motion.div>
    </div>
  );
}
