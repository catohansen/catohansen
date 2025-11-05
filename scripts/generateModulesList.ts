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
 * Generate Modules List Script
 * 
 * Auto-genererer src/data/modules.json fra MODULE_INFO.json filer i hver modul.
 * 
 * Usage:
 *   npm run generate:modules
 *   tsx scripts/generateModulesList.ts
 */

import fs from 'fs'
import path from 'path'

const modulesDir = path.join(process.cwd(), 'src/modules')
const outputFile = path.join(process.cwd(), 'src/data/modules.json')

interface ModuleInfo {
  id: string
  name: string
  displayName?: string
  version: string
  description: string
  author: string
  license: string
  category?: string
  status?: string
  features?: string[]
  pricing?: any
  [key: string]: any
}

function generateModulesList(): void {
  console.log('🔍 Scanning modules directory...')
  
  if (!fs.existsSync(modulesDir)) {
    console.error('❌ Modules directory not found:', modulesDir)
    process.exit(1)
  }

  const modules: ModuleInfo[] = []

  // Scan modules directory
  const entries = fs.readdirSync(modulesDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const modulePath = path.join(modulesDir, entry.name)
    const moduleInfoPath = path.join(modulePath, 'MODULE_INFO.json')

    if (!fs.existsSync(moduleInfoPath)) {
      console.warn(`⚠️  MODULE_INFO.json not found in ${entry.name}, skipping...`)
      continue
    }

    try {
      const moduleInfo: ModuleInfo = JSON.parse(
        fs.readFileSync(moduleInfoPath, 'utf-8')
      )

      // Enrich module info with additional fields
      const enrichedModule: any = {
        ...moduleInfo,
        displayName: moduleInfo.displayName || moduleInfo.name,
        link: `/modules/${moduleInfo.id}`,
        adminLink: `/admin/${moduleInfo.id}`,
        apiLink: `/api/v1/modules/${moduleInfo.id}`,
        image: `/img/${moduleInfo.id}.png`,
      }

      // Add icon mapping based on module id
      const iconMap: Record<string, string> = {
        'security2': 'Shield',
        'nora': 'Brain',
        'pengeplan': 'CreditCard',
        'resilient13': 'Zap',
        'crm': 'Briefcase',
        'mindmap': 'FileText',
      }
      enrichedModule.icon = iconMap[moduleInfo.id] || 'Package'

      // Add color gradient based on category
      const colorMap: Record<string, string> = {
        'Security': 'from-red-500 to-orange-500',
        'AI & Automation': 'from-purple-500 to-pink-500',
        'Finance': 'from-green-500 to-emerald-500',
        'Health & Wellness': 'from-blue-500 to-cyan-500',
        'Business': 'from-indigo-500 to-purple-500',
        'Productivity': 'from-violet-500 to-purple-500',
      }
      enrichedModule.color = colorMap[enrichedModule.category || ''] || 'from-purple-500 to-pink-500'

      modules.push(enrichedModule)
      console.log(`✅ Found module: ${moduleInfo.name} (${moduleInfo.id})`)
    } catch (error) {
      console.error(`❌ Error reading ${moduleInfoPath}:`, error)
    }
  }

  // Sort modules by name
  modules.sort((a, b) => a.name.localeCompare(b.name))

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write modules.json
  const modulesJson = JSON.stringify(modules, null, 2)
  fs.writeFileSync(outputFile, modulesJson, 'utf-8')

  console.log(`\n✅ Generated ${modules.length} modules:`)
  modules.forEach(m => {
    console.log(`   - ${m.displayName || m.name} (${m.id})`)
  })
  console.log(`\n📄 Output: ${outputFile}`)
}

// Run script
try {
  generateModulesList()
  console.log('\n✨ Done!')
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}



