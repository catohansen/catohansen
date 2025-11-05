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

import { motion } from 'framer-motion';
import { Sparkles, Rocket, Brain, Code2, Eye } from 'lucide-react';

function FloatingIcons() {
  const icons = [
    { Icon: Brain, delay: 0 },
    { Icon: Code2, delay: 0.5 },
    { Icon: Rocket, delay: 1 },
    { Icon: Sparkles, delay: 1.5 },
  ];

  return (
    <>
      {icons.map(({ Icon, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
            y: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-8 h-8 text-purple-500" />
        </motion.div>
      ))}
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-20 sm:py-0">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 relative">
          {/* Glassmorfisme bakgrunn for bedre lesbarhet */}
          <div className="absolute inset-0 -z-10 glass rounded-3xl blur-3xl opacity-30" />
          
          <div>
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-purple-600 mb-4 shadow-lg">
              AI & LLM Ekspert • Systemarkitekt • Webdesigner • Enterprise Solutions Builder
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold drop-shadow-lg px-4">
            <span className="gradient-text">Cato Hansen</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto font-medium drop-shadow-sm px-4">
            Jeg bygger <span className="font-bold text-purple-600">enterprise-grade moduler</span>, 
            designer <span className="font-bold text-blue-600">skalerbare løsninger</span>, 
            og leverer <span className="font-bold text-pink-600">produksjonsklare systemer</span> som kan selges som separate produkter
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-8 px-4">
            <a
              href="/hansen-hub"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto touch-manipulation text-center hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Se Hansen Hub
            </a>
            <a
              href="/admin/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto touch-manipulation hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              View Admin Demo
            </a>
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 glass rounded-full font-semibold text-sm sm:text-base w-full sm:w-auto touch-manipulation hover:shadow-lg transition-all"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start et Prosjekt
            </button>
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 glass rounded-full font-semibold text-sm sm:text-base w-full sm:w-auto touch-manipulation hover:shadow-lg transition-all"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Se Portefølje
            </button>
          </div>
        </div>
      </div>
      
      <FloatingIcons />
      
      {/* Lett gradient bakgrunn i stedet for tung 3D */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-50/30 to-pink-100/50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );
}

