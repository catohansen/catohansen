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
 * Deployment Config API
 * GET: Fetch deployment configuration
 * POST/PUT: Save deployment configuration with encrypted passwords
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import * as crypto from 'crypto'

// Encryption key - should be in environment variables
const ENCRYPTION_KEY = process.env.DEPLOYMENT_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const ALGORITHM = 'aes-256-gcm'

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'hex'), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'hex'), iv)
  
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * GET /api/admin/deploy/config
 * Fetch deployment configuration
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Ikke autorisert' },
        { status: 403 }
      )
    }

    const config = await prisma.deploymentConfig.findFirst({
      where: { name: 'Production' },
    })

    if (!config) {
      return NextResponse.json({
        success: true,
        config: null,
        message: 'Ingen deployment config funnet',
      })
    }

    // Return config without passwords for security
    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        name: config.name,
        ftpServer: config.ftpServer,
        ftpUsername: config.ftpUsername,
        // Don't return password - only show masked version
        ftpPassword: config.ftpPassword ? '••••••••' : null,
        ftpServerDir: config.ftpServerDir,
        dbHost: config.dbHost,
        dbUsername: config.dbUsername,
        // Don't return password
        dbPassword: config.dbPassword ? '••••••••' : null,
        dbName: config.dbName,
        dbPort: config.dbPort,
        dbType: config.dbType || 'mysql',
        serverUrl: config.serverUrl,
        buildOutputDir: config.buildOutputDir,
        protocol: config.protocol || 'ftp',
        lastSyncAt: config.lastSyncAt,
        lastSyncStatus: config.lastSyncStatus,
        lastSyncError: config.lastSyncError,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Failed to fetch deployment config:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Kunne ikke hente config' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/deploy/config
 * Save deployment configuration
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Ikke autorisert' },
        { status: 403 }
      )
    }

    const body = await request.json()
      const {
      name,
      ftpServer,
      ftpUsername,
      ftpPassword,
      ftpServerDir,
      protocol,
      dbHost,
      dbUsername,
      dbPassword,
      dbName,
      dbPort,
      dbType,
      serverUrl,
      buildOutputDir,
    } = body

    // Encrypt passwords
    const encryptedFtpPassword = ftpPassword && ftpPassword !== '••••••••' 
      ? encrypt(ftpPassword) 
      : undefined
    const encryptedDbPassword = dbPassword && dbPassword !== '••••••••'
      ? encrypt(dbPassword)
      : undefined

    // Get existing config to preserve encrypted passwords if not changed
    const existingConfig = await prisma.deploymentConfig.findFirst({
      where: { name: name || 'Production' },
    })

    // Upsert configuration
    const config = await prisma.deploymentConfig.upsert({
      where: { id: existingConfig?.id || 'new' },
      update: {
        name: name || 'Production',
        ftpServer: ftpServer || existingConfig?.ftpServer || 'ftp.domeneshop.no',
        ftpUsername: ftpUsername || existingConfig?.ftpUsername || '',
        ftpPassword: encryptedFtpPassword || existingConfig?.ftpPassword || '',
        ftpServerDir: ftpServerDir || existingConfig?.ftpServerDir || '/www',
        dbHost: dbHost || existingConfig?.dbHost,
        dbUsername: dbUsername || existingConfig?.dbUsername,
        dbPassword: encryptedDbPassword || existingConfig?.dbPassword,
        dbName: dbName || existingConfig?.dbName,
        dbPort: dbPort || existingConfig?.dbPort || 3306, // MySQL default
        dbType: dbType || existingConfig?.dbType || 'mysql',
        protocol: protocol || existingConfig?.protocol || 'ftp',
        serverUrl: serverUrl || existingConfig?.serverUrl,
        buildOutputDir: buildOutputDir || existingConfig?.buildOutputDir || 'out',
      },
      create: {
        name: name || 'Production',
        ftpServer: ftpServer || 'ftp.domeneshop.no',
        ftpUsername: ftpUsername || '',
        ftpPassword: encryptedFtpPassword || '',
        ftpServerDir: ftpServerDir || '/www',
        protocol: body.protocol || 'ftp',
        dbHost,
        dbUsername,
        dbPassword: encryptedDbPassword,
        dbName,
        dbPort: dbPort || 3306, // MySQL default
        dbType: dbType || 'mysql',
        serverUrl,
        buildOutputDir: buildOutputDir || 'out',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Deployment config lagret',
      config: {
        id: config.id,
        name: config.name,
        ftpServer: config.ftpServer,
        ftpUsername: config.ftpUsername,
        ftpPassword: '••••••••',
        ftpServerDir: config.ftpServerDir,
        dbHost: config.dbHost,
        dbUsername: config.dbUsername,
        dbPassword: '••••••••',
        dbName: config.dbName,
        dbPort: config.dbPort,
        serverUrl: config.serverUrl,
        buildOutputDir: config.buildOutputDir,
      },
    })
  } catch (error: any) {
    console.error('Failed to save deployment config:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Kunne ikke lagre config' },
      { status: 500 }
    )
  }
}

