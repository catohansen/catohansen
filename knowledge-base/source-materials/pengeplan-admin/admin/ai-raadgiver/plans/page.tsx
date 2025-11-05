import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Crown, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  Settings,
  Users,
  TrendingUp
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


export default async function PlansAdminPage() {
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

  // Fetch plans with subscription counts
  // const plans = await prisma.plan.findMany({
  //   include: {
  //     _count: {
  //       select: { subscriptions: true }
  //     }
  //   },
  //   orderBy: { createdAt: 'asc' }
  // })
  const plans = []

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
          <Link href="/admin/ai-raadgiver/plans" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-violet-600/10 text-violet-800 ring-1 ring-violet-300 shadow-sm">
            <Crown className="h-4 w-4" />
            <span>Planer</span>
          </Link>
          <Link href="/admin/ai-raadgiver/cost-matrix" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <Settings className="h-4 w-4" />
            <span>Kost-matrise</span>
          </Link>
          <Link href="/admin/ai-raadgiver/credits" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <TrendingUp className="h-4 w-4" />
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Planer</h1>
                <p className="text-gray-600">Administrer abonnementsplaner og kvoter</p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                Ny plan
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: Record<string, unknown>) => (
              <Card key={String(plan.id)} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-violet-600" />
                      {String(plan.name)}
                    </CardTitle>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Plan Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kode:</span>
                        <span className="text-sm font-medium">{String(plan.code)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Faktureringssyklus:</span>
                        <span className="text-sm font-medium">
                          {plan.billingCycle === 'DAILY' ? 'Daglig' : 'Månedlig'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Inkludert kvote:</span>
                        <span className="text-sm font-medium">
                          {String(plan.includedQuota)} spørsmål
                        </span>
                      </div>
                      {plan.resetDay ? (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Reset dag:</span>
                          <span className="text-sm font-medium">{String(plan.resetDay)}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Subscription Count */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {Number((plan._count as Record<string, unknown>).subscriptions)} abonnement{Number((plan._count as Record<string, unknown>).subscriptions) !== 1 ? 'er' : ''}
                      </span>
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
            ))}
          </div>

          {/* Plan Comparison */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sammenligning av planer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Plan</th>
                      <th className="text-left py-3 px-4">Kvoter</th>
                      <th className="text-left py-3 px-4">Fakturering</th>
                      <th className="text-left py-3 px-4">Reset</th>
                      <th className="text-left py-3 px-4">Abonnenter</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan: Record<string, unknown>) => (
                      <tr key={String(plan.id)} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-violet-600" />
                            <span className="font-medium">{String(plan.name)}</span>
                            <Badge variant="outline" className="text-xs">{String(plan.code)}</Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{String(plan.includedQuota)}</span>
                          <span className="text-sm text-gray-600 ml-1">spørsmål</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {plan.billingCycle === 'DAILY' ? 'Daglig' : 'Månedlig'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {plan.resetDay ? `Dag ${plan.resetDay}` : 'Daglig'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{Number((plan._count as Record<string, unknown>).subscriptions)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                            {plan.isActive ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
