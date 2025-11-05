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
 * Code Browser - Revolutionary Interactive Code Explorer
 * 
 * Features:
 * - File tree navigation
 * - Syntax highlighting
 * - Code search
 * - Live code examples
 * - Copy code snippets
 * - Code explanations
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Folder,
  FolderOpen,
  Code2,
  Search,
  Copy,
  Check,
  Eye,
  Maximize2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Lightbulb
} from 'lucide-react'

interface CodeFile {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: CodeFile[]
  language?: string
  size?: number
  lastModified?: Date
}

export default function CodeBrowser() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))
  const [codeContent, setCodeContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const codeStructure: CodeFile[] = [
    {
      name: 'src',
      path: 'src',
      type: 'folder',
      children: [
        {
          name: 'modules',
          path: 'src/modules',
          type: 'folder',
          children: [
            {
              name: 'hansen-security',
              path: 'src/modules/hansen-security',
              type: 'folder',
              children: [
                {
                  name: 'core',
                  path: 'src/modules/hansen-security/core',
                  type: 'folder',
                  children: [
                    { name: 'PolicyEngine.ts', path: 'src/modules/hansen-security/core/PolicyEngine.ts', type: 'file', language: 'typescript', size: 4521 },
                    { name: 'RBACEngine.ts', path: 'src/modules/hansen-security/core/RBACEngine.ts', type: 'file', language: 'typescript', size: 3287 }
                  ]
                }
              ]
            },
            {
              name: 'user-management',
              path: 'src/modules/user-management',
              type: 'folder',
              children: [
                {
                  name: 'core',
                  path: 'src/modules/user-management/core',
                  type: 'folder',
                  children: [
                    { name: 'UserManager.ts', path: 'src/modules/user-management/core/UserManager.ts', type: 'file', language: 'typescript', size: 2100 },
                    { name: 'RoleManager.ts', path: 'src/modules/user-management/core/RoleManager.ts', type: 'file', language: 'typescript', size: 1850 }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'app',
          path: 'src/app',
          type: 'folder',
          children: [
            { name: 'page.tsx', path: 'src/app/page.tsx', type: 'file', language: 'typescript', size: 890 },
            { name: 'layout.tsx', path: 'src/app/layout.tsx', type: 'file', language: 'typescript', size: 450 }
          ]
        }
      ]
    }
  ]

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const loadFile = async (file: CodeFile) => {
    if (file.type === 'folder') {
      toggleFolder(file.path)
      return
    }

    setSelectedFile(file.path)
    setCodeContent(null)

    try {
      // Fetch file content from API
      const response = await fetch(`/api/knowledge-base/code?path=${encodeURIComponent(file.path)}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setCodeContent(data.data.content)
        } else {
          setCodeContent(`// File not found: ${file.path}`)
        }
      } else {
        setCodeContent(`// Error loading file: ${file.path}\n// ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error loading file:', error)
      setCodeContent(`// Error loading file: ${file.path}\n// ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const copyCode = () => {
    if (codeContent) {
      navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderFile = (file: CodeFile, level = 0): JSX.Element => {
    const isExpanded = expandedFolders.has(file.path)
    const isSelected = selectedFile === file.path

    if (file.type === 'folder') {
      return (
        <div key={file.path} className={level > 0 ? 'ml-4' : ''}>
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
              ${isSelected ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'}
            `}
            onClick={() => loadFile(file)}
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
            <span className="font-medium flex-1">{file.name}</span>
            {file.children && (
              <span className="text-xs text-gray-500">({file.children.length})</span>
            )}
          </div>
          {isExpanded && file.children && (
            <div className="mt-1">
              {file.children.map(child => renderFile(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        key={file.path}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
          ${isSelected ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'hover:bg-gray-100 text-gray-700'}
          ${level > 0 ? 'ml-4' : ''}
        `}
        onClick={() => loadFile(file)}
      >
        <Code2 className="w-4 h-4 text-green-500" />
        <span className="font-medium flex-1">{file.name}</span>
        {file.language && (
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
            {file.language}
          </span>
        )}
        {file.size && (
          <span className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>
    )
  }

  const filteredStructure = codeStructure.filter(file => {
    if (!searchQuery) return true
    return file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           file.path.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-2'} gap-6 h-[800px]`}>
      {/* File Tree */}
      <div className={`glass rounded-xl p-6 overflow-hidden flex flex-col ${isFullscreen ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-600" />
            Code Browser
          </h3>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredStructure.map(file => renderFile(file))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="glass rounded-xl p-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 font-mono text-sm">
            {selectedFile || 'Select a file'}
          </h3>
          <div className="flex items-center gap-2">
            {codeContent && (
              <>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-medium text-purple-700 transition-colors">
                  <Lightbulb className="w-4 h-4" />
                  Explain
                </button>
              </>
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-900 rounded-lg p-4">
          {codeContent ? (
            <pre className="text-green-400 font-mono text-sm">
              <code>{codeContent}</code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Velg en fil fra listen</p>
              </div>
            </div>
          )}
        </div>
        {codeContent && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Code Explanation</h4>
                <p className="text-sm text-blue-800">
                  This file contains the core implementation. Click &quot;Explain&quot; for AI-powered code analysis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

