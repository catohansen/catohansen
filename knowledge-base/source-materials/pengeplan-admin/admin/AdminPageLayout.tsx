'use client'

import type { ReactNode } from 'react'

interface AdminPageLayoutProps {
  title?: string
  description?: string
  children: ReactNode
  headerColor?: 'violet' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'pink' | 'rose' | 'indigo' | 'slate'
  showBubbles?: boolean
}

export function AdminPageLayout({ 
  title, 
  description, 
  children, 
  headerColor = 'violet',
  showBubbles = true 
}: AdminPageLayoutProps) {
  const headerColors = {
    violet: 'from-violet-600 to-purple-600',
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    orange: 'from-orange-600 to-red-600',
    purple: 'from-purple-600 to-indigo-600',
    red: 'from-red-600 to-pink-600',
    pink: 'from-pink-600 to-rose-600',
    rose: 'from-rose-600 to-pink-600',
    indigo: 'from-indigo-600 to-blue-600',
    slate: 'from-slate-600 to-gray-600'
  }

  const bubbleColors = {
    violet: {
      primary: 'from-violet-200/30 to-purple-200/30',
      secondary: 'from-indigo-200/20 to-blue-200/20',
      tertiary: 'from-purple-200/30 to-pink-200/20'
    },
    blue: {
      primary: 'from-blue-200/30 to-cyan-200/30',
      secondary: 'from-cyan-200/20 to-teal-200/20',
      tertiary: 'from-blue-200/30 to-indigo-200/20'
    },
    green: {
      primary: 'from-green-200/30 to-emerald-200/30',
      secondary: 'from-emerald-200/20 to-teal-200/20',
      tertiary: 'from-green-200/30 to-lime-200/20'
    },
    orange: {
      primary: 'from-orange-200/30 to-red-200/30',
      secondary: 'from-red-200/20 to-pink-200/20',
      tertiary: 'from-orange-200/30 to-yellow-200/20'
    },
    purple: {
      primary: 'from-purple-200/30 to-indigo-200/30',
      secondary: 'from-indigo-200/20 to-blue-200/20',
      tertiary: 'from-purple-200/30 to-violet-200/20'
    },
    red: {
      primary: 'from-red-200/30 to-pink-200/30',
      secondary: 'from-pink-200/20 to-rose-200/20',
      tertiary: 'from-red-200/30 to-orange-200/20'
    },
    pink: {
      primary: 'from-pink-200/30 to-rose-200/30',
      secondary: 'from-rose-200/20 to-pink-200/20',
      tertiary: 'from-pink-200/30 to-violet-200/20'
    },
    rose: {
      primary: 'from-rose-200/30 to-pink-200/30',
      secondary: 'from-pink-200/20 to-rose-200/20',
      tertiary: 'from-rose-200/30 to-red-200/20'
    },
    indigo: {
      primary: 'from-indigo-200/30 to-blue-200/30',
      secondary: 'from-blue-200/20 to-cyan-200/20',
      tertiary: 'from-indigo-200/30 to-purple-200/20'
    },
    slate: {
      primary: 'from-slate-200/30 to-gray-200/30',
      secondary: 'from-gray-200/20 to-slate-200/20',
      tertiary: 'from-slate-200/30 to-zinc-200/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Bubbles - Balanced Layout */}
      {showBubbles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Left Side Bubbles */}
          <div className={`absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br ${bubbleColors[headerColor].primary} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute left-20 top-40 w-64 h-64 bg-gradient-to-br ${bubbleColors[headerColor].secondary} rounded-full blur-2xl animate-pulse delay-1000`}></div>
          <div className={`absolute -bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br ${bubbleColors[headerColor].tertiary} rounded-full blur-3xl animate-pulse delay-2000`}></div>
          
          {/* Right Side Bubbles */}
          <div className={`absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br ${bubbleColors[headerColor].tertiary} rounded-full blur-3xl animate-pulse delay-500`}></div>
          <div className={`absolute right-16 top-60 w-48 h-48 bg-gradient-to-br ${bubbleColors[headerColor].secondary} rounded-full blur-2xl animate-pulse delay-1500`}></div>
          <div className={`absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br ${bubbleColors[headerColor].primary} rounded-full blur-2xl animate-pulse delay-3000`}></div>
          
          {/* Center Bubbles */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${bubbleColors[headerColor].primary} rounded-full blur-xl animate-pulse delay-700`}></div>
        </div>
      )}

      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C88FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      <div className="relative z-10 p-6">

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
