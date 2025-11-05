'use client'

import React, { useState, useEffect } from 'react'
import { 
  Database, 
  Server, 
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  RotateCcw,
  Settings,
  Key,
  Globe,
  Shield,
  Activity,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface DatabaseStatus {
  current: {
    type: string,

    path: string,

    status: string;
  }
  target: {
    type: string,

    status: string,

    url: string;
  }
  migration: {
    status: string,

    lastAttempt: string | null,

    nextScheduled: string | null;
  }
}

export default function SupabaseMigrationPage() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  useEffect(() => {
    fetchDatabaseStatus();
  }, [])

  const fetchDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/admin/supabase/migrate');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      console.error('Failed to fetch database status:', error);
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/admin/supabase/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-connection' })
      })
      
      const result = await response.json();
      if (result.success) {
        alert('✅ Supabase connection test successful!');
        fetchDatabaseStatus();
      } else {
        alert('❌ Connection test failed');
      }
    } catch (error) {
      alert('❌ Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  }

  const startMigration = async () => {
    if (!confirm('Are you sure you want to migrate to Supabase? This will copy all data from SQLite to PostgreSQL.')) {
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    const steps = [
      'Creating Supabase project',
      'Setting up database schema', 
      'Migrating user data',
      'Migrating application data',
      'Testing connection',
      'Updating environment variables'
    ]

    try {
      const response = await fetch('/api/admin/supabase/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate' })
      })
      
      const result = await response.json();
      if (result.success) {
        // Simulate migration progress
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i] || '');
          setMigrationProgress((i + 1) * (100 / steps.length))
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        alert('✅ Migration completed successfully!');
        fetchDatabaseStatus();
      } else {
        alert('❌ Migration failed');
      }
    } catch (error) {
      alert('❌ Migration failed');
    } finally {
      setIsMigrating(false);
      setMigrationProgress(0);
      setCurrentStep('');
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'migrating':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:

        return <Database className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'migrating':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:

        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Supabase Migration;
          </h1>
          <p className="text-gray-600 mt-1">
            Migrate from SQLite to Supabase PostgreSQL;
          </p>
        </div>
        <Button

          onClick={fetchDatabaseStatus}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status;
        </Button>
      </div>

      {/* Database Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-600" />
              Current Database;
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <Badge variant="outline">{dbStatus.current.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Path</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {dbStatus.current.path}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(dbStatus.current.status)}
                    <Badge className={getStatusColor(dbStatus.current.status)}>
                      {dbStatus.current.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                Loading...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Target Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Target Database;
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <Badge variant="outline">{dbStatus.target.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">URL</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-32 truncate">
                    {dbStatus.target.url}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(dbStatus.target.status)}
                    <Badge className={getStatusColor(dbStatus.target.status)}>
                      {dbStatus.target.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                Loading...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Migration Progress */}
      {isMigrating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              Migration in Progress;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={migrationProgress} className="w-full" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {currentStep || 'Preparing migration...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(migrationProgress)}% complete;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md: grid-cols-3 gap-4">
            <Button

              onClick={testConnection}
              disabled={isTestingConnection}
              className="flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button

              onClick={startMigration}
              disabled={isMigrating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="w-4 h-4" />
              {isMigrating ? 'Migrating...' : 'Start Migration'}
            </Button>
            
            <Button

              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Rollback;
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Environment Variables;
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Required Variables</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-blue-100 px-2 py-1 rounded">DATABASE_URL</code>
                  <span className="text-blue-700">PostgreSQL connection string</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                  <span className="text-blue-700">Supabase project URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  <span className="text-blue-700">Supabase anonymous key</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Important</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Make sure to update your environment variables in Vercel dashboard,

                    after migration. The system will automatically use the new database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

;