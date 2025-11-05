'use client'

import type { ReactNode } from 'react'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminCardProps {
  title?: string
  children: ReactNode
  className?: string
  color?: 'violet' | 'blue' | 'green' | 'orange' | 'purple' | 'white'
  hover?: boolean
  noHover?: boolean
}

export const AdminCard = React.memo(function AdminCard({ 
  title, 
  children, 
  className = '', 
  color = 'white',
  hover = true,
  noHover = false
}: AdminCardProps) {
  const colorClasses = {
    violet: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    blue: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    orange: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200',
    purple: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200',
    white: 'bg-white/80 backdrop-blur border-gray-200'
  }

  const hoverClasses = (hover && !noHover)
    ? 'hover:shadow-xl transition-all duration-200 transform hover:scale-105' 
    : ''

  return (
    <Card className={`${colorClasses[color]} shadow-lg ${hoverClasses} ${className}`}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? '' : 'p-6'}>
        {children}
      </CardContent>
    </Card>
  )
})
