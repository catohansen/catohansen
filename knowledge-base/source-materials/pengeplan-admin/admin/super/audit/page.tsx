"use client";

import { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Calendar, 
  User, 
  Activity,
  Info,
  AlertTriangle,
  Clock
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  diff?: any;
  meta?: unknown;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  topActions: Array<{ action: string; count: number }>;
  topEntities: Array<{ entity: string; count: number }>;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const limit = 50;

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditStats();
  }, [page, searchQuery, selectedAction, selectedEntity]);

  async function fetchAuditLogs() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (searchQuery) params.append('query', searchQuery);
      if (selectedAction) params.append('action', selectedAction);
      if (selectedEntity) params.append('entity', selectedEntity);

      const response = await fetch(`/api/admin/audit?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setLogs(data.logs);
        setTotalPages(Math.ceil(data.total / limit));
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAuditStats() {
    try {
      const response = await fetch('/api/admin/audit/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch audit stats:', error);
    }
  }

  function getActionColor(action: string): string {
    if (action.includes('create')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    if (action.includes('login')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  }

  function getEntityIcon(entity: string) {
    switch (entity) {
      case 'User': return <User className="h-4 w-4" />;
      case 'SystemSetting': return <Activity className="h-4 w-4" />;
      case 'SecretVault': return <AlertTriangle className="h-4 w-4" />;
      case 'Bill': return <Calendar className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('nb-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function truncateText(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Revisjonssporing</h1>
        <p className="text-muted-foreground">
          Spor alle endringer i systemet med fullstendig historikk og revisjonssporing.
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totalt antall</p>
                  <p className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">I dag</p>
                  <p className="text-2xl font-bold">{stats.todayLogs.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top handling</p>
                  <p className="text-lg font-semibold">
                    {stats.topActions[0]?.action || 'Ingen'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top entitet</p>
                  <p className="text-lg font-semibold">
                    {stats.topEntities[0]?.entity || 'Ingen'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Søk og filtrer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Søk</Label>
              <Input
                id="search"
                placeholder="Søk i handlinger, entiteter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="action">Handling</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle handlinger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle handlinger</SelectItem>
                  {stats?.topActions.map((action) => (
                    <SelectItem key={action.action} value={action.action}>
                      {action.action} ({action.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="entity">Entitet</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle entiteter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle entiteter</SelectItem>
                  {stats?.topEntities.map((entity) => (
                    <SelectItem key={entity.entity} value={entity.entity}>
                      {entity.entity} ({entity.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedAction('');
                setSelectedEntity('');
                setPage(1);
              }}
            >
              Nullstill filtre
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Side {page} av {totalPages} • {logs.length} resultater
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revisjonslogg</CardTitle>
          <CardDescription>
            Siste {limit} hendelser. Klikk på en rad for detaljer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Laster revisjonslogg...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Ingen revisjonslogg funnet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Tidspunkt</th>
                    <th className="text-left p-2 font-medium">Bruker</th>
                    <th className="text-left p-2 font-medium">Handling</th>
                    <th className="text-left p-2 font-medium">Entitet</th>
                    <th className="text-left p-2 font-medium">ID</th>
                    <th className="text-left p-2 font-medium">IP</th>
                    <th className="text-left p-2 font-medium">Detaljer</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr 
                      key={log.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="p-2 text-sm">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {log.user?.name || 'Ukjent bruker'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.user?.role || 'Ukjent rolle'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          {getEntityIcon(log.entity)}
                          <span className="text-sm">{log.entity}</span>
                        </div>
                      </td>
                      <td className="p-2 text-sm font-mono">
                        {log.entityId ? truncateText(log.entityId, 8) : '-'}
                      </td>
                      <td className="p-2 text-sm font-mono">
                        {log.ip ? truncateText(log.ip, 15) : '-'}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Forrige
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Side {page} av {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Neste
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Logg-detaljer</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Handling</Label>
                    <p className="text-sm">{selectedLog.action}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Entitet</Label>
                    <p className="text-sm">{selectedLog.entity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Entitet ID</Label>
                    <p className="text-sm font-mono">{selectedLog.entityId || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tidspunkt</Label>
                    <p className="text-sm">{formatDate(selectedLog.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">IP-adresse</Label>
                    <p className="text-sm font-mono">{selectedLog.ip || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">User Agent</Label>
                    <p className="text-sm">{selectedLog.userAgent || '-'}</p>
                  </div>
                </div>
                
                {selectedLog.diff && (
                  <div>
                    <Label className="text-sm font-medium">Endringer</Label>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap">
                        {selectedLog.diff ? JSON.stringify(selectedLog.diff, null, 2) : 'No changes'}
                      </pre>
                    </div>
                  </div>
                )}
                
                {selectedLog.meta && (
                  <div>
                    <Label className="text-sm font-medium">Metadata</Label>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.meta, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

