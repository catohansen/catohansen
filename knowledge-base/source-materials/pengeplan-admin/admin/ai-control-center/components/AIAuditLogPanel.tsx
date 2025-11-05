'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Search, Filter, Eye, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  source: string;
  actionType: string;
  summary: string;
  result: 'success' | 'error' | 'aborted' | 'rollback';
  timestamp: Date;
  performedBy: 'AI' | 'Admin' | 'Verge';
  verifiedBy?: string;
  verifiedAt?: Date;
}

interface AIAuditLogPanelProps {
  className?: string;
}

export function AIAuditLogPanel({ className }: AIAuditLogPanelProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, sourceFilter, actionTypeFilter, resultFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai/audit');
      const data = await response.json();
      
      if (data.success) {
        setAuditLogs(data.data.auditTrail || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actionType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter) {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    if (actionTypeFilter) {
      filtered = filtered.filter(log => log.actionType === actionTypeFilter);
    }

    if (resultFilter) {
      filtered = filtered.filter(log => log.result === resultFilter);
    }

    setFilteredLogs(filtered);
  };

  const exportAuditLogs = async (format: 'CSV' | 'JSON') => {
    try {
      const response = await fetch(`/api/admin/ai/audit?format=${format}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-audit-log.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'aborted':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'rollback':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResultBadge = (result: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      aborted: 'secondary',
      rollback: 'outline'
    } as const;

    return (
      <Badge variant={variants[result as keyof typeof variants] || 'outline'}>
        {result.toUpperCase()}
      </Badge>
    );
  };

  const getUniqueValues = (key: keyof AuditLogEntry) => {
    return Array.from(new Set(auditLogs.map(log => log[key] as string))).filter(Boolean);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            AI Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          AI Audit Log
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-64"
          />
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              {getUniqueValues('source').map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {getUniqueValues('actionType').map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Results</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="aborted">Aborted</SelectItem>
              <SelectItem value="rollback">Rollback</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAuditLogs('CSV')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAuditLogs('JSON')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-center gap-3">
                  {getResultIcon(log.result)}
                  <div>
                    <div className="font-medium">{log.summary}</div>
                    <div className="text-sm text-gray-500">
                      {log.source} • {log.actionType} • {log.performedBy}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getResultBadge(log.result)}
                  {log.verifiedBy && (
                    <Badge variant="outline" className="text-xs">
                      Verified by {log.verifiedBy}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No audit logs found matching your filters.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}



