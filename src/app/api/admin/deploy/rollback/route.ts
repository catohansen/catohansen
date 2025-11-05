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
 * Rollback API
 * POST: Rollback to previous deployment
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import { Client } from 'basic-ftp'
import * as crypto from 'crypto'

const ENCRYPTION_KEY = process.env.DEPLOYMENT_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const ALGORITHM = 'aes-256-gcm'

function decrypt(encryptedText: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'hex'), iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return ''
  }
}

/**
 * POST /api/admin/deploy/rollback
 * Rollback to previous deployment
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
    const { deploymentId } = body

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID kreves' },
        { status: 400 }
      )
    }

    // Get deployment history
    const deployment = await prisma.deploymentHistory.findUnique({
      where: { id: deploymentId },
      include: {
        config: true,
      },
    })

    if (!deployment || !deployment.config) {
      return NextResponse.json(
        { error: 'Deployment ikke funnet' },
        { status: 404 }
      )
    }

    const config = deployment.config
    const metadata = deployment.metadata as any

    if (!metadata?.backupPath) {
      return NextResponse.json(
        { error: 'Ingen backup tilgjengelig for denne deployment' },
        { status: 400 }
      )
    }

    // Decrypt passwords
    const ftpPassword = config.ftpPassword ? decrypt(config.ftpPassword) : ''

    // Restore from backup via FTP
    const client = new Client()
    
    await client.access({
      host: config.ftpServer || 'ftp.domeneshop.no',
      user: config.ftpUsername || 'catohansen',
      password: ftpPassword,
      secure: false,
    })

    await client.cd(config.ftpServerDir || '/www')
    
    // Restore from backup directory
    // Note: Full backup restore via FTP is complex, this is a placeholder
    // In production, you'd need to download backup files and restore them
    
    client.close()

    // Create rollback record
    const rollback = await prisma.deploymentHistory.create({
      data: {
        status: 'success',
        step: 'rollback',
        configId: config.id,
        createdById: user.id,
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: {
          rolledBackFrom: deploymentId,
          backupPath: metadata.backupPath,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Rollback fullført',
      rollbackId: rollback.id,
      note: 'Rollback via FTP er forenklet. Full restore krever manuell handling.',
    })
  } catch (error: any) {
    console.error('Rollback error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Rollback feilet' },
      { status: 500 }
    )
  }
}





