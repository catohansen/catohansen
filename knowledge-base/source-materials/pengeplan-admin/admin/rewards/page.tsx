'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Gift, 
  Settings, 
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface RewardsStats {
  overview: {
    totalUsers: number;
    totalReferrals: number;
    totalRewards: number;
    totalProfitFund: number;
    activeReferrals: number;
    totalEarned: number;
    totalPaid: number;
  };
  growth: {
    newUsersThisMonth: number;
    newReferralsThisMonth: number;
    newRewardsThisMonth: number;
    userGrowthRate: number;
    referralGrowthRate: number;
  };
  averages: {
    avgMonthlyBonus: number;
    avgYearlyBonus: number;
    avgReferralsPerUser: number;
  };
  topPerformers: Array<{
    userId: string;
    referralCount: number;
    totalEarned: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    resource: string;
    user: { name: string; email: string };
    createdAt: string;
  }>;
  fundStatus: {
    currentYear: number;
    fundAmount: number;
    distributed: boolean;
    distributionDate: string | null;
    userShare: number;
    guardianShare: number;
  };
}

export default function AdminRewardsPage() {
  const [stats, setStats] = useState<RewardsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/rewards/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Failed to fetch rewards statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDistributeFund = async () => {
    try {
      const response = await fetch('/api/rewards/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'distribute_fund',
          data: { minXp: 100 }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchStats(); // Refresh stats
        alert('Fund distributed successfully!');
      } else {
        alert('Failed to distribute fund: ' + result.error);
      }
    } catch (err) {
      alert('Error distributing fund');
      console.error('Error distributing fund:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading rewards data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No rewards data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rewards & Overskuddsfond</h1>
          <p className="text-muted-foreground">
            Administrer belønningssystemet og overskuddsfond
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={fetchStats} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button 
            onClick={handleDistributeFund}
            disabled={stats.fundStatus.distributed}
            variant="default"
            size="sm"
          >
            <Gift className="h-4 w-4 mr-2" />
            {stats.fundStatus.distributed ? 'Allerede distribuert' : 'Distribuer fond'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt brukere</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.growth.newUsersThisMonth} denne måneden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive vervinger</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalReferrals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.growth.newReferralsThisMonth} denne måneden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt opptjent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.totalEarned.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Gjennomsnitt: {stats.averages.avgMonthlyBonus.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK' 
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overskuddsfond</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.fundStatus.fundAmount.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.fundStatus.distributed ? (
                <Badge variant="secondary" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Distribuert
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Ikke distribuert
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="referrals">Vervinger</TabsTrigger>
          <TabsTrigger value="fund">Fond & Fordeling</TabsTrigger>
          <TabsTrigger value="payouts">Utbetalinger</TabsTrigger>
          <TabsTrigger value="settings">Innstillinger</TabsTrigger>
          <TabsTrigger value="logs">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Topp ververe</CardTitle>
                <CardDescription>Brukere med flest vervinger</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topPerformers.slice(0, 5).map((performer, index) => (
                    <div key={performer.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="text-sm">Bruker {performer.userId.slice(-4)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{performer.referralCount} vervinger</div>
                        <div className="text-xs text-muted-foreground">
                          {performer.totalEarned.toLocaleString('nb-NO', { 
                            style: 'currency', 
                            currency: 'NOK' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Nylig aktivitet</CardTitle>
                <CardDescription>Siste handlinger i systemet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.user?.name || 'System'}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('nb-NO')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fund" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overskuddsfond {stats.fundStatus.currentYear}</CardTitle>
              <CardDescription>
                Fordeling av overskudd til medlemmer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.fundStatus.fundAmount.toLocaleString('nb-NO', { 
                      style: 'currency', 
                      currency: 'NOK' 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">Totalt fond</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.fundStatus.userShare.toLocaleString('nb-NO', { 
                      style: 'currency', 
                      currency: 'NOK' 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">Brukerandel (70%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.fundStatus.guardianShare.toLocaleString('nb-NO', { 
                      style: 'currency', 
                      currency: 'NOK' 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">Vergeandel (30%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Innstillinger</CardTitle>
              <CardDescription>
                Konfigurer belønningssystemet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Referral bonus rate</label>
                    <div className="text-2xl font-bold">5%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Guardian bonus rate</label>
                    <div className="text-2xl font-bold">7%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Profit share rate</label>
                    <div className="text-2xl font-bold">10%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User share</label>
                    <div className="text-2xl font-bold">70%</div>
                  </div>
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Rediger innstillinger
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}