'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Eye, 
  Calendar,
  User,
  Activity,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  category: string;
  setting: string;
  resource: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

interface AuditStats {
  total: number;
  filtered: number;
  actions: {
    CREATE: number;
    READ: number;
    UPDATE: number;
    DELETE: number;
    APPROVE: number;
  };
  categories: {
    ai_policy: number;
    compliance_report: number;
    user_management: number;
    system: number;
  };
  topActors: Record<string, number>;
}

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchFilters, setSearchFilters] = useState({
    actor: '',
    action: '',
    resource: '',
    category: '',
    setting: '',
    startDate: '',
    endDate: '',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load initial data
  useEffect(() => {
    loadAuditLogs();
  }, [searchFilters, currentPage]);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/admin/audit/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs);
        setAuditStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadAuditLogs();
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch('/api/admin/audit/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          filters: Object.fromEntries(
            Object.entries(searchFilters).filter(([_, value]) => value !== '')
          )
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'READ': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'UPDATE': return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'DELETE': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'APPROVE': return <Shield className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'READ': return 'bg-blue-100 text-blue-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'APPROVE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai_policy': return <Shield className="h-4 w-4" />;
      case 'compliance_report': return <FileText className="h-4 w-4" />;
      case 'user_management': return <User className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Log Management</h1>
        <p className="text-gray-600">Søk, filtrer og eksporter systemaudit-logger for compliance og sikkerhet</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Søk & Filtrer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Søkefiltre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Aktør</label>
                  <Input
                    placeholder="Søk etter bruker..."
                    value={searchFilters.actor}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, actor: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Handling</label>
                  <Select value={searchFilters.action} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg handling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle handlinger</SelectItem>
                      <SelectItem value="CREATE">CREATE</SelectItem>
                      <SelectItem value="READ">READ</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="APPROVE">APPROVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Kategori</label>
                  <Select value={searchFilters.category} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle kategorier</SelectItem>
                      <SelectItem value="ai_policy">AI Policy</SelectItem>
                      <SelectItem value="compliance_report">Compliance Report</SelectItem>
                      <SelectItem value="user_management">User Management</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Ressurs</label>
                  <Input
                    placeholder="Søk etter ressurs..."
                    value={searchFilters.resource}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, resource: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Fra dato</label>
                  <Input
                    type="date"
                    value={searchFilters.startDate}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Til dato</label>
                  <Input
                    type="date"
                    value={searchFilters.endDate}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Søker...' : 'Søk'}
                </Button>
                
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Eksporter CSV
                </Button>
                
                <Button variant="outline" onClick={() => handleExport('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Eksporter JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Logger
                {auditStats && (
                  <Badge variant="secondary">
                    {auditStats.filtered} av {auditStats.total} logger
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Laster audit logger...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getActionIcon(log.action)}
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                            {getCategoryIcon(log.category)}
                            <span className="text-sm text-gray-600">{log.category}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(log.timestamp).toLocaleString('nb-NO')}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-medium">{log.resource}</p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Aktør:</span> {log.userEmail}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Setting:</span> {log.setting}
                            </p>
                            {log.ipAddress && (
                              <p className="text-sm text-gray-500">
                                IP: {log.ipAddress}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {auditLogs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Ingen audit logger funnet</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Side {currentPage} av {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Forrige
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Neste
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {auditStats && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Totalt</p>
                        <p className="text-2xl font-bold text-gray-900">{auditStats.total}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Filtrert</p>
                        <p className="text-2xl font-bold text-gray-900">{auditStats.filtered}</p>
                      </div>
                      <Filter className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Aktører</p>
                        <p className="text-2xl font-bold text-gray-900">{Object.keys(auditStats.topActors).length}</p>
                      </div>
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Kategorier</p>
                        <p className="text-2xl font-bold text-gray-900">{Object.keys(auditStats.categories).length}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actions Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Handlinger
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(auditStats.actions).map(([action, count]) => (
                        <div key={action} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getActionIcon(action)}
                            <span className="font-medium">{action}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Categories Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Kategorier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(auditStats.categories).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="font-medium">{category.replace('_', ' ')}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Actors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mest aktive aktører
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(auditStats.topActors)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 10)
                      .map(([actor, count]) => (
                        <div key={actor} className="flex items-center justify-between">
                          <span className="font-medium">{actor}</span>
                          <Badge variant="secondary">{count} handlinger</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
