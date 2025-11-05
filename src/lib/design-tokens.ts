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
 * Design Tokens - Centralized design system for Hansen Global Solutions
 * 
 * This file contains all design tokens used across the entire platform:
 * - Z-index hierarchy (prevents overlay conflicts)
 * - Color palette (brand consistency)
 * - Spacing system (visual rhythm)
 * - Typography (readability)
 * - Breakpoints (responsive design)
 * - Animations (smooth interactions)
 * - Shadows (depth hierarchy)
 * 
 * All modules (Hansen Security, CRM 2.0, Nora, Pengeplan, etc.) should
 * import and use these tokens for consistency.
 */

// ============================================
// Z-INDEX HIERARCHY
// ============================================
/**
 * Standardized z-index hierarchy to prevent overlay conflicts.
 * 
 * Usage:
 * ```tsx
 * import { Z_INDEX } from '@/lib/design-tokens'
 * <div className={`fixed z-[${Z_INDEX.NORA_CHAT}]`}>...</div>
 * ```
 * 
 * Or use Tailwind classes: z-background, z-content, z-navigation, etc.
 */
export const Z_INDEX = {
  BACKGROUND: 0,             // Particles, backgrounds, base layers
  CONTENT: 10,               // Page sections and main content
  NAVIGATION: 50,            // Navigation bar (always above content)
  DROPDOWN: 100,             // Dropdowns, menus, tooltips
  MODAL_BACKDROP: 200,       // Modal backdrops (below modals)
  MODAL: 300,                // Modals, dialogs (above backdrops)
  TOAST: 400,                // Toast notifications
  TOOLTIP: 500,              // Tooltips (above modals)
  THEME_TOGGLE: 600,         // Theme toggle button
  NORA_CHAT_BACKDROP: 700,   // Nora chat backdrop (mobile only)
  NORA_CHAT: 800,            // Nora chat window (ALWAYS TOP)
} as const

// Type for z-index values
export type ZIndexValue = typeof Z_INDEX[keyof typeof Z_INDEX]

// ============================================
// COLORS - Hansen Global Brand Palette
// ============================================
/**
 * Brand color palette used across all modules.
 * 
 * Primary: Purple (#7A5FFF) - Main brand color
 * Accent: Teal/Mint (#00FFC2) - Accent and highlights
 * Neutral: Gray scale for text and backgrounds
 */
export const COLORS = {
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
  // Semantic colors
  success: {
    500: '#10B981',
    600: '#059669',
  },
  error: {
    500: '#EF4444',
    600: '#DC2626',
  },
  warning: {
    500: '#F59E0B',
    600: '#D97706',
  },
  info: {
    500: '#3B82F6',
    600: '#2563EB',
  },
} as const

// ============================================
// SPACING SYSTEM
// ============================================
/**
 * Consistent spacing scale for margins, padding, gaps.
 * 
 * Based on 4px base unit (0.25rem).
 */
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
} as const

// ============================================
// TYPOGRAPHY
// ============================================
/**
 * Typography system for consistent text rendering.
 */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const

// ============================================
// BREAKPOINTS
// ============================================
/**
 * Responsive breakpoints for mobile-first design.
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================
// ANIMATION DURATIONS
// ============================================
/**
 * Standard animation durations for smooth, consistent interactions.
 */
export const ANIMATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '1000ms',
} as const

// ============================================
// SHADOWS
// ============================================
/**
 * Shadow system for depth hierarchy.
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Nora-specific glow effects
  nora: '0 20px 60px rgba(122, 95, 255, 0.4), 0 0 40px rgba(0, 255, 194, 0.2)',
  noraChat: '0 20px 60px rgba(122, 95, 255, 0.4), 0 0 40px rgba(0, 255, 194, 0.2)',
} as const

// ============================================
// BORDER RADIUS
// ============================================
/**
 * Consistent border radius for rounded corners.
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// ============================================
// EXPORTS
// ============================================
/**
 * Helper function to get z-index class name
 */
export function getZIndexClass(level: keyof typeof Z_INDEX): string {
  return `z-[${Z_INDEX[level]}]`
}

/**
 * Helper function to get z-index value
 */
export function getZIndexValue(level: keyof typeof Z_INDEX): number {
  return Z_INDEX[level]
}



