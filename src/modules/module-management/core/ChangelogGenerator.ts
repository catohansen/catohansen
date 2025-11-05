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
 * Changelog Generator
 * Automatic changelog generation from commit history
 * Inspired by conventional-changelog and semantic-release
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

export interface ChangelogOptions {
  fromVersion?: string
  toVersion?: string
  since?: Date
  format?: 'markdown' | 'json'
}

export interface ChangelogEntry {
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore' | 'breaking'
  scope?: string
  subject: string
  hash: string
  body?: string
  footer?: string
}

export interface Changelog {
  version: string
  date: string
  added: ChangelogEntry[]
  changed: ChangelogEntry[]
  fixed: ChangelogEntry[]
  removed: ChangelogEntry[]
  security: ChangelogEntry[]
  breaking: ChangelogEntry[]
}

/**
 * Changelog Generator
 * Generates changelog from commit history
 */
export class ChangelogGenerator {
  private rootPath: string

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath
  }

  /**
   * Generate changelog for module
   */
  async generateChangelog(
    moduleName: string,
    options: ChangelogOptions = {}
  ): Promise<string> {
    try {
      const entries = await this.parseCommits(moduleName, options.since)
      const changelog = this.formatChangelog(entries, options.toVersion || 'Unreleased')

      // Write to CHANGELOG.md
      if (options.format !== 'json') {
        await this.writeChangelog(moduleName, changelog, options.toVersion || 'Unreleased')
      }

      return changelog
    } catch (error: any) {
      throw new Error(`Failed to generate changelog: ${error.message}`)
    }
  }

  /**
   * Parse commits from git history
   */
  private async parseCommits(
    moduleName: string,
    since?: Date
  ): Promise<ChangelogEntry[]> {
    try {
      const sinceDate = since
        ? `--since="${since.toISOString()}"`
        : ''

      const { stdout } = await execAsync(
        `git log --pretty=format:"%H|%s|%b" ${sinceDate} -- "src/modules/${moduleName}/" || echo ""`,
        { cwd: this.rootPath }
      )

      const lines = stdout.split('\n').filter((line) => line.trim())

      const entries: ChangelogEntry[] = []

      for (const line of lines) {
        const [hash, subject, body] = line.split('|')
        
        if (!hash || !subject) continue

        const parsed = this.parseCommitMessage(subject)
        
        entries.push({
          ...parsed,
          hash: hash.substring(0, 7),
          body: body || undefined,
        })
      }

      return entries
    } catch {
      return []
    }
  }

  /**
   * Parse commit message (Conventional Commits format)
   */
  private parseCommitMessage(message: string): ChangelogEntry {
    // Conventional Commits format: type(scope): subject
    // Examples:
    // - feat: add new feature
    // - fix(auth): fix login bug
    // - BREAKING CHANGE: remove old API

    let type: ChangelogEntry['type'] = 'chore'
    let scope: string | undefined
    let subject = message

    // Check for breaking changes
    if (message.includes('BREAKING CHANGE') || message.includes('BREAKING')) {
      type = 'breaking'
    } else {
      // Parse type(scope): format
      const match = message.match(/^(\w+)(?:\(([^)]+)\))?:?\s*(.+)$/)
      
      if (match) {
        const [, msgType, msgScope, msgSubject] = match
        
        // Map commit types
        const typeMap: Record<string, ChangelogEntry['type']> = {
          feat: 'feat',
          fix: 'fix',
          docs: 'docs',
          style: 'style',
          refactor: 'refactor',
          perf: 'perf',
          test: 'test',
          chore: 'chore',
        }

        type = typeMap[msgType] || 'chore'
        scope = msgScope
        subject = msgSubject || subject
      }
    }

    return {
      type,
      scope,
      subject,
      hash: '',
    }
  }

  /**
   * Format changelog entries to markdown
   */
  private formatChangelog(
    entries: ChangelogEntry[],
    version: string
  ): string {
    const grouped = this.groupEntries(entries)

    const lines: string[] = []
    lines.push(`## ${version}`)
    lines.push(`\n**Release Date:** ${new Date().toISOString().split('T')[0]}\n`)

    if (grouped.breaking.length > 0) {
      lines.push('### 🚨 Breaking Changes')
      grouped.breaking.forEach((entry) => {
        lines.push(`- **${entry.scope || 'general'}**: ${entry.subject}`)
      })
      lines.push('')
    }

    if (grouped.added.length > 0) {
      lines.push('### ✨ Added')
      grouped.added.forEach((entry) => {
        lines.push(`- ${entry.subject}${entry.scope ? ` (${entry.scope})` : ''}`)
      })
      lines.push('')
    }

    if (grouped.changed.length > 0) {
      lines.push('### 🔄 Changed')
      grouped.changed.forEach((entry) => {
        lines.push(`- ${entry.subject}${entry.scope ? ` (${entry.scope})` : ''}`)
      })
      lines.push('')
    }

    if (grouped.fixed.length > 0) {
      lines.push('### 🐛 Fixed')
      grouped.fixed.forEach((entry) => {
        lines.push(`- ${entry.subject}${entry.scope ? ` (${entry.scope})` : ''}`)
      })
      lines.push('')
    }

    if (grouped.removed.length > 0) {
      lines.push('### 🗑️ Removed')
      grouped.removed.forEach((entry) => {
        lines.push(`- ${entry.subject}${entry.scope ? ` (${entry.scope})` : ''}`)
      })
      lines.push('')
    }

    if (grouped.security.length > 0) {
      lines.push('### 🔒 Security')
      grouped.security.forEach((entry) => {
        lines.push(`- ${entry.subject}${entry.scope ? ` (${entry.scope})` : ''}`)
      })
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Group entries by type
   */
  private groupEntries(entries: ChangelogEntry[]): {
    added: ChangelogEntry[]
    changed: ChangelogEntry[]
    fixed: ChangelogEntry[]
    removed: ChangelogEntry[]
    security: ChangelogEntry[]
    breaking: ChangelogEntry[]
  } {
    const grouped = {
      added: [] as ChangelogEntry[],
      changed: [] as ChangelogEntry[],
      fixed: [] as ChangelogEntry[],
      removed: [] as ChangelogEntry[],
      security: [] as ChangelogEntry[],
      breaking: [] as ChangelogEntry[],
    }

    for (const entry of entries) {
      if (entry.type === 'breaking') {
        grouped.breaking.push(entry)
      } else if (entry.type === 'feat') {
        grouped.added.push(entry)
      } else if (entry.type === 'fix') {
        if (entry.subject.toLowerCase().includes('security')) {
          grouped.security.push(entry)
        } else {
          grouped.fixed.push(entry)
        }
      } else if (entry.type === 'refactor' || entry.type === 'perf') {
        grouped.changed.push(entry)
      } else if (entry.subject.toLowerCase().includes('remove') || entry.subject.toLowerCase().includes('delete')) {
        grouped.removed.push(entry)
      } else {
        grouped.changed.push(entry)
      }
    }

    return grouped
  }

  /**
   * Write changelog to CHANGELOG.md
   */
  private async writeChangelog(
    moduleName: string,
    changelog: string,
    version: string
  ): Promise<void> {
    const changelogPath = path.join(
      this.rootPath,
      'src/modules',
      moduleName,
      'CHANGELOG.md'
    )

    try {
      // Read existing changelog
      let existing = ''
      try {
        existing = await fs.readFile(changelogPath, 'utf-8')
      } catch {
        // File doesn't exist, create new one
      }

      // Prepend new changelog entry
      const header = '# Changelog\n\nAll notable changes to this module will be documented in this file.\n\n'
      const newChangelog = existing
        ? existing.replace(header, `${header}${changelog}\n\n---\n\n`)
        : `${header}${changelog}\n`

      await fs.writeFile(changelogPath, newChangelog, 'utf-8')
    } catch (error) {
      console.warn(`Failed to write changelog for ${moduleName}:`, error)
    }
  }
}

/**
 * Create changelog generator instance
 */
export function createChangelogGenerator(rootPath?: string) {
  return new ChangelogGenerator(rootPath)
}

/**
 * Default changelog generator instance
 */
export const changelogGenerator = new ChangelogGenerator()





