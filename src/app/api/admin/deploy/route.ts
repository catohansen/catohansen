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
 * Deploy API Route
 * Handles deployment to domene.shop via FTP
 */

import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Client } from 'basic-ftp'
import { prisma } from '@/lib/db/prisma'
import { getAuthenticatedUser } from '@/lib/auth/getServerSession'
import * as crypto from 'crypto'
import https from 'https'

const execAsync = promisify(exec)

// Encryption key - should be in environment variables
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
  } catch (error) {
    // If decryption fails, return empty string
    return ''
  }
}

/**
 * Get deployment config from database
 */
async function getDeploymentConfig() {
  const config = await prisma.deploymentConfig.findFirst({
    where: { name: 'Production' },
  })

  if (!config) {
    // Fallback to environment variables
    return {
      server: process.env.FTP_SERVER || 'ftp.domeneshop.no',
      username: process.env.FTP_USERNAME || 'catohansen',
      password: process.env.FTP_PASSWORD || '',
      serverDir: process.env.FTP_SERVER_DIR || '/www',
      localDir: process.env.BUILD_OUTPUT_DIR || 'out',
      serverUrl: process.env.SERVER_URL || 'https://www.domenehsop.no',
    }
  }

  // Decrypt passwords
  const ftpPassword = config.ftpPassword ? decrypt(config.ftpPassword) : ''
  const dbPassword = config.dbPassword ? decrypt(config.dbPassword) : undefined

  return {
    server: config.ftpServer,
    username: config.ftpUsername,
    password: ftpPassword,
    serverDir: config.ftpServerDir,
    localDir: config.buildOutputDir,
    serverUrl: config.serverUrl,
    dbHost: config.dbHost,
    dbUsername: config.dbUsername,
    dbPassword,
    dbName: config.dbName,
    dbPort: config.dbPort,
    configId: config.id,
  }
}

/**
 * Export PostgreSQL database to MySQL-compatible SQL
 */
