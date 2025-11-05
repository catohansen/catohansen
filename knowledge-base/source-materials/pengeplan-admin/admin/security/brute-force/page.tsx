'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Ban, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BruteForceStats {
  totalFails: number;
  uniqueIps: number;
  blockedIps: number;
  topIps: Array<{ ip: string; attempts: number }>;
  topEmails: Array<{ email: string | null; attempts: number }>;
}

interface IpDetails {
  ip: string;
  isBlocked: boolean;
  blockInfo?: {
    reason: string;
    blockedBy: string;
    blockedAt: string;
    expiresAt?: string;
  };
  recentEvents: Array<{
    id: string;
    email: string | null;
    reason: string;
    count: number;
    bucketStart: string;
    userAgent?: string;
  }>;
}

export default function BruteForceDashboard() {
  const [stats, setStats] = useState<BruteForceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [ipDetails, setIpDetails] = useState<IpDetails | null>(null);
  const [ipDetailsLoading, setIpDetailsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('24h');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const from = new Date();
      if (dateRange === '24h') {
        from.setHours(from.getHours() - 24);
      } else if (dateRange === '7d') {
        from.setDate(from.getDate() - 7);
      } else if (dateRange === '30d') {
        from.setDate(from.getDate() - 30);
      }
      
      const response = await fetch(`/api/admin/security/bruteforce/overview?from=${from.toISOString()}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIpDetails = async (ip: string) => {
    try {
      setIpDetailsLoading(true);
      const response = await fetch(`/api/admin/security/bruteforce/ip/${encodeURIComponent(ip)}`);
      const data = await response.json();
      
      if (data.success) {
        setIpDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch IP details:', error);
    } finally {
      setIpDetailsLoading(false);
    }
  };

  const handleBlockIp = async (ip: string, reason: string = 'manual') => {
    try {
      const response = await fetch(`/api/admin/security/bruteforce/ip/${encodeURIComponent(ip)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', reason })
      });
      
      if (response.ok) {
        await fetchIpDetails(ip);
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to block IP:', error);
    }
  };

  const handleUnblockIp = async (ip: string) => {
    try {
      const response = await fetch(`/api/admin/security/bruteforce/ip/${encodeURIComponent(ip)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock' })
      });
      
      if (response.ok) {
        await fetchIpDetails(ip);
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to unblock IP:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange, fetchStats]);

  useEffect(() => {
    if (selectedIp) {
      fetchIpDetails(selectedIp);
    }
  }, [selectedIp]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Laster sikkerhetsstatistikk...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            Brute-Force Detection
          </h1>
          <p className="text-gray-600 mt-2">
            Overvåk og administrer sikkerhetstrusler og mislykkede innloggingsforsøk
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Siste 24 timer</option>
            <option value="7d">Siste 7 dager</option>
            <option value="30d">Siste 30 dager</option>
          </select>
          
          <Button onClick={fetchStats} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mislykkede forsøk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.totalFails.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-600">
              Totalt antall mislykkede forsøk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unike IP-adresser</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.uniqueIps || 0}
            </div>
            <p className="text-xs text-gray-600">
              Forskjellige IP-adresser
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blokkerte IP-er</CardTitle>
            <Ban className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.blockedIps || 0}
            </div>
            <p className="text-xs text-gray-600">
              Aktuelt blokkerte adresser
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topp IP</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.topIps[0]?.attempts || 0}
            </div>
            <p className="text-xs text-gray-600">
              {stats?.topIps[0]?.ip || 'Ingen data'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top-ips" className="space-y-6">
        <TabsList>
          <TabsTrigger value="top-ips">Topp IP-adresser</TabsTrigger>
          <TabsTrigger value="top-emails">Topp E-post mål</TabsTrigger>
        </TabsList>

        <TabsContent value="top-ips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topp IP-adresser med mislykkede forsøk</CardTitle>
              <CardDescription>
                IP-adresser med flest mislykkede innloggingsforsøk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topIps.map((item, index) => (
                  <div key={item.ip} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-mono text-sm">{item.ip}</p>
                        <p className="text-xs text-gray-600">
                          {item.attempts} mislykkede forsøk
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIp(item.ip)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detaljer
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBlockIp(item.ip, 'brute_force')}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Blokker
                      </Button>
                    </div>
                  </div>
                ))}
                {(!stats?.topIps || stats.topIps.length === 0) && (
                  <p className="text-center text-gray-500 py-8">
                    Ingen mislykkede forsøk funnet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topp E-post mål</CardTitle>
              <CardDescription>
                E-postadresser som har blitt målrettet (maskert for personvern)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topEmails.map((item, index) => (
                  <div key={item.email || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-mono text-sm">{item.email || 'Ukjent'}</p>
                        <p className="text-xs text-gray-600">
                          {item.attempts} mislykkede forsøk
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.topEmails || stats.topEmails.length === 0) && (
                  <p className="text-center text-gray-500 py-8">
                    Ingen e-post mål funnet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* IP Details Modal */}
      {selectedIp && ipDetails && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  IP-detaljer: {selectedIp}
                </CardTitle>
                <CardDescription>
                  Detaljert informasjon om denne IP-adressen
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIp(null)}
              >
                Lukk
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Block Status */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {ipDetails.isBlocked ? (
                  <Ban className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                Blokkeringsstatus
              </h3>
              {ipDetails.isBlocked && ipDetails.blockInfo ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Årsak:</strong> {ipDetails.blockInfo.reason}</p>
                  <p><strong>Blokkert av:</strong> {ipDetails.blockInfo.blockedBy}</p>
                  <p><strong>Blokkert:</strong> {new Date(ipDetails.blockInfo.blockedAt).toLocaleString()}</p>
                  {ipDetails.blockInfo.expiresAt && (
                    <p><strong>Utløper:</strong> {new Date(ipDetails.blockInfo.expiresAt).toLocaleString()}</p>
                  )}
                </div>
              ) : (
                <p className="text-green-600">IP-adressen er ikke blokkert</p>
              )}
            </div>

            {/* Recent Events */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Siste hendelser
              </h3>
              <div className="space-y-2">
                {ipDetails.recentEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p><strong>E-post:</strong> {event.email || 'Ukjent'}</p>
                        <p><strong>Årsak:</strong> {event.reason}</p>
                        <p><strong>Antall:</strong> {event.count}</p>
                      </div>
                      <div className="text-right text-xs text-gray-600">
                        <p>{new Date(event.bucketStart).toLocaleString()}</p>
                        {event.userAgent && (
                          <p className="truncate max-w-xs">{event.userAgent}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {ipDetails.recentEvents.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Ingen hendelser funnet
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {ipDetails.isBlocked ? (
                <Button
                  variant="default"
                  onClick={() => handleUnblockIp(selectedIp)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Opphev blokkering
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => handleBlockIp(selectedIp, 'manual')}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Blokker IP
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
