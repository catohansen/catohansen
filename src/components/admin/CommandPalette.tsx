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
 * Command Palette Component
 * CMD+K (⌘K) search functionality for admin panel
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Home,
  Users,
  FolderKanban,
  FileText,
  Briefcase,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  Shield,
  X,
  Command
} from 'lucide-react'

interface Command {
  id: string
  title: string
  description: string
  href: string
  icon: any
  category: string
  keywords?: string[]
}

const commands: Command[] = [
  // Navigation
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Go to main dashboard',
    href: '/admin',
    icon: Home,
    category: 'Navigation',
    keywords: ['home', 'main', 'overview']
  },
  {
    id: 'content',
    title: 'Content Management',
    description: 'Manage pages, sections, and media',
    href: '/admin/content',
    icon: FileText,
    category: 'Content',
    keywords: ['pages', 'sections', 'media', 'cms']
  },
  {
    id: 'clients',
    title: 'Clients',
    description: 'Manage clients and customer data',
    href: '/admin/clients',
    icon: Users,
    category: 'CRM',
    keywords: ['customers', 'people', 'contacts']
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Manage projects and tasks',
    href: '/admin/projects',
    icon: FolderKanban,
    category: 'Projects',
    keywords: ['tasks', 'work', 'portfolio']
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Manage portfolio items',
    href: '/admin/portfolio',
    icon: Briefcase,
    category: 'Content',
    keywords: ['showcase', 'cases', 'work']
  },
  {
    id: 'billing',
    title: 'Billing & Invoices',
    description: 'Manage invoices and payments',
    href: '/admin/billing',
    icon: CreditCard,
    category: 'Finance',
    keywords: ['invoices', 'payments', 'money', 'revenue']
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'View analytics and reports',
    href: '/admin/analytics',
    icon: BarChart3,
    category: 'Analytics',
    keywords: ['stats', 'metrics', 'reports', 'data']
  },
  {
    id: 'ai',
    title: 'AI Studio',
    description: 'AI prompts and automation',
    href: '/admin/ai',
    icon: Bot,
    category: 'AI',
    keywords: ['prompts', 'automation', 'agents']
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Security settings and users',
    href: '/admin/security',
    icon: Shield,
    category: 'Settings',
    keywords: ['users', 'roles', 'permissions', '2fa']
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'System settings',
    href: '/admin/settings',
    icon: Settings,
    category: 'Settings',
    keywords: ['config', 'preferences', 'options']
  }
]

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower))
    )
  })

  // Handle CMD+K (⌘K) shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearch('')
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault()
          handleCommandSelect(filteredCommands[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filteredCommands, selectedIndex])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleCommandSelect = (cmd: Command) => {
    router.push(cmd.href)
    setIsOpen(false)
    setSearch('')
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && e.target instanceof Element) {
        const target = e.target as HTMLElement
        if (!target.closest('[data-command-palette]')) {
          setIsOpen(false)
          setSearch('')
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-[20vh]" data-command-palette>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative z-modal w-full max-w-2xl mx-4" data-command-palette>
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            />
            <div className="flex items-center space-x-2 ml-3">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleCommandSelect(cmd)}
                      className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                    >
                      <Icon className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{cmd.title}</div>
                        <div className="text-sm text-gray-500">{cmd.description}</div>
                      </div>
                      <span className="text-xs text-gray-400 px-2">{cmd.category}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Command className="h-3 w-3 mr-1" />
                <span>K</span>
                <span className="ml-1">to open</span>
              </span>
              <span className="flex items-center">
                <span>↑↓</span>
                <span className="ml-1">to navigate</span>
              </span>
              <span className="flex items-center">
                <span>↵</span>
                <span className="ml-1">to select</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

