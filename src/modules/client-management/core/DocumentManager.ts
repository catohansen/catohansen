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
 * Document Manager
 * Document management system for clients and deals
 * Upload, storage, versioning, templates, and generation
 */

import { getPrismaClient } from '@/lib/db/prisma'
import { automationEngine } from './AutomationEngine'
import { promises as fs } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

export interface DocumentData {
  id: string
  name: string
  filename: string
  filepath: string
  mimeType: string
  size: number
  version: number
  parentId?: string | null
  versions?: DocumentData[]
  clientId?: string | null
  client?: {
    id: string
    name: string
    email?: string | null
  }
  pipelineId?: string | null
  pipeline?: {
    id: string
    name: string
    stage: string
  }
  category?: string | null
  metadata?: any
  createdAt: Date
  updatedAt: Date
  createdBy?: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export interface CreateDocumentInput {
  name: string
  filename: string
  filepath: string
  mimeType: string
  size: number
  parentId?: string
  clientId?: string
  pipelineId?: string
  category?: string
  metadata?: any
}

export interface UpdateDocumentInput {
  name?: string
  category?: string
  metadata?: any
}

export interface DocumentFilters {
  clientId?: string
  pipelineId?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface DocumentTemplate {
  id: string
  name: string
  type: 'quote' | 'contract' | 'invoice' | 'proposal' | 'other'
  template: string // HTML template with variables
  variables: string[] // Available variables like {{client.name}}, {{deal.value}}
}

export class DocumentManager {
  private storagePath: string

  constructor() {
    // Use environment variable or default to ./storage/documents
    this.storagePath = process.env.DOCUMENT_STORAGE_PATH || join(process.cwd(), 'storage', 'documents')
    this.ensureStorageDirectory()
  }

