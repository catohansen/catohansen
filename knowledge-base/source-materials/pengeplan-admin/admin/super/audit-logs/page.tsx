'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Download,
  Filter,
  Calendar,
  User,
  Activity
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import AppShell from '@/components/layout/AppShell'

interface AuditLog {
  id: string
  actorEmail: string
  action: string
  resource: string
  resourceId?: string
  createdAt: string
  ipHash?: string
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    loadAuditLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/superadmin/audit-logs')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error loading audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    const filtered = logs.filter(log =>
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLogs(filtered)
  }

  const exportLogs = async () => {
    try {
      const response = await fetch('/api/superadmin/audit-logs/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error)
      alert('Error exporting audit logs')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE')) return 'default'
    if (action.includes('UPDATE')) return 'secondary'
    if (action.includes('DELETE')) return 'destructive'
    if (action.includes('LOGIN')) return 'outline'
    return 'secondary'
  }

  if (loading) {
    return (
      <AppShell role="superadmin">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading audit logs...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="superadmin">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
            <p className="text-gray-600">System activity and security audit trail</p>
          </div>
          <Button onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user, action, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline">
                {filteredLogs.length} of {logs.length} logs
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Audit Logs ({filteredLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No audit logs found matching your search criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.slice(0, 100).map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant={getActionBadgeVariant(log.action)}>
                              {log.action}
                            </Badge>
                            <span className="text-sm text-gray-600">on</span>
                            <Badge variant="outline">{log.resource}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {log.actorEmail}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(log.createdAt)}
                            </span>
                            {log.ipHash && (
                              <span className="flex items-center">
                                <Filter className="w-3 h-3 mr-1" />
                                IP: {log.ipHash.substring(0, 8)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {log.resourceId && (
                        <Badge variant="secondary" className="text-xs">
                          ID: {log.resourceId.substring(0, 8)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredLogs.length > 100 && (
                  <div className="text-center py-4 text-gray-500">
                    Showing first 100 results. Use filters to narrow down your search.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
