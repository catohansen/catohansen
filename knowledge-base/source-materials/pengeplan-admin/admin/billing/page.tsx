'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Users,
  Download,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

import { CreatePlanModal } from './parts/CreatePlanModal'

interface BillingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  isActive: boolean
  userCount: number
  revenue: number
}

interface Subscription {
  id: string
  userId: string
  userEmail: string
  userName: string
  planId: string
  planName: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  currency: string
  nextBillingDate: string
  createdAt: string
}

interface Payment {
  id: string
  subscriptionId: string
  userId: string
  userEmail: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending'
  paymentMethod: string
  createdAt: string
  description: string
}

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  activeSubscriptions: number
  churnRate: number
  averageRevenuePerUser: number
  growthRate: number
}

export default function BillingAdminPage() {
  const [mounted, setMounted] = useState(false)
  const [plans, setPlans] = useState<BillingPlan[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    growthRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter] = useState('all')
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)

  const loadPlans = async () => {
    // Mock data - replace with actual API call
    const mockPlans: BillingPlan[] = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'NOK',
        interval: 'monthly',
        features: ['Basic budgeting', '3 AI questions/month', 'Email support'],
        isActive: true,
        userCount: 1250,
        revenue: 0
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 99,
        currency: 'NOK',
        interval: 'monthly',
        features: ['Advanced budgeting', 'Unlimited AI questions', 'Priority support', 'Export features'],
        isActive: true,
        userCount: 450,
        revenue: 44550
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 199,
        currency: 'NOK',
        interval: 'monthly',
        features: ['All Basic features', 'Verge management', 'Advanced analytics', 'API access'],
        isActive: true,
        userCount: 120,
        revenue: 23880
      }
    ]
    setPlans(mockPlans)
  }

  const loadSubscriptions = async () => {
    // Mock data - replace with actual API call
    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub_1',
        userId: 'user_1',
        userEmail: 'john@example.com',
        userName: 'John Doe',
        planId: 'basic',
        planName: 'Basic',
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
        amount: 99,
        currency: 'NOK',
        nextBillingDate: '2024-02-01',
        createdAt: '2024-01-01'
      },
      {
        id: 'sub_2',
        userId: 'user_2',
        userEmail: 'jane@example.com',
        userName: 'Jane Smith',
        planId: 'premium',
        planName: 'Premium',
        status: 'active',
        currentPeriodStart: '2024-01-15',
        currentPeriodEnd: '2024-02-15',
        amount: 199,
        currency: 'NOK',
        nextBillingDate: '2024-02-15',
        createdAt: '2024-01-15'
      }
    ]
    setSubscriptions(mockSubscriptions)
  }

  const loadPayments = async () => {
    // Mock data - replace with actual API call
    const mockPayments: Payment[] = [
      {
        id: 'pay_1',
        subscriptionId: 'sub_1',
        userId: 'user_1',
        userEmail: 'john@example.com',
        amount: 99,
        currency: 'NOK',
        status: 'succeeded',
        paymentMethod: 'card_****1234',
        createdAt: '2024-01-01',
        description: 'Basic plan subscription'
      },
      {
        id: 'pay_2',
        subscriptionId: 'sub_2',
        userId: 'user_2',
        userEmail: 'jane@example.com',
        amount: 199,
        currency: 'NOK',
        status: 'succeeded',
        paymentMethod: 'card_****5678',
        createdAt: '2024-01-15',
        description: 'Premium plan subscription'
      }
    ]
    setPayments(mockPayments)
  }

  const loadRevenueStats = async () => {
    // Mock data - replace with actual API call
    const mockStats: RevenueStats = {
      totalRevenue: 68430,
      monthlyRevenue: 68430,
      yearlyRevenue: 821160,
      activeSubscriptions: 570,
      churnRate: 2.5,
      averageRevenuePerUser: 120.05,
      growthRate: 15.2
    }
    setRevenueStats(mockStats)
  }

  const loadBillingData = useCallback(async () => {
    setLoading(true)
    try {
      // Simulate API calls - in real implementation, these would be actual API endpoints
      await Promise.all([
        loadPlans(),
        loadSubscriptions(),
        loadPayments(),
        loadRevenueStats()
      ])
    } catch (error) {
      console.error('Error loading billing data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    loadBillingData()
  }, [loadBillingData])

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'past_due': return 'bg-yellow-100 text-yellow-800'
      case 'trialing': return 'bg-blue-100 text-blue-800'
      case 'succeeded': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'past_due':
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'trialing':
        return <Activity className="w-4 h-4 text-blue-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    const matchesPlan = planFilter === 'all' || sub.planId === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Laster billing-data...</span>
        </div>
      </div>
    )
  }

  return (
    <AdminPageLayout 
      title="💳 Billing-administrasjon" 
      description="Administrer abonnementsplaner, betalinger og inntekter"
      headerColor="orange"
    >

      {/* Revenue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total inntekt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.totalRevenue.toLocaleString()} NOK</div>
            <p className="text-xs text-muted-foreground">
              +{revenueStats.growthRate}% fra forrige måned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Månedlig inntekt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.monthlyRevenue.toLocaleString()} NOK</div>
            <p className="text-xs text-muted-foreground">
              Denne måneden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive abonnementer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {revenueStats.churnRate}% churn rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gjennomsnitt per bruker</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.averageRevenuePerUser.toFixed(2)} NOK</div>
            <p className="text-xs text-muted-foreground">
              ARPU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Management Tabs */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Planer</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnementer</TabsTrigger>
          <TabsTrigger value="payments">Betalinger</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Abonnementsplaner</h2>
            <Button onClick={() => setShowCreatePlanModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Opprett plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.isActive ? 'ring-2 ring-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <Badge className={plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {plan.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? 'Gratis' : `${plan.price} NOK`}
                    <span className="text-sm font-normal text-gray-600">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Funksjoner:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Brukere:</span>
                        <span className="font-medium">{plan.userCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Inntekt:</span>
                        <span className="font-medium">{plan.revenue.toLocaleString()} NOK</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                      Rediger
                    </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Se detaljer
                    </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Abonnementer</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk etter bruker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="cancelled">Kansellert</SelectItem>
                  <SelectItem value="past_due">Forfalt</SelectItem>
                  <SelectItem value="trialing">Prøveperiode</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadBillingData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Oppdater
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bruker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beløp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Neste fakturering
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handlinger
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{subscription.userName}</div>
                            <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{subscription.planName}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(subscription.status)}
                            <Badge className={`ml-2 ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscription.amount} {subscription.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(subscription.nextBillingDate).toLocaleDateString('no-NO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Betalinger</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Søk etter betaling..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
              />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="succeeded">Vellykket</SelectItem>
                  <SelectItem value="failed">Feilet</SelectItem>
                  <SelectItem value="pending">Venter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Eksporter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bruker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beløp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betalingsmetode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handlinger
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.userEmail}</div>
                            <div className="text-sm text-gray-500">{payment.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.amount} {payment.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <Badge className={`ml-2 ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('no-NO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Siste 7 dager</SelectItem>
                  <SelectItem value="30d">Siste 30 dager</SelectItem>
                  <SelectItem value="90d">Siste 90 dager</SelectItem>
                  <SelectItem value="1y">Siste år</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Eksporter rapport
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inntektsutvikling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Inntektsgraf kommer snart</p>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planfordeling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Planfordelingsgraf kommer snart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
      <CreatePlanModal
        isOpen={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        onPlanCreated={loadBillingData}
      />
      )}
    </AdminPageLayout>
  )
}



