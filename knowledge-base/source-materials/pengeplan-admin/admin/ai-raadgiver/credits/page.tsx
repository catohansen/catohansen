import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  CreditCard, 
  Plus, 
  Search,
  ArrowLeft,
  Settings,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function CreditsAdminPage() {
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

  // Fetch credit data
  // const [creditPurchases, creditWallets, creditStats] = await Promise.all([
  //   prisma.aiCreditPurchase.findMany({
  //     include: { user: true },
  //     orderBy: { createdAt: 'desc' },
  //     take: 50
  //   }),
  //   prisma.aiCreditWallet.findMany({
  //     include: { user: true },
  //     orderBy: { balance: 'desc' },
  //     take: 20
  //   }),
  //   prisma.aiCreditPurchase.aggregate({
  const [creditPurchases, creditWallets, creditStats] = [[], [], { _count: { id: 0 }, _sum: { amount: 0 } }]
  //   prisma.aiCreditPurchase.aggregate({
  //     _sum: { credits: true, amountNok: true },
  //     _count: { id: true },
  //     where: { status: 'PAID' }
  //   })
  // ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="default" className="bg-green-100 text-green-800">Betalt</Badge>
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Venter</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Feilet</Badge>
      default:
        return <Badge variant="secondary">Ukjent</Badge>
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
          <Link href="/admin/ai-raadgiver/cost-matrix" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 transition-all duration-200">
            <DollarSign className="h-4 w-4" />
            <span>Kost-matrise</span>
          </Link>
          <Link href="/admin/ai-raadgiver/credits" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium bg-violet-600/10 text-violet-800 ring-1 ring-violet-300 shadow-sm">
            <CreditCard className="h-4 w-4" />
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kreditt-styring</h1>
                <p className="text-gray-600">Administrer kredittkjøp og saldoer</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Søk bruker
                </Button>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til kreditter
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totalt solgt</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {creditStats._sum.amount?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500">kreditter</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Totalt omsetning</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {((creditStats._sum.amount || 0) / 100).toLocaleString()} NOK
                    </p>
                    <p className="text-xs text-gray-500">fra kredittkjøp</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Antall kjøp</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {creditStats._count.id || 0}
                    </p>
                    <p className="text-xs text-gray-500">betalt</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aktive lommebøker</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {creditWallets.length}
                    </p>
                    <p className="text-xs text-gray-500">med saldo</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Credit Wallets */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Topp kredittsaldoer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {creditWallets.slice(0, 10).map((wallet: Record<string, unknown>) => (
                  <div key={String(wallet.id)} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {String((wallet.user as Record<string, unknown>).name).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{String((wallet.user as Record<string, unknown>).name)}</p>
                        <p className="text-sm text-gray-600">{String((wallet.user as Record<string, unknown>).email)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-violet-600">
                        {Number(wallet.balance).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">kreditter</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Credit Purchases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Siste kredittkjøp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Bruker</th>
                      <th className="text-left py-3 px-4">Pakke</th>
                      <th className="text-left py-3 px-4">Kreditter</th>
                      <th className="text-left py-3 px-4">Beløp</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Dato</th>
                      <th className="text-left py-3 px-4">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditPurchases.map((purchase: Record<string, unknown>) => (
                      <tr key={String(purchase.id)} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {String((purchase.user as Record<string, unknown>).name).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{String((purchase.user as Record<string, unknown>).name)}</p>
                              <p className="text-xs text-gray-600">{String((purchase.user as Record<string, unknown>).email)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{String(purchase.packCode)}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{String(purchase.credits)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{(Number(purchase.amountNok) / 100).toLocaleString()} NOK</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(String(purchase.status))}
                            {getStatusBadge(String(purchase.status))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(String(purchase.createdAt)).toLocaleDateString('nb-NO')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {purchase.status === 'PENDING' && (
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Godkjenn
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              Detaljer
                            </Button>
                          </div>
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
