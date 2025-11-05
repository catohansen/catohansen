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
 * Particle Background Component - Shared
 * Animated particle effect for landing pages
 * Consolidated from src/components/ParticlesBackground.tsx and apps/nora/ui/components/ParticleBackground.tsx
 */

'use client'

import { useEffect, useRef } from 'react'
import { Z_INDEX } from '@/lib/design-tokens'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

interface ParticleBackgroundProps {
  particleCount?: number
  colors?: string[]
  enhanced?: boolean // Enhanced version with glow effects (default for Nora pages)
}

export default function ParticleBackground({ 
  particleCount = 50,
  colors = ['rgba(99, 102, 241, 0.3)'], // Default purple
  enhanced = false 
}: ParticleBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('Failed to get 2d context from canvas')
      return
    }

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Enhanced colors for Nora pages
    const enhancedColors = enhanced 
      ? ['#7A5FFF', '#C6A0FF', '#00FFC2', '#00D4FF', '#E8B4FF', '#86EFAC']
      : colors

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (enhanced ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (enhanced ? 0.3 : 0.5),
      size: enhanced ? Math.random() * 2.5 + 2 : Math.random() * 2 + 1,
      color: enhancedColors[Math.floor(Math.random() * enhancedColors.length)]
    }))

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        if (enhanced) {
          // Enhanced version with glow effects
          ctx.save()
          ctx.shadowBlur = 15
          ctx.shadowColor = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = 1.0
          ctx.fill()
          ctx.restore()
        } else {
          // Standard version
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = typeof particle.color === 'string' && particle.color.includes('rgba')
            ? particle.color
            : `rgba(99, 102, 241, 0.3)`
          ctx.fill()
        }

        // Draw connections
        const maxDistance = enhanced ? 150 : 150
        particlesRef.current.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = enhanced 
              ? particle.color 
              : `rgba(99, 102, 241, ${0.2 * (1 - distance / maxDistance)})`
            ctx.globalAlpha = enhanced 
              ? (1 - distance / maxDistance) * 0.8 
              : 0.2 * (1 - distance / maxDistance)
            ctx.lineWidth = enhanced ? 1.2 : 0.5
            if (enhanced) {
              ctx.shadowBlur = 10
              ctx.shadowColor = particle.color
            }
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      ctx.globalAlpha = 1
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particleCount, colors, enhanced])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-90 z-background"
      style={{ zIndex: Z_INDEX.BACKGROUND }}
    />
  )
}



