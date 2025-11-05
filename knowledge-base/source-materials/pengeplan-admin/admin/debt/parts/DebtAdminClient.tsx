'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Target, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  FileText,
  Star,
  Mail,
  Search,
  Eye,
  BarChart3
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DebtAdminClientProps {
  debtProfiles: Record<string, unknown>[]
  stats: {
    totalUsers: number
    criticalUsers: number
    highRiskUsers: number
    moderateRiskUsers: number
    lowRiskUsers: number
    totalBills: number
    totalDebt: number
    sentLetters: number
    appliedBenefits: number
    completedActions: number
  }
}

export function DebtAdminClient({ debtProfiles, stats }: DebtAdminClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('ALL')

  const filteredProfiles = debtProfiles.filter(profile => {
    const matchesSearch = String((profile.user as Record<string, unknown>).email).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String((profile.user as Record<string, unknown>).name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = selectedRiskLevel === 'ALL' || profile.riskLevel === selectedRiskLevel
    return matchesSearch && matchesRisk
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '🚨'
      case 'HIGH': return '⚠️'
      case 'MODERATE': return '⚡'
      case 'LOW': return '✅'
      default: return '📊'
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('no-NO') + ' kr'
  }

  const getProgressPercentage = (profile: Record<string, unknown>) => {
    if ((profile.debtActions as unknown[]).length === 0) return 0
    const completed = (profile.debtActions as Record<string, unknown>[]).filter((action: Record<string, unknown>) => action.status === 'COMPLETED').length
    return Math.round((completed / (profile.debtActions as unknown[]).length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Totalt brukere</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Kritiske brukere</p>
                <p className="text-2xl font-bold text-gray-900">{stats.criticalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total gjeld</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDebt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Fullførte oppgaver</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Risikofordeling
          </CardTitle>
          <CardDescription>
            Fordeling av brukere etter risikonivå
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.criticalUsers}</div>
              <div className="text-sm text-red-800">Kritisk</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.highRiskUsers}</div>
              <div className="text-sm text-orange-800">Høy risiko</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.moderateRiskUsers}</div>
              <div className="text-sm text-yellow-800">Moderat risiko</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.lowRiskUsers}</div>
              <div className="text-sm text-green-800">Lav risiko</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Brukeroversikt</CardTitle>
          <CardDescription>
            Alle brukere med gjeldsfri-profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Søk etter bruker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Alle risikonivåer</option>
              <option value="CRITICAL">Kritisk</option>
              <option value="HIGH">Høy risiko</option>
              <option value="MODERATE">Moderat risiko</option>
              <option value="LOW">Lav risiko</option>
            </select>
          </div>

          {/* User Table */}
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <div key={String(profile.id)} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{String((profile.user as Record<string, unknown>).name) || 'Ukjent navn'}</h3>
                      <Badge className={getRiskColor(String(profile.riskLevel))}>
                        {getRiskIcon(String(profile.riskLevel))} {String(profile.riskLevel)}
                      </Badge>
                      <span className="text-sm text-gray-500">{String((profile.user as Record<string, unknown>).email)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">Regninger:</span>
                        <span className="font-medium">{(profile.debtBills as unknown[]).length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-red-600" />
                        <span className="text-gray-600">Gjeld:</span>
                        <span className="font-medium">
                          {formatCurrency((profile.debtBills as Record<string, unknown>[]).reduce((sum: number, bill: Record<string, unknown>) => 
                            sum + parseFloat(String(bill.amount)), 0))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Sendte brev:</span>
                        <span className="font-medium">
                          {(profile.debtLetters as Record<string, unknown>[]).filter((letter: Record<string, unknown>) => letter.status === 'SENT').length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">Støtteordninger:</span>
                        <span className="font-medium">
                          {(profile.debtBenefits as Record<string, unknown>[]).filter((benefit: Record<string, unknown>) => benefit.status === 'APPLIED').length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600">Fremdrift:</span>
                        <span className="font-medium">{getProgressPercentage(profile)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/debt?userId=${String((profile.user as Record<string, unknown>).id)}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Se profil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProfiles.length === 0 && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Ingen brukere funnet</p>
                <p className="text-sm text-gray-500">Prøv å endre søkekriteriene</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

