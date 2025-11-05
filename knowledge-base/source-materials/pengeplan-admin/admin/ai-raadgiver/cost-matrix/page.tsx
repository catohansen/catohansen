import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  Settings,
  FileText,
  MessageCircle,
  Zap,
  DollarSign
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


export default async function CostMatrixAdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('pengeplan_session')
  
  if (!sessionCookie) {
    redirect('/login')
  }

  // Fetch user data server-side
  let user = null
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/me`, {
      headers: {
        cookie: `pengeplan_session=${sessionCookie.value}`
      }
    })
    
    if (response.ok) {
      user = await response.json()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }

  if (!user || user.role !== 'SUPERADMIN') {
    redirect('/dashboard')
  }

  // Fetch cost rules
  // const costRules = await prisma.planCostRule.findMany({
  //   orderBy: { actionCode: 'asc' }
  // })
  const costRules = []

  // Get usage statistics for last 30 days
  // const usageStats = await prisma.aiUsageLedger.groupBy({
  //   by: ['actionCode'],
  //   _count: { id: true },
  //   _sum: { credits: true },
  const usageStats = []
  //   where: {
  //     occurredAt: {
  //       gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  //     }
  //   }
  // })

  const getActionIcon = (actionCode: string) => {
    switch (actionCode) {
      case 'CHAT_STANDARD':
        return <MessageCircle className="h-5 w-5 text-blue-600" />
      case 'LETTER_LONG':
        return <FileText className="h-5 w-5 text-green-600" />
      case 'PDF_REPORT':
        return <FileText className="h-5 w-5 text-purple-600" />
      default:
        return <Zap className="h-5 w-5 text-gray-600" />
    }
  }

  const getActionDescription = (actionCode: string) => {
    switch (actionCode) {
      case 'CHAT_STANDARD':
        return 'Standard økonomi-spørsmål og rådgivning'
      case 'LETTER_LONG':
        return 'Lange svar, brev og klagegenerator'
      case 'PDF_REPORT':
        return 'Rapport og PDF-generering'
      default:
        return 'Ukjent handling'
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur shadow-lg border-r border-violet-100">
        <div className="px-4 py-4 flex items-center gap-2 border-b border-violet-100">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-900">Pengeplan</span>
            <div className="text-xs text-violet-500 font-medium">AI Admin</div>
          </div>
        </div>

        <nav className="px-2 py-4 space-y-2">
          <Link href="/admin/ai-raadgiver" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <ArrowLeft className="h-4 w-4" />
            <span>Tilbake til AI Admin</span>
          </Link>
          <Link href="/admin/ai-raadgiver/plans" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <Settings className="h-4 w-4" />
            <span>Planer</span>
          </Link>
          <Link href="/admin/ai-raadgiver/cost-matrix" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-violet-600/10 text-violet-800 ring-1 ring-violet-300 shadow-sm">
            <DollarSign className="h-4 w-4" />
            <span>Kost-matrise</span>
          </Link>
          <Link href="/admin/ai-raadgiver/credits" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <Zap className="h-4 w-4" />
            <span>Kreditt-styring</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kost-matrise</h1>
                <p className="text-gray-600">Administrer kredittkostnader for forskjellige AI-handlinger</p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                Ny kost-regel
              </Button>
            </div>
          </div>

          {/* Cost Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {costRules.map((rule: Record<string, unknown>) => {
              const usageStat = usageStats.find((stat: Record<string, unknown>) => stat.actionCode === rule.actionCode)
              return (
                <Card key={String(rule.id)} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getActionIcon(String(rule.actionCode))}
                        {String(rule.actionCode)}
                      </CardTitle>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Rule Details */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {getActionDescription(String(rule.actionCode))}
                        </p>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Kredittkostnad:</span>
                          <span className="text-lg font-bold text-violet-600">
                            {String(rule.credits)} kreditt{Number(rule.credits) !== 1 ? 'er' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Usage Statistics */}
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bruk (30d):</span>
                          <span className="text-sm font-medium">
                            {usageStat?._count.id || 0} kall
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Totalt forbrukt:</span>
                          <span className="text-sm font-medium">
                            {usageStat?._sum.credits || 0} kreditter
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Rediger
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Cost Matrix Table */}
          <Card>
            <CardHeader>
              <CardTitle>Kost-matrise oversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Handling</th>
                      <th className="text-left py-3 px-4">Beskrivelse</th>
                      <th className="text-left py-3 px-4">Kredittkostnad</th>
                      <th className="text-left py-3 px-4">Bruk (30d)</th>
                      <th className="text-left py-3 px-4">Totalt forbrukt</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costRules.map((rule: Record<string, unknown>) => {
                      const usageStat = usageStats.find((stat: Record<string, unknown>) => stat.actionCode === rule.actionCode)
                      return (
                        <tr key={String(rule.id)} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getActionIcon(String(rule.actionCode))}
                              <span className="font-medium">{String(rule.actionCode)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">
                              {getActionDescription(String(rule.actionCode))}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-lg">
                              {String(rule.credits)} kreditt{Number(rule.credits) !== 1 ? 'er' : ''}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{usageStat?._count.id || 0}</span>
                            <span className="text-sm text-gray-600 ml-1">kall</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{usageStat?._sum.credits || 0}</span>
                            <span className="text-sm text-gray-600 ml-1">kreditter</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                              {rule.isActive ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Impact Analysis */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Kostnadspåvirkning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {usageStats.reduce((sum: number, stat: Record<string, unknown>) => sum + Number((stat._count as Record<string, unknown>).id), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Totalt AI-kall (30d)</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {usageStats.reduce((sum: number, stat: Record<string, unknown>) => sum + ((stat._sum as Record<string, unknown>).credits as number || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Totalt kredittforbruk</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {costRules.length}
                  </div>
                  <div className="text-sm text-gray-600">Aktive kost-regler</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
