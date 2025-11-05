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
 * Notification Manager
 * Smart notification system with preferences
 * World-class notification management
 */

import { getPrismaClient } from '@/lib/db/prisma'

export interface NotificationData {
  id: string
  userId: string
  type: string
  title: string
  message: string
  link?: string | null
  read: boolean
  readAt?: Date | null
  metadata?: any
  createdAt: Date
}

export interface CreateNotificationInput {
  userId: string
  type: string
  title: string
  message: string
  link?: string
  metadata?: any
}

export interface NotificationFilters {
  userId?: string
  read?: boolean
  type?: string
  limit?: number
  offset?: number
}

export class NotificationManager {
  /**
   * Create notification
   */
  async createNotification(input: CreateNotificationInput): Promise<NotificationData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      throw new Error('Database not available')
    }

    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type as any, // Cast to enum
        title: input.title,
        message: input.message,
        link: input.link || null,
        metadata: input.metadata,
        read: false
      }
    })

    return this.mapToNotificationData(notification)
  }

  /**
   * Get notifications for user
   */
  async getNotifications(filters?: NotificationFilters): Promise<{ data: NotificationData[], total: number, unread: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      return { data: [], total: 0, unread: 0 }
    }

    const where: any = {}

    if (filters?.userId) where.userId = filters.userId
    if (filters?.read !== undefined) where.read = filters.read
    if (filters?.type) where.type = filters.type

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ 
        where: { ...where, read: false }
      })
    ])

    return {
      data: notifications.map((n: any) => this.mapToNotificationData(n)),
      total,
      unread: unreadCount
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<NotificationData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      throw new Error('Database not available')
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return this.mapToNotificationData(notification)
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<number> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      throw new Error('Database not available')
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return result.count
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      throw new Error('Database not available')
    }

    await prisma.notification.delete({ where: { id: notificationId } })
  }

  /**
   * Delete all read notifications for user
   */
  async deleteAllRead(userId: string): Promise<number> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.notification === 'undefined') {
      throw new Error('Database not available')
    }

    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        read: true
      }
    })

    return result.count
  }

  private mapToNotificationData(notification: any): NotificationData {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      read: notification.read,
      readAt: notification.readAt,
      metadata: notification.metadata,
      createdAt: notification.createdAt
    }
  }
}



