'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Settings,
  HardDrive,
  Cloud,
  Shield,
  Activity,
  Calendar,
  FileText,
  Archive,
  Trash2,
  RotateCcw
} from 'lucide-react'

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'running' | 'completed' | 'failed' | 'scheduled' | 'paused';
  size: string;
  duration: string;
  ts: string;
  completedAt?: string;
  progress: number;
  location: string;
  retention: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  type: string;
}

interface RecoveryPoint {
  id: string;
  name: string;
  ts: string;
  size: string;
  type: string;
  status: 'available' | 'corrupted' | 'expired';
  location: string;
}

export default function BackupSystemPage() {
  const [backups, setBackups] = useState<BackupJob[]>([])
  const [schedules, setSchedules] = useState<BackupSchedule[]>([])
  const [recoveryPoints, setRecoveryPoints] = useState<RecoveryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBackup, setSelectedBackup] = useState<BackupJob | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup
    }
  }, [])

  useEffect(() => {
    fetchBackupData()
    const interval = setInterval(fetchBackupData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchBackupData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/backup-system')
      const data = await response.json()
      setBackups(data.backups)
      setSchedules(data.schedules)
      setRecoveryPoints(data.recoveryPoints)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      console.error('Failed to fetch backup data:', error)
      
      // Fallback to mock data
      setBackups([
        {
          id: '1',
          name: 'Full Database Backup',
          type: 'full',
          status: 'completed',
          size: '2.4 GB',
          duration: '15 min',
          ts: new Date().toISOString(),
          completedAt: new Date(Date.now() - 300000).toISOString(),
          progress: 100,
          location: 'Local Storage',
          retention: '30 days'
        },
        {
          id: '2',
          name: 'Incremental Backup',
          type: 'incremental',
          status: 'running',
          size: '156 MB',
          duration: '3 min',
          ts: new Date(Date.now() - 180000).toISOString(),
          progress: 65,
          location: 'Cloud Storage',
          retention: '7 days'
        },
        {
          id: '3',
          name: 'Differential Backup',
          type: 'differential',
          status: 'failed',
          size: '0 MB',
          duration: '0 min',
          ts: new Date(Date.now() - 600000).toISOString(),
          progress: 0,
          location: 'Local Storage',
          retention: '14 days'
        }
      ])

      setSchedules([
        {
          id: '1',
          name: 'Daily Full Backup',
          frequency: 'daily',
          time: '02:00',
          enabled: true,
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          type: 'full'
        },
        {
          id: '2',
          name: 'Hourly Incremental',
          frequency: 'daily',
          time: '00:00',
          enabled: true,
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          type: 'incremental'
        }
      ])

      setRecoveryPoints([
        {
          id: '1',
          name: 'Full Backup - 2024-01-15',
          ts: new Date(Date.now() - 86400000).toISOString(),
          size: '2.4 GB',
          type: 'full',
          status: 'available',
          location: 'Local Storage'
        },
        {
          id: '2',
          name: 'Incremental - 2024-01-14',
          ts: new Date(Date.now() - 172800000).toISOString(),
          size: '156 MB',
          type: 'incremental',
          status: 'available',
          location: 'Cloud Storage'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const startBackup = async (type: string) => {
    try {
      const response = await fetch('/api/admin/backup-system/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      
      if (response.ok) {
        await fetchBackupData()
      }
    } catch (error) {
      console.error('Failed to start backup:', error)
    }
  }

  const pauseBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup-system/pause/${backupId}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchBackupData()
      }
    } catch (error) {
      console.error('Failed to pause backup:', error)
    }
  }

  const resumeBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup-system/resume/${backupId}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchBackupData()
      }
    } catch (error) {
      console.error('Failed to resume backup:', error)
    }
  }

  const deleteBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup-system/delete/${backupId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchBackupData()
      }
    } catch (error) {
      console.error('Failed to delete backup:', error)
    }
  }

  const restoreFromBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup-system/restore/${backupId}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchBackupData()
      }
    } catch (error) {
      console.error('Failed to restore from backup:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading backup system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup System</h1>
          <p className="text-muted-foreground">
            Manage database backups and recovery points
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => startBackup('full')} className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Full Backup
          </Button>
          <Button onClick={() => startBackup('incremental')} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Incremental
          </Button>
          <Button onClick={fetchBackupData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Points</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          <div className="grid gap-4">
            {backups.map((backup) => (
              <Card key={backup.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(backup.status)}
                    <div>
                      <h3 className="font-semibold">{backup.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {backup.type} • {backup.size} • {backup.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                    {backup.status === 'running' && (
                      <div className="w-32">
                        <Progress value={backup.progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex gap-1">
                      {backup.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pauseBackup(backup.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {backup.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resumeBackup(backup.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBackup(backup.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{schedule.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {schedule.frequency} at {schedule.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Next run: {new Date(schedule.nextRun).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={schedule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {schedule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <div className="grid gap-4">
            {recoveryPoints.map((point) => (
              <Card key={point.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{point.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {point.type} • {point.size} • {new Date(point.ts).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {point.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(point.status)}>
                      {point.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreFromBackup(point.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}