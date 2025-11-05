'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  HardDrive,
  Server,
  Shield,
  Archive,
  Trash2,
  Settings,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Calendar,
  Activity
} from 'lucide-react'

interface BackupInfo {
  id: string
  name: string
  size: string
  createdAt: string
  status: 'completed' | 'failed' | 'in-progress' | 'scheduled'
  type: 'full' | 'incremental' | 'manual'
  location: string
  checksum: string
  duration: string
  tables: number
  records: number
}

interface BackupStats {
  totalBackups: number
  totalSize: string
  lastBackup: string
  nextScheduled: string
  successRate: number
  averageDuration: string
  storageUsed: string
  storageAvailable: string
}

export default function BackupOverviewPage() {
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [stats, setStats] = useState<BackupStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchBackupData()
  }, [])

  const fetchBackupData = async () => {
    try {
      setIsLoading(true)
      // Mock data for development
      setBackups([
        {
          id: 'backup-001',
          name: 'Full Backup 2024-01-15',
          size: '2.4 GB',
          createdAt: '2024-01-15 02:00:00',
          status: 'completed',
          type: 'full',
          location: '/backups/full-2024-01-15.tar.gz',
          checksum: 'a1b2c3d4e5f6...',
          duration: '15 min',
          tables: 25,
          records: 125000
        },
        {
          id: 'backup-002',
          name: 'Incremental Backup 2024-01-14',
          size: '450 MB',
          createdAt: '2024-01-14 02:00:00',
          status: 'completed',
          type: 'incremental',
          location: '/backups/inc-2024-01-14.tar.gz',
          checksum: 'b2c3d4e5f6a1...',
          duration: '8 min',
          tables: 25,
          records: 15000
        },
        {
          id: 'backup-003',
          name: 'Manual Backup 2024-01-13',
          size: '1.8 GB',
          createdAt: '2024-01-13 14:30:00',
          status: 'completed',
          type: 'manual',
          location: '/backups/manual-2024-01-13.tar.gz',
          checksum: 'c3d4e5f6a1b2...',
          duration: '12 min',
          tables: 25,
          records: 95000
        }
      ])

      setStats({
        totalBackups: 3,
        totalSize: '4.65 GB',
        lastBackup: '2024-01-15 02:00:00',
        nextScheduled: '2024-01-16 02:00:00',
        successRate: 100,
        averageDuration: '12 min',
        storageUsed: '4.65 GB',
        storageAvailable: '15.35 GB'
      })
    } catch (error) {
      console.error('Error fetching backup data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createBackup = async () => {
    try {
      setIsCreating(true)
      const response = await fetch('/api/admin/backup/create', {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`✅ Backup opprettet: ${result.backupName}`)
        fetchBackupData()
      } else {
        alert('❌ Feil under backup-opprettelse')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('❌ Feil under backup-opprettelse')
    } finally {
      setIsCreating(false)
    }
  }

  const restoreBackup = async (backupId: string) => {
    if (!confirm('Er du sikker på at du vil gjenopprette denne backup? Dette vil overskrive gjeldende system.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ backupId })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`✅ Backup gjenopprettet: ${result.message}`)
      } else {
        alert('❌ Feil under gjenoppretting')
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      alert('❌ Feil under gjenoppretting')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'scheduled': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      case 'in-progress': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'text-purple-600 bg-purple-100'
      case 'incremental': return 'text-blue-600 bg-blue-100'
      case 'manual': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Laster backup-data...</p>
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
                Backup Oversikt
              </h1>
              <p className="text-xl text-gray-600">
                Administrer systembackups og gjenoppretting
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchBackupData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Oppdater
              </Button>
              <Button onClick={createBackup} disabled={isCreating} className="bg-purple-600 hover:bg-purple-700">
                {isCreating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                {isCreating ? 'Oppretter...' : 'Opprett Backup'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale Backups</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBackups}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalSize} total størrelse
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Siste Backup</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(stats.lastBackup).toLocaleDateString('no-NO')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(stats.lastBackup).toLocaleTimeString('no-NO')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suksessrate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Gjennomsnitt: {stats.averageDuration}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lagring</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.storageAvailable} tilgjengelig
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Backup List */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-600" />
              <span>Backup Historikk</span>
            </CardTitle>
            <CardDescription>
              Oversikt over alle systembackups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg">
                      {getStatusIcon(backup.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{backup.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(backup.createdAt).toLocaleString('no-NO')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(backup.status)}>
                          {backup.status.toUpperCase()}
                        </Badge>
                        <Badge className={getTypeColor(backup.type)}>
                          {backup.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {backup.size}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      {backup.tables} tabeller, {backup.records.toLocaleString()} records
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Varighet: {backup.duration}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restoreBackup(backup.id)}
                        disabled={backup.status !== 'completed'}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Gjenopprett
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Last ned
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Scheduled Backup */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Planlagte Backups</span>
            </CardTitle>
            <CardDescription>
              Automatiske backup-oppgaver
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Daglig Full Backup</p>
                    <p className="text-sm text-gray-600">
                      Neste kjøring: {stats?.nextScheduled}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">AKTIV</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Konfigurer
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Inkrementell Backup</p>
                    <p className="text-sm text-gray-600">
                      Hver 6. time
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">AKTIV</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Konfigurer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


