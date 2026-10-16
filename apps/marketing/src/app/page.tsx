import { Hero } from '@/components/home/hero';
import { SpeedComparison } from '@/components/interactive/SpeedComparison';
import { LanguageGlobe } from '@/components/interactive/LanguageGlobe';
import { TestimonialFlipCards } from '@/components/interactive/FlipCard';
import { Features } from '@/components/home/features';
import { HowItWorks } from '@/components/home/how-it-works';
import { FAQ } from '@/components/home/faq';
import { CTASection } from '@/components/shared/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Speed Comparison Section */}
      <section className="py-24 bg-white">
        <SpeedComparison civetSpeed={200} competitorSpeed={2000} showAnimation />
      </section>

      {/* Language Globe Section */}
      <section className="py-24 bg-gradient-to-b from-warm-50 to-white">
        <LanguageGlobe />
      </section>

      {/* Features */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials with Flip Cards */}
      <section className="py-24 bg-gradient-to-b from-warm-50 to-white">
        <TestimonialFlipCards beforeAfter showMetrics />
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <CTASection />
    </>
  );
}
