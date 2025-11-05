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
 * File Readers
 * Utilities for reading different file types (PDF, MD, MDX, etc.)
 */

const pdfParse = require('pdf-parse')

/**
 * Read text from PDF buffer
 */
export async function readPDF(buf: Buffer): Promise<string> {
  try {
    const res = await pdfParse(buf)
    return res.text || ''
  } catch (error: any) {
    console.error('PDF parsing error:', error)
    throw new Error(`Failed to parse PDF: ${error.message}`)
  }
}

/**
 * Read text from Markdown buffer
 */
export async function readMD(buf: Buffer): Promise<string> {
  try {
    return buf.toString('utf-8')
  } catch (error: any) {
    console.error('MD reading error:', error)
    throw new Error(`Failed to read markdown: ${error.message}`)
  }
}