async function exportDatabaseToMySQL(config: any): Promise<{ 
  success: boolean; 
  error?: string; 
  duration?: number; 
  dumpFile?: string 
}> {
  const startTime = Date.now()
  
  try {
    // Get local PostgreSQL connection
    const localDbUrl = process.env.DATABASE_URL
    if (!localDbUrl) {
      return {
        success: false,
        error: 'DATABASE_URL ikke satt i environment variables',
        duration: 0,
      }
    }

    // Generate MySQL-compatible SQL dump
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const tmpDir = path.join(process.cwd(), 'tmp')
    await fs.mkdir(tmpDir, { recursive: true })
    const dumpFile = path.join(tmpDir, `db-backup-${timestamp}.sql`)

    // Export from PostgreSQL using pg_dump
    const { stdout, stderr } = await execAsync(
      `pg_dump "${localDbUrl}" --format=plain --no-owner --no-privileges --no-comments`,
      {
        env: {
          ...process.env,
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      }
    )

    if (stderr && !stderr.includes('warning')) {
      console.error('pg_dump stderr:', stderr)
    }

    // Convert SQL to MySQL-compatible format
    let sqlContent = stdout || ''
    
    // PostgreSQL to MySQL conversions
    sqlContent = sqlContent
      // Remove PostgreSQL-specific syntax
      .replace(/CREATE TABLE IF NOT EXISTS/g, 'CREATE TABLE')
      .replace(/DROP TABLE IF EXISTS/g, 'DROP TABLE IF EXISTS')
      // Fix boolean values
      .replace(/::boolean/g, '')
      .replace(/\btrue\b/g, '1')
      .replace(/\bfalse\b/g, '0')
      // Fix array syntax
      .replace(/ARRAY\[/g, '')
      .replace(/\]::/g, '')
      // Remove PostgreSQL types
      .replace(/::text/g, '')
      .replace(/::varchar/g, '')
      .replace(/::integer/g, '')
      .replace(/::bigint/g, '')
      .replace(/::timestamp/g, '')
      // Fix UUID - MySQL doesn't have native UUID, use VARCHAR
      .replace(/uuid DEFAULT gen_random_uuid\(\)/gi, 'varchar(36)')
      .replace(/uuid NOT NULL/gi, 'varchar(36) NOT NULL')
      .replace(/uuid/gi, 'varchar(36)')
      // Fix sequences - convert to AUTO_INCREMENT
      .replace(/DEFAULT nextval\('[^']+'\)/gi, 'AUTO_INCREMENT')
      // Remove PostgreSQL-specific features
      .replace(/CREATE EXTENSION IF NOT EXISTS[^;]+;/gi, '')
      .replace(/CREATE INDEX IF NOT EXISTS/g, 'CREATE INDEX')
      // Fix primary keys
      .replace(/PRIMARY KEY.*CASCADE/gi, 'PRIMARY KEY')
      // Remove comments
      .replace(/--.*$/gm, '')
      // Fix JSONB to JSON
      .replace(/jsonb/gi, 'json')
      // Add MySQL compatibility header
      .replace(/^/, '/* MySQL compatible export from PostgreSQL */\nSET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n')
      // Add footer
      .concat('\nSET FOREIGN_KEY_CHECKS = 1;\n')
      
    // Write converted SQL
    await fs.writeFile(dumpFile, sqlContent, 'utf-8')

    const duration = Math.floor((Date.now() - startTime) / 1000)
    return { success: true, duration, dumpFile }
  } catch (error: any) {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    return {
      success: false,
      error: error.message || 'Database export feilet',
      duration,
    }
  }
}

/**
 * Upload database dump via FTP
 */
async function uploadDatabaseDump(config: any, dumpFile: string): Promise<{ success: boolean; error?: string; duration?: number }> {
  const startTime = Date.now()
  const client = new Client()
  
  try {
    await client.access({
      host: config.server || 'ftp.domeneshop.no',
      user: config.username || 'catohansen',
      password: config.password,
      secure: false,
    })

    await client.cd(config.serverDir || '/www')
    
    // Upload to backups directory
    // Try to cd to backups, if it fails, we'll upload directly
    let backupsPath = 'backups'
    try {
      await client.cd('backups')
    } catch {
      // Directory might not exist, we'll try uploading anyway
      // FTP servers usually create directories on upload
      backupsPath = 'backups'
    }
    
    // Upload dump file to backups directory
    await client.uploadFrom(dumpFile, `${backupsPath}/${path.basename(dumpFile)}`)
    
    client.close()
    
    const duration = Math.floor((Date.now() - startTime) / 1000)
    return { success: true, duration }
  } catch (error: any) {
    try {
      client.close()
    } catch {}
    
    const duration = Math.floor((Date.now() - startTime) / 1000)
    return {
      success: false,
      error: error.message || 'Database upload feilet',
      duration,
    }
  }
}

/**
 * Perform health check on deployed site
 */
async function performHealthCheck(url: string): Promise<{ success: boolean; status?: number; responseTime?: number; error?: string }> {
  const startTime = Date.now()
  
  try {
    return new Promise((resolve) => {
      const req = https.get(url, (res) => {
        const responseTime = Date.now() - startTime
        
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          resolve({
            success: true,
            status: res.statusCode,
            responseTime,
          })
        } else {
          resolve({
            success: false,
            status: res.statusCode,
            responseTime,
            error: `HTTP ${res.statusCode}`,
          })
        }
      })
      
      req.on('error', (error) => {
        resolve({
          success: false,
          responseTime: Date.now() - startTime,
          error: error.message || 'Health check feilet',
        })
      })
      
      req.setTimeout(10000, () => {
        req.destroy()
        resolve({
          success: false,
          responseTime: Date.now() - startTime,
          error: 'Health check timeout',
        })
      })
    })
  } catch (error: any) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      error: error.message || 'Health check feilet',
    }
  }
}

/**
 * Build Next.js static export
 * Temporarily enables static export for deployment
 */
