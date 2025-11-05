#!/usr/bin/env tsx
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
 * CLI Script for Batch Ingest
 * Ingests multiple files (PDF, MD, MDX) into knowledge base with embeddings
 * 
 * Usage:
 *   tsx scripts/ingest.ts <folder-or-file>
 *   tsx scripts/ingest.ts ./docs/pdfs
 *   tsx scripts/ingest.ts ./knowledge-base/source-materials/file.pdf
 */

import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../src/lib/db/prisma'
import { readPDF, readMD } from '../src/lib/kb/readers'
import { chunkText } from '../src/lib/kb/chunk'
import { getEmbeddingProvider } from '../src/lib/embeddings'

async function ingestFile(absPath: string) {
  try {
    const ext = path.extname(absPath).toLowerCase().replace('.', '')
    const title = path.basename(absPath, path.extname(absPath))
    
    console.log(`📄 Processing: ${title} (${ext})`)

    const buf = fs.readFileSync(absPath)
    let text = ''

    // Read based on file type
    if (ext === 'pdf') {
      text = await readPDF(buf)
    } else if (ext === 'mdx' || ext === 'md') {
      text = await readMD(buf) // MDX handled same as MD for now
    } else {
      console.warn(`⚠️  Unknown file type: ${ext}, skipping`)
      return
    }

    if (!text.trim()) {
      console.warn(`⚠️  No text extracted from ${title}, skipping`)
      return
    }

    // Check if document already exists
    const existing = await prisma.knowledgeDocument.findFirst({
      where: {
        path: absPath
      }
    })

    if (existing) {
      console.log(`ℹ️  Document already exists: ${title}, skipping`)
      return
    }

    // Create document
    const doc = await prisma.knowledgeDocument.create({
      data: {
        title,
        source: ext,
        path: absPath
      }
    })

    // Chunk text
    const { chunks, tokensApprox } = chunkText(text, 2000)

    if (chunks.length === 0) {
      console.warn(`⚠️  No chunks generated from ${title}, deleting document`)
      await prisma.knowledgeDocument.delete({ where: { id: doc.id } })
      return
    }

    console.log(`   → Generated ${chunks.length} chunks`)

    // Generate embeddings
    console.log(`   → Generating embeddings...`)
    const provider = getEmbeddingProvider()
    const { vectors, dims } = await provider.embed({ texts: chunks })

    if (vectors.length !== chunks.length) {
      throw new Error('Embedding generation failed - vector count mismatch')
    }

    console.log(`   → Generated ${vectors.length} embeddings (${dims} dimensions)`)

    // Create chunks and embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = await prisma.knowledgeChunk.create({
        data: {
          docId: doc.id,
          chunkIndex: i,
          content: chunks[i],
          tokens: tokensApprox[i]
        }
      })

      // Update embedding_vec using raw SQL
      const vectorLiteral = JSON.stringify(vectors[i])
      
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeChunk" SET embedding_vec = $1::vector WHERE id = $2`,
        vectorLiteral,
        chunk.id
      )

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`   → Processed ${i + 1}/${chunks.length} chunks\r`)
      }
    }

    console.log(`✅ Ingested ${title} → ${chunks.length} chunks`)
  } catch (error: any) {
    console.error(`❌ Error ingesting ${absPath}:`, error.message)
    throw error
  }
}

async function main() {
  const inputPath = process.argv[2]

  if (!inputPath) {
    console.error('Usage: tsx scripts/ingest.ts <folder-or-file>')
    console.error('Example: tsx scripts/ingest.ts ./docs/pdfs')
    process.exit(1)
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Path does not exist: ${inputPath}`)
    process.exit(1)
  }

  const stat = fs.statSync(inputPath)
  const files: string[] = []

  // Get all PDF, MD, MDX files recursively
  function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const dirFiles = fs.readdirSync(dir)
    
    for (const file of dirFiles) {
      const filePath = path.join(dir, file)
      try {
        const fileStat = fs.statSync(filePath)
        
        if (fileStat.isDirectory()) {
          getAllFiles(filePath, fileList)
        } else if (/\.(pdf|md|mdx)$/i.test(file)) {
          fileList.push(filePath)
        }
      } catch (error: any) {
        console.warn(`⚠️  Skipping ${filePath}: ${error.message}`)
      }
    }
    
    return fileList
  }

  if (stat.isDirectory()) {
    const allFiles = getAllFiles(inputPath)
    files.push(...allFiles)
    
    console.log(`📁 Found ${files.length} files in ${inputPath}`)
  } else {
    if (!/\.(pdf|md|mdx)$/i.test(inputPath)) {
      console.error(`Error: File must be PDF, MD, or MDX: ${inputPath}`)
      process.exit(1)
    }
    files.push(inputPath)
  }

  if (files.length === 0) {
    console.warn('No files found to ingest')
    process.exit(0)
  }

  console.log(`🚀 Starting ingest of ${files.length} file(s)...\n`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      await ingestFile(file)
      successCount++
    } catch (error: any) {
      console.error(`❌ Failed to ingest ${file}:`, error.message)
      errorCount++
    }
    console.log('') // Empty line between files
  }

  console.log(`\n✅ Ingest complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  await prisma.$disconnect()
  process.exit(errorCount > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})

