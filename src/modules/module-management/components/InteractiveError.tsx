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
 * Interactive Error Component
 * Advanced error display with helpful instructions, auto-fix suggestions, and examples
 * 
 * Features:
 * - Contextual error messages
 * - Auto-fix suggestions (where applicable)
 * - Interactive examples with copy-paste
 * - Visual feedback
 * - Step-by-step instructions
 */

'use client'

import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lightbulb,
  X,
  Zap,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react'

export interface ErrorHelp {
  title: string
  message: string
  code: string
  field: string
  severity: 'error' | 'warning'
  suggestions: string[]
  examples?: {
    wrong: string
    correct: string
    explanation?: string
  }[]
  autoFix?: {
    available: boolean
    action?: () => void | Promise<void>
    label?: string
  }
  links?: {
    label: string
    url: string
  }[]
  steps?: string[]
}

interface InteractiveErrorProps {
  error: ErrorHelp
  onAutoFix?: () => void | Promise<void>
  onDismiss?: () => void
  className?: string
}

export default function InteractiveError({
  error,
  onAutoFix,
  onDismiss,
  className = '',
}: InteractiveErrorProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAutoFix = async () => {
    if (error.autoFix?.action) {
      await error.autoFix.action()
      onAutoFix?.()
    }
  }

  const isWarning = error.severity === 'warning'

  return (
    <div
      className={`rounded-lg border-2 p-4 space-y-4 transition-all ${
        isWarning
          ? 'border-yellow-500/50 bg-yellow-500/10'
          : 'border-red-500/50 bg-red-500/10'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`mt-0.5 ${
              isWarning ? 'text-yellow-500' : 'text-red-500'
            }`}
          >
            {isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold text-base ${
                isWarning ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              {error.title}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isWarning ? 'text-yellow-300' : 'text-red-300'
              }`}
            >
              {error.message}
            </p>
            <span
              className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                isWarning
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {error.code}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? (
              <X className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="space-y-4 pt-2 border-t border-gray-700">
          {/* Quick Suggestions */}
          {error.suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  Rask løsning:
                </span>
              </div>
              <ul className="space-y-2">
                {error.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <ChevronRight className="w-3 h-3 mt-1 text-blue-400 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {error.examples && error.examples.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  Eksempler:
                </span>
              </div>
              <div className="space-y-3">
                {error.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="mb-2">
                      <span className="text-xs text-red-400 font-medium">
                        ❌ Feil:
                      </span>
                      <div className="mt-1 p-2 bg-red-500/10 rounded border border-red-500/30">
                        <code className="text-xs text-red-300">
                          {example.wrong}
                        </code>
                        <button
                          onClick={() => handleCopy(example.wrong)}
                          className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Copy className="w-3 h-3 inline" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-green-400 font-medium">
                        ✅ Korrekt:
                      </span>
                      <div className="mt-1 p-2 bg-green-500/10 rounded border border-green-500/30">
                        <code className="text-xs text-green-300">
                          {example.correct}
                        </code>
                        <button
                          onClick={() => handleCopy(example.correct)}
                          className="ml-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-3 h-3 inline" />
                          ) : (
                            <Copy className="w-3 h-3 inline" />
                          )}
                        </button>
                      </div>
                    </div>
                    {example.explanation && (
                      <p className="text-xs text-gray-400 mt-2">
                        {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-step Instructions */}
          {error.steps && error.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">
                  Steg-for-steg løsning:
                </span>
              </div>
              <ol className="space-y-2 list-decimal list-inside">
                {error.steps.map((step, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 ml-2"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Auto-fix */}
          {error.autoFix?.available && (
            <div>
              <button
                onClick={handleAutoFix}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Zap className="w-4 h-4" />
                <span>
                  {error.autoFix.label || 'Auto-fix dette problemet'}
                </span>
              </button>
            </div>
          )}

          {/* Links */}
          {error.links && error.links.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  Lære mer:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {error.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}





