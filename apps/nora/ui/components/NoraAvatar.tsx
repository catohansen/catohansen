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

/**
 * Nora Avatar Component v12.0 - FLOWER OF LIFE - MINIMALISTISK
 * 
 * Flower of Life pattern med 7 overlappende sirkler
 * Tynne linjer med myk, pastell, iridescent gradient
 * Lys blå, teal, og hints av rosa/oransje
 * Ytre sirkel med myk, iridescent gradient
 * Minimalistisk og ethereal
 */

'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Flower of Life - Minimalistisk og ethereal
const FlowerOfLifeSphere = ({ className, isDark }: { className?: string; isDark: boolean }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flower of Life gradient - Myk, pastell, iridescent (lys blå, teal, rosa/oransje) */}
          <linearGradient id="flowerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#7DD3FC" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#60C5B5" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FBCFE8" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#FED7AA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.65" />
          </linearGradient>
          
          {/* Light mode gradient - Enda mykere pastell */}
          <linearGradient id="flowerGradientLight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A5D8FF" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#9ED5E8" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#7EC8C3" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F5C2E7" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#FFD5B8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C5E3FF" stopOpacity="0.65" />
          </linearGradient>
          
          {/* Outer circle gradient - Myk, iridescent (rosa, oransje, gul, grønn, blå) */}
          <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#FED7AA" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#86EFAC" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#7DD3FC" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.65" />
          </linearGradient>
          
          {/* Light mode outer gradient */}
          <linearGradient id="outerGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5C2E7" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#FFD5B8" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FFF4B8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#A5F3D0" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#9ED5E8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C5E3FF" stopOpacity="0.65" />
          </linearGradient>
          
          {/* Soft blur filter - For diffused, blurred lines */}
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Flower of Life Pattern - 7 overlappende sirkler */}
        {/* Sentrum sirkel */}
        <motion.circle
          cx="100"
          cy="100"
          r="20"
          fill="none"
          stroke={`url(#${isDark ? 'flowerGradient' : 'flowerGradientLight'})`}
          strokeWidth="1.5"
          opacity="0.9"
          filter="url(#softBlur)"
          animate={{
            opacity: [0.85, 0.95, 0.85]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* 6 sirkler rundt sentrum */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) - 90 // 60 graders intervaller, start på topp
          const centerDistance = 20 // Avstand mellom sentrene (radius av sentrumsirkel)
          const circleRadius = 20 // Samme radius som sentrumsirkel for perfekt overlap
          const cx = 100 + centerDistance * Math.cos((angle * Math.PI) / 180)
          const cy = 100 + centerDistance * Math.sin((angle * Math.PI) / 180)
          
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={circleRadius}
              fill="none"
              stroke={`url(#${isDark ? 'flowerGradient' : 'flowerGradientLight'})`}
              strokeWidth="1.5"
              opacity="0.9"
              filter="url(#softBlur)"
              animate={{
                opacity: [0.85, 0.95, 0.85]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2
              }}
            />
          )
        })}
        
        {/* Ytre sirkel - Myk, iridescent gradient (rosa, oransje, gul, grønn, blå) - MINDRE */}
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke={`url(#${isDark ? 'outerGradient' : 'outerGradientLight'})`}
          strokeWidth="2"
          opacity="0.9"
          filter="url(#glow)"
          animate={{
            opacity: [0.85, 0.95, 0.85],
            r: [50, 52, 50]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </svg>
    </div>
  )
}

export default function NoraAvatar({ 
  size = 256, 
  className = '' 
}: { 
  size?: number
  className?: string 
}) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const html = document.documentElement
      const isDarkMode = html.classList.contains('dark') || 
                        (!html.classList.contains('light') && 
                         window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDark(isDarkMode)
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Also listen to media query changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkTheme()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Core Nora Flower of Life - Minimalistisk og ethereal */}
      <motion.div
        className="relative z-10 rounded-full"
        style={{ width: size, height: size }}
        animate={{ 
          y: [0, -4, 0],
          scale: [1, 1.01, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.4 }
        }}
      >
        <FlowerOfLifeSphere className="w-full h-full" isDark={isDark} />
      </motion.div>
    </div>
  )
}
