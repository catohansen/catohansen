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
 * Compliance Mapper
 * Maps policies to compliance frameworks (SOC2, ISO27001, GDPR)
 * 
 * Features:
 * - Compliance framework mapping
 * - Control mapping
 * - Evidence generation
 * - Compliance reporting
 */

export interface ComplianceFramework {
  id: string
  name: string
  version: string
  controls: ComplianceControl[]
}

export interface ComplianceControl {
  id: string
  name: string
  description: string
  category: string
  mappings?: string[] // Related policy IDs
}

export interface ComplianceMapping {
  policyId: string
  policyName: string
  framework: string
  controls: string[]
  evidence: {
    type: 'policy' | 'audit-log' | 'metric'
    data: any
  }[]
}

export class ComplianceMapper {
  private frameworks: Map<string, ComplianceFramework> = new Map()
  private mappings: Map<string, ComplianceMapping[]> = new Map()

  constructor() {
    this.initializeFrameworks()
  }

  /**
   * Initialize compliance frameworks
   */
  private initializeFrameworks(): void {
    // SOC2
    this.frameworks.set('SOC2', {
      id: 'SOC2',
      name: 'SOC 2 Type II',
      version: '2023',
      controls: [
        { id: 'CC1.1', name: 'Control Environment', description: 'Control environment for security', category: 'Security', mappings: [] },
        { id: 'CC6.1', name: 'Logical and Physical Access Controls', description: 'Logical and physical access controls', category: 'Security', mappings: [] },
        { id: 'CC7.1', name: 'System Operations', description: 'System operations controls', category: 'Security', mappings: [] },
        { id: 'CC6.7', name: 'Data Encryption', description: 'Data encryption controls', category: 'Security', mappings: [] }
      ]
    })

    // ISO27001
    this.frameworks.set('ISO27001', {
      id: 'ISO27001',
      name: 'ISO/IEC 27001',
      version: '2022',
      controls: [
        { id: 'A.9.1', name: 'Access control policy', description: 'Access control policy', category: 'Access Control', mappings: [] },
        { id: 'A.9.2', name: 'User access management', description: 'User access management', category: 'Access Control', mappings: [] },
        { id: 'A.9.2.3', name: 'Management of privileged access rights', description: 'Management of privileged access rights', category: 'Access Control', mappings: [] },
        { id: 'A.10.1', name: 'Cryptographic controls', description: 'Cryptographic controls', category: 'Cryptography', mappings: [] },
        { id: 'A.12.4', name: 'Logging and monitoring', description: 'Logging and monitoring', category: 'Operations Security', mappings: [] }
      ]
    })

    // GDPR
    this.frameworks.set('GDPR', {
      id: 'GDPR',
      name: 'General Data Protection Regulation',
      version: '2018',
      controls: [
        { id: 'Art.15', name: 'Right of access', description: 'Right of access by the data subject', category: 'Data Subject Rights', mappings: [] },
        { id: 'Art.17', name: 'Right to erasure', description: 'Right to erasure (right to be forgotten)', category: 'Data Subject Rights', mappings: [] },
        { id: 'Art.6', name: 'Lawfulness of processing', description: 'Lawfulness of processing', category: 'Principles', mappings: [] },
        { id: 'Art.33', name: 'Data breach notification', description: 'Notification of a personal data breach to the supervisory authority', category: 'Data Breach', mappings: [] },
        { id: 'Art.32', name: 'Security of processing', description: 'Security of processing', category: 'Security', mappings: [] }
      ]
    })
  }

  /**
   * Map policy to compliance framework
   */
  mapPolicy(policyId: string, policyName: string, frameworkId: string, controlIds: string[]): ComplianceMapping {
    const mapping: ComplianceMapping = {
      policyId,
      policyName,
      framework: frameworkId,
      controls: controlIds,
      evidence: [
        {
          type: 'policy',
          data: {
            policyId,
            policyName,
            mappedAt: new Date().toISOString()
          }
        }
      ]
    }

    // Store mapping
    const key = `${frameworkId}:${policyId}`
    const existing = this.mappings.get(key) || []
    existing.push(mapping)
    this.mappings.set(key, existing)

    return mapping
  }

  /**
   * Get compliance mappings for framework
   */
  getMappings(frameworkId: string): ComplianceMapping[] {
    const allMappings: ComplianceMapping[] = []
    
    for (const mappings of Array.from(this.mappings.values())) {
      allMappings.push(...mappings.filter(m => m.framework === frameworkId))
    }

    return allMappings
  }

  /**
   * Get compliance status for framework
   */
  getComplianceStatus(frameworkId: string): {
    framework: ComplianceFramework | undefined
    mappedControls: number
    totalControls: number
    coverage: number
    mappings: ComplianceMapping[]
  } {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) {
      return {
        framework: undefined,
        mappedControls: 0,
        totalControls: 0,
        coverage: 0,
        mappings: []
      }
    }

    const mappings = this.getMappings(frameworkId)
    const mappedControlIds = new Set<string>()
    
    for (const mapping of mappings) {
      for (const controlId of mapping.controls) {
        mappedControlIds.add(controlId)
      }
    }

    return {
      framework,
      mappedControls: mappedControlIds.size,
      totalControls: framework.controls.length,
      coverage: framework.controls.length > 0
        ? (mappedControlIds.size / framework.controls.length) * 100
        : 0,
      mappings
    }
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(frameworkId: string): {
    framework: string
    status: string
    coverage: number
    mappedPolicies: string[]
    unmappedControls: string[]
    recommendations: string[]
  } {
    const status = this.getComplianceStatus(frameworkId)
    
    if (!status.framework) {
      return {
        framework: frameworkId,
        status: 'not-found',
        coverage: 0,
        mappedPolicies: [],
        unmappedControls: [],
        recommendations: [`Framework '${frameworkId}' not found`]
      }
    }

    const mappedPolicyIds = new Set<string>()
    for (const mapping of status.mappings) {
      mappedPolicyIds.add(mapping.policyId)
    }

    const unmappedControls = status.framework.controls
      .filter(control => !status.mappings.some(m => m.controls.includes(control.id)))
      .map(control => control.id)

    const recommendations: string[] = []
    if (status.coverage < 50) {
      recommendations.push('Less than 50% coverage - consider mapping more policies to controls')
    }
    if (unmappedControls.length > 0) {
      recommendations.push(`Map policies to unmapped controls: ${unmappedControls.slice(0, 5).join(', ')}`)
    }

    return {
      framework: frameworkId,
      status: status.coverage >= 80 ? 'compliant' : status.coverage >= 50 ? 'partially-compliant' : 'non-compliant',
      coverage: status.coverage,
      mappedPolicies: Array.from(mappedPolicyIds),
      unmappedControls,
      recommendations
    }
  }

  /**
   * Get all frameworks
   */
  getFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values())
  }
}

// Default compliance mapper instance
export const complianceMapper = new ComplianceMapper()

