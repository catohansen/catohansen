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
 * Badge Component
 * Status badge for displaying module status
 */

'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  return (
    <span className={`
      px-2 py-1 text-xs font-semibold rounded-full border
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}



