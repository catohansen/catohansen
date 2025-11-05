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
 * Event Emitter
 * Event-driven architecture foundation
 * 
 * Supports:
 * - Event subscription and publishing
 * - Type-safe events
 * - Async event handlers
 * - Event filtering
 */

export type EventHandler<T = any> = (data: T) => void | Promise<void>

export interface Event {
  type: string
  payload: any
  timestamp: Date
  source?: string
  correlationId?: string
}

export class EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  /**
   * Subscribe to event type
   */
  on<T = any>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    
    this.handlers.get(eventType)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler)
    }
  }

  /**
   * Subscribe once to event type
   */
  once<T = any>(eventType: string, handler: EventHandler<T>): void {
    const wrappedHandler = async (data: T) => {
      await handler(data)
      this.off(eventType, wrappedHandler)
    }
    this.on(eventType, wrappedHandler)
  }

  /**
   * Unsubscribe from event type
   */
  off<T = any>(eventType: string, handler: EventHandler<T>): void {
    this.handlers.get(eventType)?.delete(handler)
  }

  /**
   * Emit event
   */
  async emit(eventType: string, payload: any, source?: string, correlationId?: string): Promise<void> {
    const event: Event = {
      type: eventType,
      payload,
      timestamp: new Date(),
      source,
      correlationId
    }

    const handlers = this.handlers.get(eventType)
    if (!handlers || handlers.size === 0) {
      return
    }

    // Execute all handlers (can be async)
    const promises = Array.from(handlers).map(handler => {
      try {
        return Promise.resolve(handler(payload))
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error)
        return Promise.resolve()
      }
    })

    await Promise.all(promises)
  }

  /**
   * Remove all handlers for event type
   */
  removeAllListeners(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType)
    } else {
      this.handlers.clear()
    }
  }

  /**
   * Get listener count for event type
   */
  listenerCount(eventType: string): number {
    return this.handlers.get(eventType)?.size || 0
  }
}

// Default event emitter instance
export const eventEmitter = new EventEmitter()

// Common event types
export const EventTypes = {
  // User events
  USER_CREATED: 'user:created',
  USER_UPDATED: 'user:updated',
  USER_DELETED: 'user:deleted',
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',

  // Project events
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',

  // Content events
  CONTENT_CREATED: 'content:created',
  CONTENT_UPDATED: 'content:updated',
  CONTENT_DELETED: 'content:deleted',

  // Billing events
  INVOICE_CREATED: 'invoice:created',
  INVOICE_PAID: 'invoice:paid',
  PAYMENT_RECEIVED: 'payment:received',

  // Security events
  POLICY_EVALUATED: 'policy:evaluated',
  ACCESS_DENIED: 'access:denied',
  ANOMALY_DETECTED: 'anomaly:detected',

  // AI events
  AI_AGENT_STARTED: 'ai:agent:started',
  AI_AGENT_COMPLETED: 'ai:agent:completed',
  AI_AGENT_FAILED: 'ai:agent:failed',
} as const







