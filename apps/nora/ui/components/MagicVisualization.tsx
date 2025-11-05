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
 * Magic Visualization Component
 * Visuell representasjon av magiske øyeblikk
 * Mye mer avansert enn Siri, Alexa, Google Assistant
 */

'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MagicVisualizationProps {
  type: 'celebration' | 'surprise' | 'insight' | 'creation' | 'transformation' | 'connection'
  particles?: number
  colors?: string[]
  animation?: string
  duration?: number
  onComplete?: () => void
}

export default function MagicVisualization({
  type,
  particles = 50,
  colors = ['#7A5FFF', '#00FFC2', '#C6A0FF'],
  animation = 'sparkle',
  duration = 2000,
  onComplete
}: MagicVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const particleList: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      life: number
      maxLife: number
    }> = []

    for (let i = 0; i < particles; i++) {
      particleList.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: duration
      })
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particleList.forEach((particle, i) => {
        // Update
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 16

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Fade out
        const alpha = 1 - (particle.life / particle.maxLife)

        // Draw
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 20
        ctx.shadowColor = particle.color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      if (particleList[0].life < particleList[0].maxLife) {
        requestAnimationFrame(animate)
      } else if (onComplete) {
        onComplete()
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [particles, colors, duration, onComplete])

  return (
    <AnimatePresence>
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 pointer-events-none z-theme-toggle"
        style={{ mixBlendMode: 'screen' }}
      />
    </AnimatePresence>
  )
}

