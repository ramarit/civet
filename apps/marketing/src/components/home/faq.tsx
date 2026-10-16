'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does Civet compare to Weglot and other translation services?',
    answer:
      'Civet is 60% cheaper than Weglot while offering superior AI-powered translations. We support multiple AI models (Claude, GPT-4, DeepL) so you can choose the best one for your content. Our setup is faster, our translations are more accurate, and we include advanced features like analytics and team collaboration in all plans.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Setup takes just 2 minutes. Simply add a single line of code to your website, select your target languages, and our AI will automatically translate your entire site. No technical expertise required.',
  },
  {
    question: 'Will translations affect my SEO?',
    answer:
      'No, Civet is designed to boost your SEO. We automatically generate proper hreflang tags, localized meta tags, and SEO-friendly URLs. Many customers see improved rankings in international markets within weeks of launching.',
  },
  {
    question: 'Can I edit the AI translations?',
    answer:
      'Absolutely! Our visual editor lets you review and edit any translation in context. You can also invite team members or professional translators to collaborate. All changes are saved automatically.',
  },
  {
    question: 'What platforms does Civet support?',
    answer:
      'Civet works with any website platform - WordPress, Shopify, Webflow, custom HTML, React, Next.js, and more. As long as you can add a code snippet, Civet will work.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can translate your entire site and see the results before committing.',
  },
  {
    question: 'How do you handle updates to my website?',
    answer:
      'Civet automatically detects new and changed content on your site. New content is translated within minutes, and you are notified to review changes. You can also manually trigger translations anytime.',
  },
  {
    question: 'What kind of support do you offer?',
    answer:
      'All plans include email support with 24-hour response times. Professional and Business plans get priority support. Enterprise customers get dedicated account managers and SLA guarantees.',
  },
];

export function FAQ() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Everything you need to know about Civet.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 dark:border-gray-800 rounded-lg px-6 bg-white dark:bg-gray-800"
              >
                <AccordionTrigger className="text-left text-gray-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Still have questions?{' '}
            <a
              href="/contact"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
