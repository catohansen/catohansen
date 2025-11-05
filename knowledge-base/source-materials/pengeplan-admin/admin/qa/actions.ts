'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'

import { prisma } from '@/lib/prisma'

export interface NewReportData {
  title: string,

  description: string,

  testType: 'security' | 'functionality' | 'performance' | 'integration' | 'e2e'
  priority: 'low' | 'medium' | 'high' | 'critical'
  modules: string[],

  estimatedTests: number;
}

export async function createNewReport(data: NewReportData) {
  try {
    // Generate report ID and filename,

    const reportId = `QA_REPORT_${Date.now()}`
    const filename = `${reportId}.md`
    
    // Create report content,

    const reportContent = await generateReportContent(data, reportId);
    // Save report to file system,

    const filePath = await join(process.cwd(), 'qa', filename)
    await writeFile(filePath, reportContent, 'utf-8');
    // Log the creation in audit log,

    // await prisma.auditLog.create({
    //     data: {
    //       action: 'QA_REPORT_CREATED'
    //     }
    // });
    return {
      success: true,
      reportId,
      filename,
      message: 'QA rapport opprettet successfully'
    }
  } catch (error) {
    console.error('Error creating QA report:', error);
    return {
      success: false,
      error: 'Kunne ikke opprette QA rapport'
    }
  }
}

function generateReportContent(data: NewReportData, reportId: string): string {
  const currentDate = new Date().toLocaleDateString('nb-NO');
  const currentTime = new Date().toLocaleTimeString('nb-NO');

  return `# ${data.title}

**Rapport ID:** ${reportId}  
**Dato:** ${currentDate}  
**Tid:** ${currentTime}  
**Test Type:** ${data.testType.toUpperCase()}  
**Prioritet:** ${data.priority.toUpperCase()}  
**Status:** 🟡 PENDING
## 📋 Beskrivelse
${data.description}

## 🎯 Test Scope
**Moduler som skal testes:**
${data.modules.map(module => `- ${module}`).join('\n')}

**Estimert antall tester:** ${data.estimatedTests}

## 📊 Test Plan
### Forberedelse
- [ ] Test miljø satt opp
- [ ] Test data forberedt
- [ ] Test cases definert
- [ ] Test verktøy konfigurert
### Utførelse
- [ ] Enhetstester
- [ ] Integrasjonstester
- [ ] Funksjonalitetstester
- [ ] Sikkerhetstester
- [ ] Performance tester
### Rapportering
- [ ] Test resultater dokumentert
- [ ] Feil rapportert
- [ ] Anbefalinger gitt
- [ ] Rapport finalisert
## 🧪 Test Cases
### Test Case 1: [Navn]
- **Beskrivelse:** [Beskrivelse av testen]
- **Forventet resultat:** [Hva som skal skje]
- **Status:** ⏳ Pending
- **Resultat:** [Vil bli fylt ut under testing]

### Test Case 2: [Navn]
- **Beskrivelse:** [Beskrivelse av testen]
- **Forventet resultat:** [Hva som skal skje]
- **Status:** ⏳ Pending
- **Resultat:** [Vil bli fylt ut under testing]

## 📈 Resultater
**Test Oversikt:**
- Total tester: ${data.estimatedTests}
- Bestått: 0
- Feilet: 0
- Ikke kjørt: ${data.estimatedTests}
- Success rate: 0%

## 🐛 Identifiserte Feil
*Ingen feil identifisert ennå*

## 📝 Anbefalinger
*Anbefalinger vil bli lagt til etter test utførelse*

## ✅ Konklusjon
*Konklusjon vil bli lagt til etter test utførelse*

---

**Opprettet av:** QA System
**Dato:** ${currentDate}
**Versjon:** Pengeplan v0.2.6
`
}

export async function getQATemplates() {
  return [
    {
      id: 'security-audit',
      name: 'Security Audit',
      description: 'Omfattende sikkerhetstest av systemet',
      testType: 'security' as const,
      priority: 'high' as const,
      modules: ['Authentication', 'Authorization', 'Input Validation', 'Data Protection'],
      estimatedTests: 15
    },
    {
      id: 'functionality-test',
      name: 'Functionality Test',
      description: 'Test av alle hovedfunksjoner',
      testType: 'functionality' as const,
      priority: 'medium' as const,
      modules: ['User Management', 'Budget System', 'Reports', 'AI Features'],
      estimatedTests: 20
    },
    {
      id: 'performance-test',
      name: 'Performance Test',
      description: 'Test av systemets ytelse og responsivitet',
      testType: 'performance' as const,
      priority: 'medium' as const,
      modules: ['Database', 'API Endpoints', 'Frontend', 'File Operations'],
      estimatedTests: 10
    },
    {
      id: 'integration-test',
      name: 'Integration Test',
      description: 'Test av integrasjoner og API-er',
      testType: 'integration' as const,
      priority: 'high' as const,
      modules: ['External APIs', 'Database', 'File System', 'Email System'],
      estimatedTests: 12
    },
    {
      id: 'e2e-test',
      name: 'End-to-End Test',
      description: 'Komplett brukerflyt testing',
      testType: 'e2e' as const,
      priority: 'critical' as const,
      modules: ['User Registration', 'Login Flow', 'Budget Creation', 'Report Generation'],
      estimatedTests: 8
    }
  ]
}
















;