'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  HardDrive, 
  Users, 
  FileText, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Database,
  Server,
  Archive,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Zap
} from 'lucide-react'

interface StorageMetrics {
  totalSpace: string
  usedSpace: string
  freeSpace: string
  usagePercentage: number
  byUser: {
    userId: string
    name: string
    email: string
    role: string
    spaceUsed: string
    files: number
    lastActivity: string
    category: 'user' | 'verge' | 'admin'
  }[]
  byCategory: {
    category: string
    spaceUsed: string
    files: number
    percentage: number
  }[]
  cleanup: {
    oldFiles: number
    duplicateFiles: number
    tempFiles: number
    reclaimableSpace: string
    lastCleanup: string
  }
  alerts: {
    type: 'warning' | 'critical' | 'info'
    message: string
    timestamp: string
  }[]
}

export default function StorageMonitoringPage() {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCleaning, setIsCleaning] = useState(false)

  useEffect(() => {
    fetchStorageMetrics()
  }, [])

  const fetchStorageMetrics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/storage-metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      } else {
        // Fallback data for development
        setMetrics({
          totalSpace: '2.4 TB',
          usedSpace: '1.8 TB',
          freeSpace: '0.6 TB',
          usagePercentage: 75,
          byUser: [
            {
              userId: 'user-1',
              name: 'Cato Hansen',
              email: 'cato@catohansen.no',
              role: 'SUPERADMIN',
              spaceUsed: '450 MB',
              files: 23,
              lastActivity: '2 timer siden',
              category: 'admin'
            },
            {
              userId: 'user-2',
              name: 'Test Bruker',
              email: 'test@example.com',
              role: 'USER',
              spaceUsed: '120 MB',
              files: 8,
              lastActivity: '1 dag siden',
              category: 'user'
            },
            {
              userId: 'verge-1',
              name: 'Verge System',
              email: 'verge@pengeplan.no',
              role: 'VERGE',
              spaceUsed: '890 MB',
              files: 45,
              lastActivity: '30 min siden',
              category: 'verge'
            }
          ],
          byCategory: [
            { category: 'Brukerdata', spaceUsed: '1.2 TB', files: 1234, percentage: 67 },
            { category: 'Innhold', spaceUsed: '0.4 TB', files: 567, percentage: 22 },
            { category: 'Backups', spaceUsed: '0.2 TB', files: 89, percentage: 11 }
          ],
          cleanup: {
            oldFiles: 156,
            duplicateFiles: 23,
            tempFiles: 89,
            reclaimableSpace: '340 MB',
            lastCleanup: '2024-01-15 14:30'
          },
          alerts: [
            {
              type: 'warning',
              message: 'Lagringsforbruk nærmer seg 80% - anbefaler opprydding',
              timestamp: '2024-01-15 10:30'
            },
            {
              type: 'info',
              message: 'Automatisk cleanup fullført - frigjort 120 MB',
              timestamp: '2024-01-15 02:00'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching storage metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runCleanup = async () => {
    try {
      setIsCleaning(true)
      const response = await fetch('/api/admin/storage-cleanup', {
        method: 'POST'
      })
      if (response.ok) {
        const result = await response.json()
        alert(`✅ Opprydding fullført! Frigjort: ${result.reclaimedSpace}`)
        fetchStorageMetrics()
      }
    } catch (error) {
      console.error('Error running cleanup:', error)
      alert('❌ Feil under opprydding')
    } finally {
      setIsCleaning(false)
    }
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getUsageBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Laster lagringsdata...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Lagringsmonitoring
              </h1>
              <p className="text-xl text-gray-600">
                Overvåk og administrer systemlagring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchStorageMetrics} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Oppdater
              </Button>
              <Button onClick={runCleanup} disabled={isCleaning} className="bg-purple-600 hover:bg-purple-700">
                {isCleaning ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {isCleaning ? 'Rydder...' : 'Rydd opp'}
              </Button>
            </div>
          </div>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total plass</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalSpace}</div>
              <p className="text-xs text-muted-foreground">Systemkapasitet</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brukt plass</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.usedSpace}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.usagePercentage}% av total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ledig plass</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.freeSpace}</div>
              <p className="text-xs text-muted-foreground">Tilgjengelig</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Lagringsforbruk</span>
            </CardTitle>
            <CardDescription>Total systembruk og kategorifordeling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total bruk</span>
                  <span className={getUsageColor(metrics?.usagePercentage || 0)}>
                    {metrics?.usagePercentage}%
                  </span>
                </div>
                <Progress 
                  value={metrics?.usagePercentage || 0} 
                  className="h-3"
                />
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                {metrics?.byCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.category}</span>
                      <span>{category.spaceUsed} ({category.files} filer)</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Storage Breakdown */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Bruker-lagring</span>
            </CardTitle>
            <CardDescription>Lagringsforbruk per bruker og rolle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.byUser.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            user.category === 'admin' ? 'bg-red-50 text-red-700' :
                            user.category === 'verge' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}
                        >
                          {user.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.spaceUsed}</p>
                    <p className="text-sm text-gray-500">{user.files} filer</p>
                    <p className="text-xs text-gray-400">{user.lastActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cleanup Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-orange-600" />
                <span>Opprydding</span>
              </CardTitle>
              <CardDescription>Automatisk og manuell opprydding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {metrics?.cleanup.oldFiles}
                    </div>
                    <p className="text-sm text-gray-600">Gamle filer</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {metrics?.cleanup.duplicateFiles}
                    </div>
                    <p className="text-sm text-gray-600">Duplikater</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Midlertidige filer</p>
                      <p className="text-sm text-gray-500">Filer eldre enn 30 dager</p>
                    </div>
                    <Badge variant="outline">{metrics?.cleanup.tempFiles} filer</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Frigjørbar plass</p>
                      <p className="text-sm text-gray-500">Potensielt frigjort</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {metrics?.cleanup.reclaimableSpace}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">
                    Siste opprydding: {metrics?.cleanup.lastCleanup}
                  </p>
                  <Button onClick={runCleanup} disabled={isCleaning} className="w-full">
                    {isCleaning ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {isCleaning ? 'Rydder...' : 'Start opprydding'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Varsler</span>
              </CardTitle>
              <CardDescription>Systemvarsler og anbefalinger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


