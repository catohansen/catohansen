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
 * Document Viewer - Revolutionary Interactive Documentation
 * 
 * Features:
 * - Interactive documentation tree
 * - PDF viewer
 * - Code viewer with syntax highlighting
 * - Markdown renderer
 * - Live code examples
 * - Navigation
 * - Bookmarks
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Folder,
  FolderOpen,
  Code2,
  BookOpen,
  Eye,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  Maximize2,
  BookMarked,
  Search,
  Download
} from 'lucide-react'

interface DocumentNode {
  title: string
  description?: string
  path: string
  type: 'file' | 'folder'
  children?: DocumentNode[]
  readTime?: string
  featured?: boolean
  icon?: any
}

interface DocumentViewerProps {
  documentTree?: { [key: string]: DocumentNode[] }
}

export default function DocumentViewer({ documentTree }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const toggleBookmark = (path: string) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(path)) {
      newBookmarks.delete(path)
    } else {
      newBookmarks.add(path)
    }
    setBookmarks(newBookmarks)
  }

  const loadDocument = async (path: string) => {
    setLoading(true)
    setSelectedDoc(path)
    setContent(null)

    try {
      // Check if path is a document ID (from knowledge base)
      const isDocumentId = path.startsWith('doc:')
      const docId = isDocumentId ? path.replace('doc:', '') : null

      if (docId) {
        // Fetch from Knowledge Base API
        const response = await fetch(`/api/knowledge-base/documents?id=${encodeURIComponent(docId)}`, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.doc) {
            setContent(data.doc.fullText || data.doc.chunks.map((c: any) => c.content).join('\n\n'))
          } else {
            setContent('Dokumentet ikke funnet.')
          }
        } else {
          setContent('Kunne ikke laste dokumentet.')
        }
      } else {
        // Try to read as file path (code file)
        const response = await fetch(`/api/knowledge-base/code?path=${encodeURIComponent(path)}`, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setContent(data.data.content)
          } else {
            setContent('Filen ikke funnet.')
          }
        } else {
          setContent('Kunne ikke laste filen.')
        }
      }
    } catch (error) {
      console.error('Error loading document:', error)
      setContent('Kunne ikke laste dokumentet.')
    } finally {
      setLoading(false)
    }
  }

  const renderNode = (node: DocumentNode, level = 0): JSX.Element => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedDoc === node.path
    const isBookmarked = bookmarks.has(node.path)
    
    if (node.type === 'folder') {
      return (
        <div key={node.path} className={level > 0 ? 'ml-4' : ''}>
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
              ${isSelected ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'}
            `}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )}
            <span className="font-medium flex-1">{node.title}</span>
            {node.children && (
              <span className="text-xs text-gray-500">({node.children.length})</span>
            )}
          </div>
          {isExpanded && node.children && (
            <div className="mt-1">
              {node.children.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    const Icon = node.icon || FileText
    
    return (
      <div
        key={node.path}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
          ${isSelected ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'hover:bg-gray-100 text-gray-700'}
          ${level > 0 ? 'ml-4' : ''}
        `}
        onClick={() => loadDocument(node.path)}
      >
        <Icon className="w-4 h-4 text-purple-500" />
        <span className="font-medium flex-1">{node.title}</span>
        {node.featured && (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        )}
        {isBookmarked && (
          <BookMarked className="w-4 h-4 text-blue-500 fill-blue-500" />
        )}
        {node.readTime && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {node.readTime}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleBookmark(node.path)
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <BookMarked
            className={`w-4 h-4 ${isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
    )
  }

  const defaultTree: { [key: string]: DocumentNode[] } = {
    '📚 System Documentation': [
      {
        title: '📖 Architecture Overview',
        description: 'Komplett oversikt over systemarkitektur',
        path: 'docs/architecture/overview.md',
        type: 'file',
        readTime: '15 min',
        featured: true,
        icon: BookOpen
      },
      {
        title: '🔐 Security Documentation',
        description: 'Hansen Security og RBAC dokumentasjon',
        path: 'docs/security/rbac.md',
        type: 'file',
        readTime: '20 min',
        featured: true,
        icon: FileText
      }
    ],
    '💻 Code Examples': [
      {
        title: 'Hansen Security API',
        path: 'code-examples/hansen-security.ts',
        type: 'file',
        icon: Code2
      },
      {
        title: 'User Management',
        path: 'code-examples/user-management.ts',
        type: 'file',
        icon: Code2
      }
    ]
  }

  const tree = documentTree || defaultTree

  return (
    <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-2'} gap-6 h-[800px]`}>
      {/* Document Tree */}
      <div className={`glass rounded-xl p-6 overflow-hidden flex flex-col ${isFullscreen ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Documentation</h3>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {Object.entries(tree).map(([category, nodes]) => (
            <div key={category} className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 px-2">{category}</h4>
              {nodes.map(node => renderNode(node))}
            </div>
          ))}
        </div>
      </div>

      {/* Document Content */}
      <div className="glass rounded-xl p-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {selectedDoc || 'Select a document'}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
            {selectedDoc && (
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Laster dokument...</p>
              </div>
            </div>
          ) : content ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                {content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Velg et dokument fra listen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





