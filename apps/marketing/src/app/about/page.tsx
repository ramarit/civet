import type { Metadata } from 'next';
import { CTASection } from '@/components/shared/cta-section';
import { Globe, Target, Heart, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - Civet',
  description:
    'Learn about Civet mission to make the web multilingual. Founded in 2024, we are building the future of website translation.',
};

const values = [
  {
    name: 'Global by Default',
    description:
      'We believe every website should be accessible to everyone, regardless of language. The internet should be truly global.',
    icon: Globe,
  },
  {
    name: 'Quality First',
    description:
      'We never compromise on translation quality. Our multi-AI approach ensures the best possible translations for your content.',
    icon: Target,
  },
  {
    name: 'Customer Success',
    description:
      'Your success is our success. We are committed to helping you reach your international growth goals.',
    icon: Heart,
  },
  {
    name: 'Move Fast',
    description:
      'We ship features rapidly and iterate based on feedback. Our goal is to make website translation effortless.',
    icon: Zap,
  },
];

const team = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Co-founder',
    bio: 'Previously built internationalization at Stripe. Stanford CS.',
  },
  {
    name: 'Maria Garcia',
    role: 'CTO & Co-founder',
    bio: 'Ex-Google Translate engineer. PhD in NLP from MIT.',
  },
  {
    name: 'David Chen',
    role: 'Head of Product',
    bio: 'Former PM at Shopify. Built their multi-language features.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Growth',
    bio: 'Scaled SaaS companies from 0 to $10M ARR. Y Combinator alum.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Making the web multilingual
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            We are building the future of website translation. Our mission is to help
            every business reach global audiences with AI-powered translations that are
            fast, accurate, and affordable.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Story
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Civet was founded in 2024 by a team of engineers who experienced the pain
              of website translation firsthand. While building international products at
              companies like Google, Stripe, and Shopify, we saw that existing solutions
              were too expensive, too complex, and delivered mediocre quality.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The rise of large language models like Claude and GPT-4 presented a unique
              opportunity: we could finally deliver human-quality translations at machine
              speed and cost. So we built Civet - the translation platform we wished
              existed.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Today, we serve over 1,000 websites worldwide, translating millions of
              pages every day. We are profitable, growing fast, and just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.name}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-8"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {value.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We are a small team with big ambitions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {member.role}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-white sm:text-5xl">1,000+</div>
              <div className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
                Active Websites
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white sm:text-5xl">110+</div>
              <div className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
                Languages
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white sm:text-5xl">1M+</div>
              <div className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
                Daily Translations
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white sm:text-5xl">98%</div>
              <div className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
