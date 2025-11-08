/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Hero3D from '@/components/Hero3D';
import Navigation from '@/components/Navigation';

// Error boundary wrapper for each component
const ParticlesBackground = dynamic(() => import('@/components/ParticlesBackground'), { 
  ssr: false, 
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" />
});

const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { 
  ssr: false, 
  loading: () => null 
});

// Lazy load komponenter som ikke trengs umiddelbart
const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  loading: () => <div className="h-32 bg-transparent" />,
});

const ExpertiseSection = dynamic(() => import('@/components/ExpertiseSection'), {
  loading: () => <div className="h-96 bg-transparent" />,
});

const PortfolioSection = dynamic(() => import('@/components/PortfolioSection'), {
  loading: () => <div className="h-96 bg-transparent" />,
});

const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), {
  loading: () => <div className="h-96 bg-transparent" />,
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-transparent" />,
});

const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => <div className="h-96 bg-transparent" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-transparent" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" />}>
        <ParticlesBackground />
      </Suspense>
      
      <Suspense fallback={null}>
        <FloatingElements />
      </Suspense>
      
      <Suspense fallback={<nav className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-sm z-50" />}>
        <Navigation />
      </Suspense>
      
      <section id="hero" className="relative min-h-screen flex items-center justify-center z-10">
        <Suspense fallback={<div className="text-center"><h1 className="text-4xl font-bold">Laster...</h1></div>}>
          <Hero3D />
        </Suspense>
      </section>
      
      <Suspense fallback={<div className="h-32" />}>
        <StatsSection />
      </Suspense>
      
      <section id="expertise" className="section-padding relative z-10">
        <Suspense fallback={<div className="h-96" />}>
          <ExpertiseSection />
        </Suspense>
      </section>
      
      <section id="portfolio" className="section-padding relative z-10">
        <Suspense fallback={<div className="h-96" />}>
          <PortfolioSection />
        </Suspense>
      </section>
      
      <section id="pricing" className="section-padding relative z-10">
        <Suspense fallback={<div className="h-96" />}>
          <PricingCalculator />
        </Suspense>
      </section>
      
      <section id="testimonials" className="section-padding relative z-10">
        <Suspense fallback={<div className="h-96" />}>
          <TestimonialsSection />
        </Suspense>
      </section>
      
      <section id="contact" className="section-padding relative z-10">
        <Suspense fallback={<div className="h-96" />}>
          <ContactSection />
        </Suspense>
      </section>
      
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