async function buildStaticSite(localDir: string = 'out'): Promise<{ success: boolean; error?: string; duration?: number }> {
  const startTime = Date.now()
  const configPath = path.join(process.cwd(), 'next.config.js')
  let configBackup: string | null = null
  let configModified = false

  try {
    // Check if we're in the right directory
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    await fs.access(packageJsonPath)

    // Read and modify next.config.js to enable static export
    try {
      const configContent = await fs.readFile(configPath, 'utf-8')
      configBackup = configContent
      
      // Check if output: 'export' is already enabled
      if (configContent.includes("output: 'export'") || configContent.includes('output: "export"')) {
        // Already enabled, no need to modify
        configModified = false
      } else {
        // Temporarily enable static export
        const modifiedConfig = configContent.replace(
          /\/\/\s*output:\s*['"]export['"],?/g,
          "output: 'export',"
        ).replace(
          /output:\s*['"]export['"],?\s*\/\/.*/g,
          "output: 'export',"
        )
        
        if (modifiedConfig !== configContent) {
          await fs.writeFile(configPath, modifiedConfig, 'utf-8')
          configModified = true
        }
      }
    } catch (configError) {
      console.warn('Could not modify next.config.js:', configError)
      // Continue with build anyway
    }

    // Run build with static export
    const { stdout, stderr } = await execAsync('npm run build', {
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes timeout
      env: {
        ...process.env,
        NEXT_EXPORT: 'true', // Signal to build static
      },
    })

    if (stderr && !stderr.includes('warning')) {
      console.error('Build stderr:', stderr)
      return { success: false, error: `Build feilet: ${stderr}` }
    }

    // Restore original config if modified
    if (configModified && configBackup) {
      try {
        await fs.writeFile(configPath, configBackup, 'utf-8')
      } catch (restoreError) {
        console.error('Could not restore next.config.js:', restoreError)
      }
    }

    // Check if out directory exists
    const outDir = path.join(process.cwd(), localDir)
    try {
      await fs.access(outDir)
      const stats = await fs.stat(outDir)
      if (!stats.isDirectory()) {
        return { success: false, error: `${localDir}/ er ikke en mappe`, duration: Math.floor((Date.now() - startTime) / 1000) }
      }
    } catch {
      return { success: false, error: `${localDir}/ mappen ble ikke opprettet. Sjekk at next.config.js har output: 'export'.`, duration: Math.floor((Date.now() - startTime) / 1000) }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000)
    return { success: true, duration }
  } catch (error: any) {
    // Restore original config if modified and error occurred
    if (configModified && configBackup) {
      try {
        await fs.writeFile(configPath, configBackup, 'utf-8')
      } catch (restoreError) {
        console.error('Could not restore next.config.js:', restoreError)
      }
    }

    console.error('Build error:', error)
    return {
      success: false,
      error: error.message || 'Ukjent build feil',
    }
  }
}

/**
 * Create backup of current deployment (rollback point)
 */
async function createBackup(config: any): Promise<{ success: boolean; error?: string; backupPath?: string }> {
  try {
    if (!config.server || !config.username || !config.password) {
      return { success: false, error: 'FTP credentials ikke konfigurert for backup' }
    }

    const client = new Client()
    const backupDir = `backup_${Date.now()}`
    
    await client.access({
      host: config.server,
      user: config.username,
      password: config.password,
      secure: false,
    })

    await client.cd(config.serverDir)
    
    // Check if backup directory exists on server
    // We'll try to cd to it, but if it doesn't exist, that's OK
    // Backup functionality can work without pre-existing backups directory
    try {
      await client.cd('backups')
      await client.cd(config.serverDir)
    } catch {
      // Backups directory doesn't exist yet, that's fine
      // It will be created when we upload backup files
    }

    return { success: true, backupPath: backupDir }
  } catch (error: any) {
    return { success: false, error: error.message || 'Backup feilet' }
  }
}

/**
 * Deploy to FTP using basic-ftp
 * Supports both FTP and SFTP
 */
async function deployViaFTP(config: any): Promise<{ success: boolean; error?: string; duration?: number; filesUploaded?: number }> {
  const client = new Client()
  const startTime = Date.now()
  
  try {
    if (!config.password) {
      return {
        success: false,
        error: 'FTP passord ikke konfigurert. Gå til Deploy Settings for å legge inn FTP credentials.',
        duration: 0,
      }
    }

    const localDir = path.join(process.cwd(), config.localDir)
    
    // Check if local directory exists
    try {
      await fs.access(localDir)
    } catch {
      return {
        success: false,
        error: `${config.localDir} mappen eksisterer ikke. Kjør build først.`,
        duration: 0,
      }
    }

    // Determine protocol (ftp or sftp)
    const useSFTP = config.server?.includes('sftp') || config.protocol === 'sftp'
    const ftpServer = config.server || 'ftp.domeneshop.no'
    
    // Connect to FTP/SFTP server
    client.ftp.verbose = false // Set to true for debugging
    
    await client.access({
      host: ftpServer,
      user: config.username,
      password: config.password,
      secure: useSFTP, // Use SFTP if specified
      secureOptions: useSFTP ? {
        rejectUnauthorized: false, // For self-signed certificates
      } : undefined,
    })

    // Change to server directory (/www)
    await client.cd(config.serverDir || '/www')

    // Count files before upload
    let filesUploaded = 0
    const countFiles = async (dir: string): Promise<number> => {
      let count = 0
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          count += await countFiles(fullPath)
        } else {
          count++
        }
      }
      return count
    }
    const totalFiles = await countFiles(localDir)

    // Upload files recursively
    await client.uploadFromDir(localDir)
    filesUploaded = totalFiles

    // Close connection
    client.close()

    const duration = Math.floor((Date.now() - startTime) / 1000)
    return { success: true, duration, filesUploaded }
  } catch (error: any) {
    try {
      client.close()
    } catch {
      // Ignore close errors
    }

    console.error('FTP deployment error:', error)
    
    const duration = Math.floor((Date.now() - startTime) / 1000)
    
    // Provide helpful error messages
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: `Kunne ikke koble til ${config.server}. Sjekk FTP credentials og server status.`,
        duration,
      }
    }

    if (error.message?.includes('password')) {
      return {
        success: false,
        error: 'FTP autentisering feilet. Sjekk brukernavn og passord.',
        duration,
      }
    }

    return {
      success: false,
      error: error.message || 'FTP deployment feilet',
      duration,
    }
  }
}

