'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Search, Download, Filter, CheckCircle, AlertTriangle, Trash2, Eye } from 'lucide-react';

interface DataAccessEntry {
  id: string;
  module: string;
  dataType: string;
  purpose: string;
  accessTime: Date;
  dataScope: string;
  anonymized: boolean;
  retentionPolicy: string;
  userId?: string;
  metadata?: any;
}

interface AIDataAccessPanelProps {
  className?: string;
}

export function AIDataAccessPanel({ className }: AIDataAccessPanelProps) {
  const [dataAccessLog, setDataAccessLog] = useState<DataAccessEntry[]>([]);
  const [filteredLog, setFilteredLog] = useState<DataAccessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState('');
  const [anonymizedFilter, setAnonymizedFilter] = useState('');
  const [complianceStatus, setComplianceStatus] = useState<any>(null);

  useEffect(() => {
    fetchDataAccessLog();
    fetchComplianceStatus();
  }, []);

  useEffect(() => {
    filterLog();
  }, [dataAccessLog, searchTerm, moduleFilter, dataTypeFilter, anonymizedFilter]);

  const fetchDataAccessLog = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai/data-access');
      const data = await response.json();
      
      if (data.success) {
        setDataAccessLog(data.data.dataAccessLog || []);
      }
    } catch (error) {
      console.error('Error fetching data access log:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceStatus = async () => {
    try {
      const response = await fetch('/api/admin/ai/governance');
      const data = await response.json();
      
      if (data.success) {
        setComplianceStatus(data.data.governance.compliance);
      }
    } catch (error) {
      console.error('Error fetching compliance status:', error);
    }
  };

  const filterLog = () => {
    let filtered = dataAccessLog;

    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.dataScope.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (moduleFilter) {
      filtered = filtered.filter(entry => entry.module === moduleFilter);
    }

    if (dataTypeFilter) {
      filtered = filtered.filter(entry => entry.dataType === dataTypeFilter);
    }

    if (anonymizedFilter) {
      const isAnonymized = anonymizedFilter === 'true';
      filtered = filtered.filter(entry => entry.anonymized === isAnonymized);
    }

    setFilteredLog(filtered);
  };

  const exportDataAccessLog = async (format: 'CSV' | 'JSON') => {
    try {
      const response = await fetch(`/api/admin/ai/data-access?format=${format}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-data-access-log.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data access log:', error);
    }
  };

  const cleanExpiredData = async () => {
    try {
      const response = await fetch('/api/admin/ai/governance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'clean_expired_data',
          data: { retentionDays: 365 }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Cleaned ${data.data.cleanedCount} expired data entries`);
        fetchDataAccessLog();
      }
    } catch (error) {
      console.error('Error cleaning expired data:', error);
    }
  };

  const getComplianceIcon = () => {
    if (!complianceStatus) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    
    if (complianceStatus.complianceScore >= 90) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (complianceStatus.complianceScore >= 80) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getComplianceBadge = () => {
    if (!complianceStatus) return <Badge variant="secondary">Unknown</Badge>;
    
    const score = complianceStatus.complianceScore;
    if (score >= 90) {
      return <Badge variant="default" className="bg-green-500">Compliant</Badge>;
    } else if (score >= 80) {
      return <Badge variant="secondary" className="bg-yellow-500">Warning</Badge>;
    } else {
      return <Badge variant="destructive">Non-Compliant</Badge>;
    }
  };

  const getUniqueValues = (key: keyof DataAccessEntry) => {
    return Array.from(new Set(dataAccessLog.map(entry => entry[key] as string))).filter(Boolean);
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'economy':
        return '💰';
      case 'health':
        return '🏥';
      case 'document':
        return '📄';
      case 'system':
        return '⚙️';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Data Access Tracker
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
          <Shield className="h-5 w-5" />
          AI Data Access Tracker
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getComplianceIcon()}
            <span className="text-sm">GDPR Status:</span>
            {getComplianceBadge()}
            {complianceStatus && (
              <span className="text-sm text-gray-500">
                ({Math.round(complianceStatus.complianceScore)}%)
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search data access..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-64"
          />
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Modules</SelectItem>
              {getUniqueValues('module').map(module => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {getUniqueValues('dataType').map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={anonymizedFilter} onValueChange={setAnonymizedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Anonymized" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDataAccessLog('CSV')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDataAccessLog('JSON')}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={cleanExpiredData}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Clean
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getDataTypeIcon(entry.dataType)}</span>
                  <div>
                    <div className="font-medium">{entry.purpose}</div>
                    <div className="text-sm text-gray-500">
                      {entry.module} • {entry.dataType} • {entry.dataScope}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(entry.accessTime).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={entry.anonymized ? 'default' : 'destructive'}>
                    {entry.anonymized ? 'Anonymized' : 'Not Anonymized'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {entry.retentionPolicy}
                  </Badge>
                  {entry.userId && (
                    <Badge variant="secondary" className="text-xs">
                      User: {entry.userId.substring(0, 8)}...
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {filteredLog.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data access entries found matching your filters.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}



