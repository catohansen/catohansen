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
 * Admin Top Menu
 * Header with search, notifications, and profile
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  Menu,
  MessageCircle
} from 'lucide-react'

interface AdminTopMenuProps {
  sidebarCollapsed: boolean
  onMobileMenuToggle?: () => void
}

export default function AdminTopMenu({ sidebarCollapsed, onMobileMenuToggle }: AdminTopMenuProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Logout failed:', error)
      window.location.href = '/admin/login'
    }
  }

  return (
    <header
      className={`
        fixed top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 
        px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300
        left-0 right-0
        lg:left-64 lg:right-0
        ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
      `}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">Cato Hansen Agency</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Administration</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Ask Nora Button - PHASE 2 */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('openNoraChat')
                window.dispatchEvent(event)
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
            title="Spør Nora om hjelp"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Nora</span>
          </button>

          {/* Search - Click to open Command Palette */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                // Trigger CMD+K via custom event
                window.dispatchEvent(new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  bubbles: true
                }))
              }}
              className="w-48 md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left text-gray-500 hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
            >
              <div className="flex items-center">
                <Search className="absolute left-3 text-gray-400 w-4 h-4" />
                <span className="ml-6 hidden lg:inline">Søk eller trykk ⌘K...</span>
                <span className="ml-6 lg:hidden">Søk...</span>
              </div>
              <kbd className="hidden md:inline-flex px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </button>
          </div>
          
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              }))
            }}
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-dropdown">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Varsler</h3>
                  <p className="text-sm text-gray-600">Administrasjonsvarsler</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">Ingen nye varsler</p>
                    <p className="text-xs mt-1">Varsler vil vises her når de kommer</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                CH
              </div>
              <span className="text-sm font-medium hidden sm:inline">Cato Hansen</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-dropdown">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      CH
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cato Hansen</p>
                      <p className="text-sm text-gray-600">cato@catohansen.no</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <a href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3" />
                    Min profil
                  </a>
                  <a href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-3" />
                    Innstillinger
                  </a>
                  <a href="/admin/security" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Shield className="h-4 w-4 mr-3" />
                    Sikkerhet
                  </a>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logg ut
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