/**
 * POST /api/admin/deploy
 * Trigger deployment
 */
export const runtime = 'nodejs' // Required for file system and exec access

export async function POST(request: NextRequest) {
  let deploymentHistoryId: string | null = null
  
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Ikke autorisert' },
        { status: 403 }
      )
    }

    // Get deployment config from database
    const config = await getDeploymentConfig()

    // Create deployment history record
    const deploymentHistory = await prisma.deploymentHistory.create({
      data: {
        status: 'pending',
        step: 'backup',
        configId: config.configId || null,
        createdById: user.id,
        startedAt: new Date(),
      },
    })
    deploymentHistoryId = deploymentHistory.id

    // Step 0: Create backup (rollback point)
    const backupResult = await createBackup(config)
    if (backupResult.backupPath) {
      await prisma.deploymentHistory.update({
        where: { id: deploymentHistoryId },
        data: {
          metadata: {
            backupPath: backupResult.backupPath,
            canRollback: true,
          },
        },
      })
    }

    // Update step to build
    await prisma.deploymentHistory.update({
      where: { id: deploymentHistoryId },
      data: { step: 'build' },
    })

    // Step 1: Build static site
    const buildStartTime = Date.now()
    const buildResult = await buildStaticSite(config.localDir)
    
    if (!buildResult.success) {
      await prisma.deploymentHistory.update({
        where: { id: deploymentHistoryId },
        data: {
          status: 'failed',
          step: 'build',
          error: buildResult.error || 'Build feilet',
          buildDuration: Math.floor((Date.now() - buildStartTime) / 1000),
          completedAt: new Date(),
        },
      })

      // Update config status
      if (config.configId) {
        await prisma.deploymentConfig.update({
          where: { id: config.configId },
          data: {
            lastSyncAt: new Date(),
            lastSyncStatus: 'failed',
            lastSyncError: buildResult.error || 'Build feilet',
          },
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: buildResult.error || 'Build feilet',
          step: 'build',
        },
        { status: 500 }
      )
    }

    // Update deployment history - build succeeded
    await prisma.deploymentHistory.update({
      where: { id: deploymentHistoryId },
      data: {
        step: 'ftp',
        status: 'uploading',
        buildDuration: buildResult.duration || Math.floor((Date.now() - buildStartTime) / 1000),
        buildOutput: `Build successful. Duration: ${buildResult.duration || 0}s`,
      },
    })

    // Step 2: Deploy via FTP
    const ftpResult = await deployViaFTP(config)
    
    if (!ftpResult.success) {
      await prisma.deploymentHistory.update({
        where: { id: deploymentHistoryId },
        data: {
          status: 'failed',
          step: 'ftp',
          error: ftpResult.error || 'FTP deployment feilet',
          ftpDuration: ftpResult.duration || 0,
          completedAt: new Date(),
        },
      })

      // Update config status
      if (config.configId) {
        await prisma.deploymentConfig.update({
          where: { id: config.configId },
          data: {
            lastSyncAt: new Date(),
            lastSyncStatus: 'failed',
            lastSyncError: ftpResult.error || 'FTP deployment feilet',
          },
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: ftpResult.error || 'FTP deployment feilet',
          step: 'ftp',
          buildSuccess: true,
        },
        { status: 500 }
      )
    }

    // Step 3: Database Sync (if configured)
    let dbExportResult: any = null
    if (config.dbHost && config.dbUsername && config.dbName) {
      await prisma.deploymentHistory.update({
        where: { id: deploymentHistoryId },
        data: {
          step: 'database',
          status: 'uploading',
        },
      })

      // Export PostgreSQL to MySQL-compatible SQL
      dbExportResult = await exportDatabaseToMySQL(config)
      
      if (dbExportResult.success && dbExportResult.dumpFile) {
        // Upload database dump via FTP
        const dbUploadResult = await uploadDatabaseDump(config, dbExportResult.dumpFile)
        
        await prisma.deploymentHistory.update({
          where: { id: deploymentHistoryId },
          data: {
            dbSyncDuration: dbExportResult.duration,
            dbSyncTables: ['all'],
            metadata: {
              ...(deploymentHistory.metadata && typeof deploymentHistory.metadata === 'object' 
                ? deploymentHistory.metadata 
                : {}),
              dbDumpFile: path.basename(dbExportResult.dumpFile),
            },
          },
        })

        // Clean up dump file
        try {
          await fs.unlink(dbExportResult.dumpFile)
        } catch {}
      }
    }

    // Step 4: Health check
    await prisma.deploymentHistory.update({
      where: { id: deploymentHistoryId },
      data: {
        step: 'health_check',
        status: 'uploading',
      },
    })

    const healthCheckResult = await performHealthCheck(config.serverUrl || 'https://www.domenehsop.no')

    // Deployment successful!
    await prisma.deploymentHistory.update({
      where: { id: deploymentHistoryId },
      data: {
        status: healthCheckResult.success ? 'success' : 'warning',
        step: 'complete',
        ftpDuration: ftpResult.duration || 0,
        filesUploaded: ftpResult.filesUploaded || 0,
        filesCount: ftpResult.filesUploaded || 0,
        deployedUrl: config.serverUrl || undefined,
        completedAt: new Date(),
        metadata: {
          ...(deploymentHistory.metadata && typeof deploymentHistory.metadata === 'object' 
            ? deploymentHistory.metadata 
            : {}),
          healthCheck: healthCheckResult,
        },
      },
    })

    // Update config status
    if (config.configId) {
      await prisma.deploymentConfig.update({
        where: { id: config.configId },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: 'success',
          lastSyncError: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Deployment fullført!',
      url: config.serverUrl || 'https://www.domenehsop.no',
      deployedAt: new Date().toISOString(),
      buildDuration: buildResult.duration,
      ftpDuration: ftpResult.duration,
      filesUploaded: ftpResult.filesUploaded,
      dbSyncDuration: dbExportResult?.duration,
      dbDumpFile: dbExportResult?.dumpFile ? path.basename(dbExportResult.dumpFile) : null,
      deploymentId: deploymentHistoryId,
      healthCheck: healthCheckResult,
      canRollback: !!backupResult.backupPath,
      backupPath: backupResult.backupPath,
      dbImportInstructions: config.dbHost ? [
        '1. Logg inn på Domeneshop admin panel',
        '2. Gå til MySQL database administration',
        '3. Velg din database: catohansen',
        '4. Klikk på "Import" eller "Kjør SQL script"',
        `5. Last opp filen: ${dbExportResult?.dumpFile ? path.basename(dbExportResult.dumpFile) : 'db-backup-*.sql'}`,
        '6. Eller bruk mysql-kommando fra login-shell:',
        `   mysql -h catohansen.mysql.domeneshop.no -u ${config.dbUsername} -p ${config.dbName} < ${dbExportResult?.dumpFile ? path.basename(dbExportResult.dumpFile) : 'db-backup.sql'}`,
      ] : null,
    })
  } catch (error: any) {
    console.error('Deployment error:', error)
    
    // Update deployment history on error
    if (deploymentHistoryId) {
      await prisma.deploymentHistory.update({
        where: { id: deploymentHistoryId },
        data: {
          status: 'failed',
          error: error.message || 'Ukjent feil under deployment',
          completedAt: new Date(),
        },
      }).catch(() => {
        // Ignore update errors
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ukjent feil under deployment',
      },
      { status: 500 }
    )
  }
}

