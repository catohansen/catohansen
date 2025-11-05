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

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const useTurbo = process.env.NEXT_USE_TURBO === '1'

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. We recommend fixing these warnings.
    ignoreDuringBuilds: true,
  },
  // output: 'export', // Disabled for admin panel with API routes
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Nødvendig for statisk export
  },
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  // Only include compiler options in production; omit entirely in dev (better Turbopack compat)
  ...(isProd ? { compiler: { removeConsole: true } } : {}),
  // Optimaliser bundle size
  webpack: (config, { isServer }) => {
    // Skip all webpack customizations when using Turbopack
    if (useTurbo) return config
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      
      // Tree shaking optimization for client bundles
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    // Fix Prisma Client for Next.js - Externalize to avoid bundling issues
    if (isServer) {
      // Externalize Prisma Client so it's loaded at runtime, not bundled
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@prisma/client')
        config.externals.push('.prisma/client')
      } else {
        config.externals = [config.externals, '@prisma/client', '.prisma/client']
      }
    }
    
    // Ignore knowledge-base source materials from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/knowledge-base/source-materials/**'],
    };
    
    return config;
  },
  
  // Exclude knowledge-base source materials from build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

