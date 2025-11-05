import { prisma } from '@/lib/prisma'

import { DebtAdminClient } from './parts/DebtAdminClient'

export default async function DebtAdminPage() {
  // Get all debt profiles with related data
  const debtProfiles = await prisma.debtProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      },
      debtBills: true,
      debtLetters: true,
      debtBenefits: true,
      debtActions: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Calculate overall statistics
  const stats = {
    totalUsers: debtProfiles.length,
    criticalUsers: debtProfiles.filter((profile: Record<string, unknown>) => profile.riskLevel === 'CRITICAL').length,
    highRiskUsers: debtProfiles.filter((profile: Record<string, unknown>) => profile.riskLevel === 'HIGH').length,
    moderateRiskUsers: debtProfiles.filter((profile: Record<string, unknown>) => profile.riskLevel === 'MODERATE').length,
    lowRiskUsers: debtProfiles.filter((profile: Record<string, unknown>) => profile.riskLevel === 'LOW').length,
    totalBills: debtProfiles.reduce((sum: number, profile: Record<string, unknown>) => sum + (profile.debtBills as unknown[]).length, 0),
    totalDebt: debtProfiles.reduce((sum: number, profile: Record<string, unknown>) => 
      sum + (profile.debtBills as Record<string, unknown>[]).reduce((billSum: number, bill: Record<string, unknown>) => billSum + parseFloat(String(bill.amount)), 0), 0),
    sentLetters: debtProfiles.reduce((sum: number, profile: Record<string, unknown>) => 
      sum + (profile.debtLetters as Record<string, unknown>[]).filter((letter: Record<string, unknown>) => letter.status === 'SENT').length, 0),
    appliedBenefits: debtProfiles.reduce((sum: number, profile: Record<string, unknown>) => 
      sum + (profile.debtBenefits as Record<string, unknown>[]).filter((benefit: Record<string, unknown>) => benefit.status === 'APPLIED').length, 0),
    completedActions: debtProfiles.reduce((sum: number, profile: Record<string, unknown>) => 
      sum + (profile.debtActions as Record<string, unknown>[]).filter((action: Record<string, unknown>) => action.status === 'COMPLETED').length, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Gjeldsfri-modul - Admin
        </h1>
        <p className="text-gray-600">
          Oversikt over alle brukeres gjeldsfri-status og fremdrift
        </p>
      </div>

      {/* Admin Interface */}
      <DebtAdminClient 
        debtProfiles={debtProfiles}
        stats={stats}
      />
    </div>
  )
}