  /**
   * Ensure storage directory exists
   */
  private async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true })
    } catch (error) {
      console.error('Error creating storage directory:', error)
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(documentId: string): Promise<DocumentData | null> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      return null
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        parent: true,
        versions: {
          orderBy: { version: 'desc' }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!document) return null

    return this.mapToDocumentData(document)
  }

  /**
   * Get documents with filters
   */
  async getDocuments(filters?: DocumentFilters): Promise<{ data: DocumentData[], total: number }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      return { data: [], total: 0 }
    }

    const where: any = {}

    if (filters?.clientId) where.clientId = filters.clientId
    if (filters?.pipelineId) where.pipelineId = filters.pipelineId
    if (filters?.category) where.category = filters.category

    // Only get latest versions (not parent versions)
    where.parentId = null

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { filename: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          pipeline: {
            select: {
              id: true,
              name: true,
              stage: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 100,
        skip: filters?.offset || 0
      }),
      prisma.document.count({ where })
    ])

    return {
      data: documents.map((d: any) => this.mapToDocumentData(d)),
      total
    }
  }

  /**
   * Create document (upload)
   */
  async createDocument(input: CreateDocumentInput, createdById?: string): Promise<DocumentData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      throw new Error('Database not available')
    }

    // Get parent version if updating
    let version = 1
    if (input.parentId) {
      const parent = await prisma.document.findUnique({ where: { id: input.parentId } })
      if (parent) {
        version = parent.version + 1
      }
    }

    const document = await prisma.document.create({
      data: {
        name: input.name,
        filename: input.filename,
        filepath: input.filepath,
        mimeType: input.mimeType,
        size: input.size,
        version,
        parentId: input.parentId || null,
        clientId: input.clientId || null,
        pipelineId: input.pipelineId || null,
        category: input.category || null,
        metadata: input.metadata,
        createdById
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Trigger automation engine event
    automationEngine.triggerEvent('document.created', {
      ...document,
      // id is already in document object, no need to duplicate
    })

    return this.mapToDocumentData(document)
  }

  /**
   * Update document metadata
   */
  async updateDocument(documentId: string, input: UpdateDocumentInput): Promise<DocumentData> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      throw new Error('Database not available')
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pipeline: {
          select: {
            id: true,
            name: true,
            stage: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return this.mapToDocumentData(document)
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<void> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      throw new Error('Database not available')
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } })
    if (!document) {
      throw new Error('Document not found')
    }

    // Delete file from storage
    try {
      await fs.unlink(document.filepath)
    } catch (error) {
      console.error('Error deleting file:', error)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.document.delete({ where: { id: documentId } })
  }

  /**
   * Get document versions
   */
  async getDocumentVersions(documentId: string): Promise<DocumentData[]> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      return []
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    })

    if (!document) return []

    return document.versions.map((v: any) => this.mapToDocumentData(v))
  }

  /**
   * Generate document from template
   */
  async generateDocumentFromTemplate(
    templateType: 'quote' | 'contract' | 'invoice' | 'proposal',
    variables: Record<string, any>,
    clientId?: string,
    pipelineId?: string,
    createdById?: string
  ): Promise<DocumentData> {
    // Get template
    const template = this.getTemplate(templateType)
    
    if (!template) {
      throw new Error(`Template not found: ${templateType}`)
    }

    // Replace variables in template
    let content = template.template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      content = content.replace(regex, String(value || ''))
    }

    // Save generated document
    const filename = `${templateType}-${randomBytes(8).toString('hex')}.html`
    const filepath = join(this.storagePath, filename)
    
    try {
      await fs.writeFile(filepath, content, 'utf-8')
      const stats = await fs.stat(filepath)
      
      return await this.createDocument({
        name: `${template.name} - ${variables.clientName || 'Document'}`,
        filename,
        filepath,
        mimeType: 'text/html',
        size: stats.size,
        clientId,
        pipelineId,
        category: templateType,
        metadata: { generated: true, templateType, variables }
      }, createdById)
    } catch (error) {
      console.error('Error generating document:', error)
      throw new Error('Failed to generate document')
    }
  }

  /**
   * Get document template
   */
  private getTemplate(type: 'quote' | 'contract' | 'invoice' | 'proposal'): DocumentTemplate | null {
    const templates: Record<string, DocumentTemplate> = {
      quote: {
        id: 'quote',
        name: 'Quote Template',
        type: 'quote',
        template: `
<!DOCTYPE html>
<html>
<head>
  <title>Quote - {{clientName}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .client { margin-bottom: 30px; }
    .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items th, .items td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    .items th { background-color: #f4f4f4; }
    .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Quote</h1>
    <p>Date: {{date}}</p>
  </div>
  <div class="client">
    <h2>{{clientName}}</h2>
    <p>{{clientAddress}}</p>
  </div>
  <table class="items">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{items}}
    </tbody>
  </table>
  <div class="total">
    <p>Total: {{total}} {{currency}}</p>
  </div>
</body>
</html>
        `,
        variables: ['clientName', 'clientAddress', 'date', 'items', 'total', 'currency']
      },
      contract: {
        id: 'contract',
        name: 'Contract Template',
        type: 'contract',
        template: `
<!DOCTYPE html>
<html>
<head>
  <title>Contract - {{clientName}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .section { margin: 20px 0; }
    .signature { margin-top: 60px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Service Contract</h1>
    <p>Date: {{date}}</p>
  </div>
  <div class="section">
    <h2>Parties</h2>
    <p><strong>Client:</strong> {{clientName}}</p>
    <p><strong>Provider:</strong> {{providerName}}</p>
  </div>
  <div class="section">
    <h2>Services</h2>
    <p>{{services}}</p>
  </div>
  <div class="section">
    <h2>Terms</h2>
    <p>{{terms}}</p>
  </div>
  <div class="signature">
    <p>Client Signature: ________________</p>
    <p>Provider Signature: ________________</p>
  </div>
</body>
</html>
        `,
        variables: ['clientName', 'providerName', 'date', 'services', 'terms']
      },
      invoice: {
        id: 'invoice',
        name: 'Invoice Template',
        type: 'invoice',
        template: `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - {{invoiceNumber}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .client { margin-bottom: 30px; }
    .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items th, .items td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    .items th { background-color: #f4f4f4; }
    .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
    .payment { margin-top: 40px; padding: 20px; background-color: #f9f9f9; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Invoice #{{invoiceNumber}}</h1>
    <p>Date: {{date}}</p>
    <p>Due Date: {{dueDate}}</p>
  </div>
  <div class="client">
    <h2>Bill To:</h2>
    <p>{{clientName}}</p>
    <p>{{clientAddress}}</p>
  </div>
  <table class="items">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{items}}
    </tbody>
  </table>
  <div class="total">
    <p>Subtotal: {{subtotal}} {{currency}}</p>
    <p>Tax: {{tax}} {{currency}}</p>
    <p><strong>Total: {{total}} {{currency}}</strong></p>
  </div>
  <div class="payment">
    <h3>Payment Information</h3>
    <p>{{paymentInfo}}</p>
  </div>
</body>
</html>
        `,
        variables: ['invoiceNumber', 'date', 'dueDate', 'clientName', 'clientAddress', 'items', 'subtotal', 'tax', 'total', 'currency', 'paymentInfo']
      },
      proposal: {
        id: 'proposal',
        name: 'Proposal Template',
        type: 'proposal',
        template: `
<!DOCTYPE html>
<html>
<head>
  <title>Proposal - {{clientName}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .section { margin: 30px 0; }
    .pricing { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Proposal</h1>
    <p>Date: {{date}}</p>
  </div>
  <div class="section">
    <h2>Client</h2>
    <p>{{clientName}}</p>
  </div>
  <div class="section">
    <h2>Executive Summary</h2>
    <p>{{summary}}</p>
  </div>
  <div class="section">
    <h2>Scope of Work</h2>
    <p>{{scope}}</p>
  </div>
  <div class="section pricing">
    <h2>Pricing</h2>
    <p><strong>Total: {{total}} {{currency}}</strong></p>
    <p>{{pricingDetails}}</p>
  </div>
  <div class="section">
    <h2>Timeline</h2>
    <p>{{timeline}}</p>
  </div>
</body>
</html>
        `,
        variables: ['clientName', 'date', 'summary', 'scope', 'total', 'currency', 'pricingDetails', 'timeline']
      }
    }

    return templates[type] || null
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(clientId?: string, pipelineId?: string): Promise<{
    total: number
    byCategory: Record<string, number>
    totalSize: number
    recentDocuments: DocumentData[]
  }> {
    const prisma = await getPrismaClient()
    
    if (!prisma || typeof prisma.document === 'undefined') {
      return {
        total: 0,
        byCategory: {},
        totalSize: 0,
        recentDocuments: []
      }
    }

    const where: any = { parentId: null } // Only latest versions
    if (clientId) where.clientId = clientId
    if (pipelineId) where.pipelineId = pipelineId

    const documents = await prisma.document.findMany({ where })

    const byCategory: Record<string, number> = {}
    let totalSize = 0

    documents.forEach((doc: any) => {
      byCategory[doc.category || 'other'] = (byCategory[doc.category || 'other'] || 0) + 1
      totalSize += doc.size || 0
    })

    const recentDocuments = documents
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((d: any) => this.mapToDocumentData(d))

    return {
      total: documents.length,
      byCategory,
      totalSize,
      recentDocuments
    }
  }

  private mapToDocumentData(document: any): DocumentData {
    return {
      id: document.id,
      name: document.name,
      filename: document.filename,
      filepath: document.filepath,
      mimeType: document.mimeType,
      size: document.size,
      version: document.version,
      parentId: document.parentId,
      versions: document.versions ? document.versions.map((v: any) => this.mapToDocumentData(v)) : undefined,
      clientId: document.clientId,
      client: document.client || undefined,
      pipelineId: document.pipelineId,
      pipeline: document.pipeline || undefined,
      category: document.category,
      metadata: document.metadata,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      createdBy: document.createdBy || undefined
    }
  }
}

