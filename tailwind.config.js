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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Z-INDEX HIERARCHY - Standardized z-index values
      zIndex: {
        'background': '0',
        'content': '10',
        'navigation': '50',
        'dropdown': '100',
        'modal-backdrop': '200',
        'modal': '300',
        'toast': '400',
        'tooltip': '500',
        'theme-toggle': '600',
        'nora-chat-backdrop': '700',
        'nora-chat': '800', // Always on top
      },
      // COLORS - Hansen Global Brand Palette
      colors: {
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7A5FFF', // Main brand color
          600: '#6B46F0',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B1E6D',
        },
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#00FFC2', // Main accent color
          600: '#00E0B2',
          700: '#0D9488',
          800: '#0F766E',
          900: '#134E4A',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        // Nora-specific colors
        nora: {
          purple: '#7A5FFF',
          teal: '#00FFC2',
          pink: '#C6A0FF',
          blue: '#7DD3FC',
          dark: {
            bg: '#0E0E16',
            surface: '#171721',
            surfaceLight: '#141420',
            border: '#24243A',
          },
        },
      },
      // SPACING SYSTEM
      spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
        '4xl': '6rem',    // 96px
        '5xl': '8rem',    // 128px
      },
      // SHADOWS
      boxShadow: {
        'nora': '0 20px 60px rgba(122, 95, 255, 0.4), 0 0 40px rgba(0, 255, 194, 0.2)',
        'nora-chat': '0 20px 60px rgba(122, 95, 255, 0.4), 0 0 40px rgba(0, 255, 194, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

