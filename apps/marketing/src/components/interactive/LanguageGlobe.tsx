'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  language: string;
  delay: number;
}

export function LanguageGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);

  const languages = [
    { name: 'Spanish', flag: '🇪🇸', x: 20, y: 50 },
    { name: 'French', flag: '🇫🇷', x: 50, y: 30 },
    { name: 'Japanese', flag: '🇯🇵', x: 80, y: 40 },
    { name: 'German', flag: '🇩🇪', x: 52, y: 35 },
    { name: 'Chinese', flag: '🇨🇳', x: 75, y: 45 },
    { name: 'Portuguese', flag: '🇵🇹', x: 30, y: 60 },
    { name: 'Arabic', flag: '🇸🇦', x: 60, y: 50 },
    { name: 'Russian', flag: '🇷🇺', x: 70, y: 30 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Generate connections
    const newConnections: Connection[] = languages.map((lang, i) => {
      const angle = (i / languages.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      return {
        from: { x: centerX, y: centerY },
        to: { x, y },
        language: lang.name,
        delay: i * 0.2,
      };
    });

    setConnections(newConnections);

    // Animate connections
    const interval = setInterval(() => {
      const randomLang = languages[Math.floor(Math.random() * languages.length)];
      setActiveLanguages((prev) => {
        const newActive = [...prev, randomLang.name];
        if (newActive.length > 3) newActive.shift();
        return newActive;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center dot
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#7C3AED';
    ctx.fill();

    // Draw connections
    connections.forEach((conn) => {
      const isActive = activeLanguages.includes(conn.language);

      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      ctx.strokeStyle = isActive
        ? 'rgba(124, 58, 237, 0.6)'
        : 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // Draw endpoint
      ctx.beginPath();
      ctx.arc(conn.to.x, conn.to.y, isActive ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#3B82F6' : '#E7E5E4';
      ctx.fill();
    });
  }, [connections, activeLanguages]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
          Connect with Global Audiences
        </h3>
        <p className="text-xl text-warm-600">
          Watch real-time translations happening around the world
        </p>
      </div>

      <div className="relative bg-gradient-to-br from-civet-purple-50 to-civet-blue-50 rounded-2xl p-8 border border-civet-purple-200">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto"
        />

        {/* Floating language labels */}
        <div className="absolute inset-0 pointer-events-none">
          {languages.map((lang, index) => {
            const angle = (index / languages.length) * Math.PI * 2;
            const distance = 45; // percentage
            const x = 50 + Math.cos(angle) * distance;
            const y = 50 + Math.sin(angle) * distance;
            const isActive = activeLanguages.includes(lang.name);

            return (
              <motion.div
                key={lang.name}
                className={`absolute flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-civet-purple-600 text-white shadow-glow-purple scale-110'
                    : 'bg-white text-warm-700 shadow-sm'
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 bg-civet-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-civet-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          Your Website
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-civet-purple-600">
              {activeLanguages.length}
            </div>
            <div className="text-xs text-warm-600">Active Now</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-civet-blue-600">110+</div>
            <div className="text-xs text-warm-600">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-civet-green-500">
              &lt;200ms
            </div>
            <div className="text-xs text-warm-600">Translation Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
