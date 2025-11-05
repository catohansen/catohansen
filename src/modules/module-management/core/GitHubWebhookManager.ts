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
 * GitHub Webhook Manager
 * Manages GitHub webhooks for automatic module synchronization
 * 
 * Features:
 * - Auto-setup webhooks via GitHub API
 * - HMAC signature verification
 * - Event routing and processing
 * - Webhook secret management
 * - Retry logic
 */

import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'

export interface WebhookSetupOptions {
  url?: string // Optional - will be generated if not provided
  secret?: string
  events?: string[]
  active?: boolean
}

export interface WebhookVerificationResult {
  valid: boolean
  error?: string
}

/**
 * GitHub Webhook Manager
 * Handles webhook setup, verification, and processing
 */
export class GitHubWebhookManager {
  /**
   * Verify HMAC signature from GitHub webhook
   */
  verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): WebhookVerificationResult {
    try {
      if (!signature || !secret) {
        return { valid: false, error: 'Missing signature or secret' }
      }

      // GitHub uses 'sha256=' prefix
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')

      const receivedSignature = signature.replace('sha256=', '')

      // Use constant-time comparison to prevent timing attacks
      const valid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(receivedSignature)
      )

      return { valid, error: valid ? undefined : 'Invalid signature' }
    } catch (error: any) {
      return { valid: false, error: error.message || 'Verification failed' }
    }
  }

  /**
   * Setup webhook for module via GitHub API
   */
  async setupWebhook(
    moduleId: string,
    githubRepo: string,
    options: WebhookSetupOptions = {}
  ): Promise<{
    success: boolean
    webhookId?: string
    githubWebhookId?: number
    error?: string
  }> {
    try {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      })

      if (!module) {
        throw new Error(`Module ${moduleId} not found`)
      }

      const [owner, repo] = githubRepo.split('/')
      if (!owner || !repo) {
        throw new Error(`Invalid GitHub repo format: ${githubRepo}`)
      }

      // Generate webhook secret if not provided
      const secret = options.secret || this.generateSecret()

      // Generate webhook URL if not provided
      const webhookUrl =
        options.url ||
        `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/github`

      // Default events
      const events =
        options.events ||
        ['push', 'release', 'pull_request', 'repository', 'create', 'delete']

      // Call GitHub API to create webhook
      const githubToken = process.env.GITHUB_TOKEN
      if (!githubToken) {
        throw new Error('GITHUB_TOKEN not configured')
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'web',
            active: options.active !== false,
            events,
            config: {
              url: webhookUrl,
              content_type: 'json',
              secret,
              insecure_ssl: '0', // Require SSL
            },
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `GitHub API error: ${response.statusText} - ${errorData.message || ''}`
        )
      }

      const githubWebhook = await response.json()

      // Store webhook in database
      const webhook = await prisma.gitHubWebhook.create({
        data: {
          moduleId,
          name: `GitHub Webhook for ${module.displayName}`,
          url: webhookUrl,
          secret,
          events,
          active: options.active !== false,
        },
      })

      return {
        success: true,
        webhookId: webhook.id,
        githubWebhookId: githubWebhook.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Update webhook configuration
   */
  async updateWebhook(
    webhookId: string,
    options: Partial<WebhookSetupOptions>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const webhook = await prisma.gitHubWebhook.findUnique({
        where: { id: webhookId },
        include: { module: true },
      })

      if (!webhook || !webhook.module?.githubRepo) {
        throw new Error('Webhook not found or module not configured')
      }

      const [owner, repo] = webhook.module.githubRepo.split('/')
      if (!owner || !repo) {
        throw new Error('Invalid GitHub repo format')
      }

      // Find GitHub webhook ID (we'd need to store this)
      // For now, we'll need to list webhooks and find the matching one
      const githubToken = process.env.GITHUB_TOKEN
      if (!githubToken) {
        throw new Error('GITHUB_TOKEN not configured')
      }

      // List webhooks to find ours
      const listResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${githubToken}`,
          },
        }
      )

      if (!listResponse.ok) {
        throw new Error(`Failed to list webhooks: ${listResponse.statusText}`)
      }

      const webhooks = await listResponse.json()
      const githubWebhook = webhooks.find(
        (wh: any) => wh.config?.url === webhook.url
      )

      if (!githubWebhook) {
        throw new Error('GitHub webhook not found')
      }

      // Update GitHub webhook
      const updateResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/hooks/${githubWebhook.id}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: options.active ?? webhook.active,
            events: options.events || webhook.events,
            config: {
              ...githubWebhook.config,
              url: options.url || webhook.url,
              secret: options.secret || webhook.secret,
            },
          }),
        }
      )

      if (!updateResponse.ok) {
        throw new Error(`Failed to update webhook: ${updateResponse.statusText}`)
      }

      // Update database
      await prisma.gitHubWebhook.update({
        where: { id: webhookId },
        data: {
          url: options.url || webhook.url,
          secret: options.secret || webhook.secret,
          events: options.events || webhook.events,
          active: options.active ?? webhook.active,
        },
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const webhook = await prisma.gitHubWebhook.findUnique({
        where: { id: webhookId },
        include: { module: true },
      })

      if (!webhook || !webhook.module?.githubRepo) {
        throw new Error('Webhook not found')
      }

      const [owner, repo] = webhook.module.githubRepo.split('/')
      if (!owner || !repo) {
        throw new Error('Invalid GitHub repo format')
      }

      // Find and delete GitHub webhook
      const githubToken = process.env.GITHUB_TOKEN
      if (githubToken) {
        try {
          const listResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/hooks`,
            {
              headers: {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `token ${githubToken}`,
              },
            }
          )

          if (listResponse.ok) {
            const webhooks = await listResponse.json()
            const githubWebhook = webhooks.find(
              (wh: any) => wh.config?.url === webhook.url
            )

            if (githubWebhook) {
              await fetch(
                `https://api.github.com/repos/${owner}/${repo}/hooks/${githubWebhook.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `token ${githubToken}`,
                  },
                }
              )
            }
          }
        } catch (error) {
          console.warn('Failed to delete GitHub webhook:', error)
        }
      }

      // Delete from database
      await prisma.gitHubWebhook.delete({
        where: { id: webhookId },
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(
    webhookId: string,
    eventType: string,
    payload: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Store event in database
      const event = await prisma.gitHubWebhookEvent.create({
        data: {
          webhookId,
          eventType,
          payload,
          processed: false,
        },
      })

      // Route event based on type
      switch (eventType) {
        case 'push':
          await this.handlePushEvent(webhookId, payload)
          break
        case 'release':
          await this.handleReleaseEvent(webhookId, payload)
          break
        case 'pull_request':
          await this.handlePullRequestEvent(webhookId, payload)
          break
        default:
          console.log(`Unhandled event type: ${eventType}`)
      }

      // Mark as processed
      await prisma.gitHubWebhookEvent.update({
        where: { id: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
        },
      })

      return { success: true }
    } catch (error: any) {
      // Update event with error
      await prisma.gitHubWebhookEvent.updateMany({
        where: { webhookId },
        data: {
          processed: false,
          error: error.message || 'Unknown error',
        },
      })

      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Handle push event
   */
  private async handlePushEvent(webhookId: string, payload: any): Promise<void> {
    const webhook = await prisma.gitHubWebhook.findUnique({
      where: { id: webhookId },
      include: { module: true },
    })

    if (!webhook?.module) {
      return
    }

    // Trigger sync if module has autoSync enabled
    if (webhook.module.autoSync) {
      // Queue sync job (we'll implement queue system next)
      await prisma.job.create({
        data: {
          type: 'module-sync',
          payload: {
            moduleId: webhook.module.id,
            direction: 'from-github',
            reason: 'webhook-push',
            commitSha: payload.head_commit?.id,
          },
          status: 'PENDING',
          maxAttempts: 3,
        },
      })
    }
  }

  /**
   * Handle release event
   */
  private async handleReleaseEvent(webhookId: string, payload: any): Promise<void> {
    const webhook = await prisma.gitHubWebhook.findUnique({
      where: { id: webhookId },
      include: { module: true },
    })

    if (!webhook?.module) {
      return
    }

    // Update module version if release published
    if (payload.action === 'published' && payload.release) {
      const version = payload.release.tag_name?.replace('v', '') || payload.release.name

      await prisma.module.update({
        where: { id: webhook.module.id },
        data: {
          version,
          lastSynced: new Date(),
          syncStatus: 'SYNCED',
        },
      })
    }
  }

  /**
   * Handle pull request event
   */
  private async handlePullRequestEvent(webhookId: string, payload: any): Promise<void> {
    // Could trigger tests, linting, or other checks
    // For now, just log
    console.log('Pull request event:', payload.action)
  }

  /**
   * Generate secure webhook secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}

/**
 * Create webhook manager instance
 */
export function createGitHubWebhookManager() {
  return new GitHubWebhookManager()
}

/**
 * Default webhook manager instance
 */
export const githubWebhookManager = new GitHubWebhookManager()

