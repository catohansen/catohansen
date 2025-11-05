'use client';

import dynamic from 'next/dynamic';
import Hero3D from '@/components/Hero3D';
import Navigation from '@/components/Navigation';
const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), { ssr: false, loading: () => <div className="fixed inset-0" /> });
const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { ssr: false, loading: () => <div /> });

// Lazy load komponenter som ikke trengs umiddelbart
const ExpertiseSection = dynamic(() => import('@/components/ExpertiseSection'), {
  loading: () => <div className="h-96" />,
});

const PortfolioSection = dynamic(() => import('@/components/PortfolioSection'), {
  loading: () => <div className="h-96" />,
});

const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  loading: () => <div className="h-32" />,
});

const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), {
  loading: () => <div className="h-96" />,
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96" />,
});

const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => <div className="h-96" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <FloatingElements />
      
      <Navigation />
      
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <Hero3D />
      </section>
      
      <StatsSection />
      
      <section id="expertise" className="section-padding relative z-10">
        <ExpertiseSection />
      </section>
      
      <section id="portfolio" className="section-padding relative z-10">
        <PortfolioSection />
      </section>
      
      <section id="pricing" className="section-padding relative z-10">
        <PricingCalculator />
      </section>
      
      <section id="testimonials" className="section-padding relative z-10">
        <TestimonialsSection />
      </section>
      
      <section id="contact" className="section-padding relative z-10">
        <ContactSection />
      </section>
      
      <Footer />
    </main>
  );
}

