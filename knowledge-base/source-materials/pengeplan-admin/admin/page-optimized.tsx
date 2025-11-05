'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Heart, 
  Target, 
  DollarSign, 
  PiggyBank, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Shield,
  Zap,
  Star,
  Play,
  BookOpen,
  Bot,
  Calculator,
  Calendar,
  FileText,
  Settings,
  Trophy,
  Sparkles,
  Award,
  Clock,
  TrendingDown,
  CreditCard,
  Home,
  Car,
  ShoppingCart,
  Utensils,
  Coffee,
  Wifi,
  Phone,
  Gamepad2,
  BookOpen as BookIcon,
  Target as TargetIcon,
  Users as UsersIcon,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Gamepad2 as GamepadIcon,
  BookOpen as BookOpenIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Atom,
  PieChart,
  LineChart,
  BarChart,
  Activity,
  TrendingUp as TrendingUpIcon,
  Target as TargetIcon2,
  MessageCircle,
  Settings as SettingsIcon,
  BarChart3 as BarChart3Icon,
  Eye,
  Award as AwardIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
  Globe,
  Lock,
  ShieldCheck,
  UserCheck,
  FileText as FileTextIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Activity as ActivityIcon,
  TrendingDown as TrendingDownIcon,
  DollarSign as DollarSignIcon,
  CreditCard as CreditCardIcon,
  PiggyBank as PiggyBankIcon,
  Home as HomeIcon,
  Car as CarIcon,
  ShoppingCart as ShoppingCartIcon,
  Utensils as UtensilsIcon,
  Coffee as CoffeeIcon,
  Wifi as WifiIcon,
  Phone as PhoneIcon,
  AlertTriangle,
  UserPlus,
  UserCheck as UserCheckIcon,
  MessageSquare,
  Bell,
  BellRing,
  AlertCircle,
  Info,
  Lightbulb,
  Target as TargetIcon3,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  BarChart3 as BarChart3Icon2,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  Activity as ActivityIcon2,
  Zap as ZapIcon2,
  Shield as ShieldIcon2,
  Heart as HeartIcon2,
  Users as UsersIcon2,
  Brain as BrainIcon2,
  Target as TargetIcon4,
  DollarSign as DollarSignIcon2,
  PiggyBank as PiggyBankIcon2,
  CreditCard as CreditCardIcon2,
  Home as HomeIcon2,
  Car as CarIcon2,
  ShoppingCart as ShoppingCartIcon2,
  Utensils as UtensilsIcon2,
  Coffee as CoffeeIcon2,
  Wifi as WifiIcon2,
  Phone as PhoneIcon2,
  Gamepad2 as GamepadIcon2,
  BookOpen as BookOpenIcon2,
  Shield as ShieldIcon3,
  Zap as ZapIcon3,
  Atom as AtomIcon,
  Sparkles as CrystalBallIcon,
  Database,
  Server,
  Cpu,
  HardDrive,
  Network,
  Wifi as WifiIcon3,
  Globe as GlobeIcon,
  Lock as LockIcon,
  Shield as ShieldIcon4,
  UserCheck as UserCheckIcon2,
  FileText as FileTextIcon2,
  PieChart as PieChartIcon3,
  LineChart as LineChartIcon3,
  BarChart as BarChartIcon3,
  Activity as ActivityIcon3,
  TrendingDown as TrendingDownIcon3,
  DollarSign as DollarSignIcon3,
  CreditCard as CreditCardIcon3,
  PiggyBank as PiggyBankIcon3,
  Home as HomeIcon3,
  Car as CarIcon3,
  ShoppingCart as ShoppingCartIcon3,
  Utensils as UtensilsIcon3,
  Coffee as CoffeeIcon3,
  Wifi as WifiIcon4,
  Phone as PhoneIcon3,
  Gamepad2 as GamepadIcon3,
  BookOpen as BookOpenIcon3,
  Shield as ShieldIcon5,
  Zap as ZapIcon4,
  Atom as AtomIcon2,
  Sparkles as CrystalBallIcon2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FloatingAIAssistant } from '@/components/ai/FloatingAIAssistant'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function OptimizedAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [adminData, setAdminData] = useState({
    name: 'Cato',
    totalUsers: 2847,
    activeUsers: 2156,
    totalSavings: 4200000,
    monthlyIncome: 1800000,
    monthlyExpenses: 1200000,
    debtAmount: 600000,
    creditScore: 820,
    aiInsights: 12456,
    lessonsCompleted: 8923,
    streak: 12,
    level: 5,
    xp: 3200,
    nextLevelXp: 5000,
    alerts: 3,
    urgentActions: 2,
    familyHarmony: 85,
    clientProgress: 78,
    systemHealth: 98,
    aiModels: 12,
    activeAgents: 8,
    dataProcessed: 1250000,
    apiCalls: 45000,
    errorRate: 0.02,
    responseTime: 120,
    uptime: 99.9
  })

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Laster admin-dashboard...</h2>
          <p className="text-gray-600">AI analyserer systemstatus</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ⚙️ Hei, {adminData.name}!
              </h1>
              <p className="text-lg text-gray-600">
                Her er din admin-oversikt og systemstatus for Pengeplan 2.0
              </p>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Aktive brukere</p>
                      <p className="text-2xl font-bold">{adminData.activeUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Total sparing</p>
                      <p className="text-2xl font-bold">{adminData.totalSavings.toLocaleString()} NOK</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">System helse</p>
                      <p className="text-2xl font-bold">{adminData.systemHealth}%</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">AI-modeller</p>
                      <p className="text-2xl font-bold">{adminData.aiModels}</p>
                    </div>
                    <Brain className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Oversikt</TabsTrigger>
              <TabsTrigger value="ai-system">AI-system</TabsTrigger>
              <TabsTrigger value="analytics">Analytikk</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* AI Insights for Admin */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">AI-system status</CardTitle>
                        <CardDescription className="text-gray-600">
                          Oversikt over AI-modeller og ytelse
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">AI-modeller kjører optimalt</h4>
                            <p className="text-sm text-gray-600">
                              Alle 12 AI-modeller fungerer som forventet med 98% nøyaktighet.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">System ytelse</h4>
                            <p className="text-sm text-gray-600">
                              Gjennomsnittlig responstid: {adminData.responseTime}ms. Uptime: {adminData.uptime}%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress & Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        System fremgang
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Nivå {adminData.level}</span>
                          <span>{adminData.xp}/{adminData.nextLevelXp} XP</span>
                        </div>
                        <Progress value={(adminData.xp / adminData.nextLevelXp) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{adminData.streak}</div>
                          <div className="text-xs text-gray-500">Dager på rad</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{adminData.lessonsCompleted}</div>
                          <div className="text-xs text-gray-500">Leksjoner</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{adminData.aiInsights}</div>
                          <div className="text-xs text-gray-500">AI-råd</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-500" />
                        Nylige prestasjoner
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">System Master</p>
                            <p className="text-sm text-gray-500">12 dager på rad</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Learning Streak</p>
                            <p className="text-sm text-gray-500">15 leksjoner fullført</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">System Protector</p>
                            <p className="text-sm text-gray-500">Hjalp 6 systemer</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* AI System Tab */}
            <TabsContent value="ai-system" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      AI-system oversikt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">AI-modeller</h4>
                          <Badge className="bg-green-100 text-green-700">Aktiv</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Totalt: {adminData.aiModels} modeller</p>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Aktive agenter</h4>
                          <Badge className="bg-blue-100 text-blue-700">Kjører</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Totalt: {adminData.activeAgents} agenter</p>
                        <div className="flex items-center gap-2">
                          <Progress value={70} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">70%</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                        <Settings className="h-4 w-4 mr-2" />
                        Konfigurer AI-system
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      System analytikk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Data prosessert</h4>
                        <p className="text-sm text-gray-600 mb-2">{adminData.dataProcessed.toLocaleString()} datapunkter</p>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">75%</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">API-kall</h4>
                        <p className="text-sm text-gray-600 mb-2">{adminData.apiCalls.toLocaleString()} kall i dag</p>
                        <div className="flex items-center gap-2">
                          <Progress value={90} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">90%</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Se detaljert analytikk
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-500" />
                      System status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">System helse: {adminData.systemHealth}%</h4>
                        <p className="text-sm text-gray-600 mb-2">Uptime: {adminData.uptime}%</p>
                        <div className="flex items-center gap-2">
                          <Progress value={adminData.systemHealth} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">{adminData.systemHealth}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Feilrate: {adminData.errorRate}%</h4>
                        <p className="text-sm text-gray-600 mb-2">Gjennomsnittlig responstid: {adminData.responseTime}ms</p>
                        <div className="flex items-center gap-2">
                          <Progress value={adminData.errorRate * 100} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">{adminData.errorRate}%</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                        <Settings className="h-4 w-4 mr-2" />
                        System innstillinger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  )
}



