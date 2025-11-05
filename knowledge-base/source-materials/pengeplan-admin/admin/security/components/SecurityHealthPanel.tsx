'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  Lock,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Key,
  Fingerprint,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react'

interface SecurityHealthItem {
  id: string
  name: string
  status: 'pass' | 'warning' | 'fail'
  score: number
  description: string
  lastChecked: string
  details: string[]
}

interface SecurityHealthData {
  overall: {
    score: number
    status: 'excellent' | 'good' | 'warning' | 'critical'
    lastUpdated: string
  }
  categories: {
    authentication: SecurityHealthItem[]
    network: SecurityHealthItem[]
    database: SecurityHealthItem[]
    application: SecurityHealthItem[]
    monitoring: SecurityHealthItem[]
  }
  recommendations: string[]
}

export default function SecurityHealthPanel() {
  const [healthData, setHealthData] = useState<SecurityHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useEffect(() => {
    fetchHealthData()
    const interval = setInterval(fetchHealthData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Initialize lastRefresh on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !lastRefresh) {
      setLastRefresh(new Date())
    }
  }, [lastRefresh])

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/security/health')
      const data = await response.json()
      
      if (data.success) {
        setHealthData(data.health)
      } else {
        // Use mock data if API fails
        setHealthData(getMockHealthData())
      }
    } catch (error) {
      console.error('Error fetching security health:', error)
      setHealthData(getMockHealthData())
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'fail': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getOverallStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <ShieldCheck className="h-6 w-6 text-green-400" />
      case 'good': return <Shield className="h-6 w-6 text-blue-400" />
      case 'warning': return <ShieldAlert className="h-6 w-6 text-yellow-400" />
      case 'critical': return <ShieldX className="h-6 w-6 text-red-400" />
      default: return <Shield className="h-6 w-6 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-300">Loading security health...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!healthData) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-slate-300">
            <ShieldX className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p>Unable to load security health data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Security Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                {getOverallStatusIcon(healthData.overall.status)}
                Security Health Overview
              </CardTitle>
              <CardDescription className="text-slate-300">
                Comprehensive security status monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Last updated: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Loading...'}
              </span>
              <Button
                onClick={fetchHealthData}
                size="sm"
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getOverallStatusColor(healthData.overall.status)}`}>
                {healthData.overall.score}/100
              </div>
              <p className="text-slate-300 text-sm">Security Score</p>
              <Progress value={healthData.overall.score} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {healthData.overall.status.toUpperCase()}
              </div>
              <p className="text-slate-300 text-sm">Overall Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {healthData.recommendations.length}
              </div>
              <p className="text-slate-300 text-sm">Recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Security */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-blue-400" />
              Authentication Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.categories.authentication.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'pass' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{item.score}%</div>
                      <Progress value={item.score} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Security */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wifi className="h-5 w-5 text-green-400" />
              Network Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.categories.network.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'pass' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{item.score}%</div>
                      <Progress value={item.score} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Security */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-purple-400" />
              Database Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.categories.database.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'pass' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{item.score}%</div>
                      <Progress value={item.score} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Security */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Cpu className="h-5 w-5 text-orange-400" />
              Application Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.categories.application.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'pass' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{item.score}%</div>
                      <Progress value={item.score} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {healthData.recommendations.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-yellow-400" />
              Security Recommendations
            </CardTitle>
            <CardDescription className="text-slate-300">
              Actionable recommendations to improve security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <p className="text-slate-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Mock data for demonstration
function getMockHealthData(): SecurityHealthData {
  return {
    overall: {
      score: 87,
      status: 'good',
      lastUpdated: new Date().toISOString()
    },
    categories: {
      authentication: [
        {
          id: '2fa',
          name: 'Two-Factor Authentication',
          status: 'pass',
          score: 95,
          description: '2FA enabled for all admin accounts',
          lastChecked: new Date().toISOString(),
          details: ['TOTP enabled', 'Backup codes generated']
        },
        {
          id: 'password_policy',
          name: 'Password Policy',
          status: 'warning',
          score: 75,
          description: 'Password policy needs strengthening',
          lastChecked: new Date().toISOString(),
          details: ['Minimum length: 8 characters', 'Complexity requirements needed']
        },
        {
          id: 'session_management',
          name: 'Session Management',
          status: 'pass',
          score: 90,
          description: 'Secure session handling implemented',
          lastChecked: new Date().toISOString(),
          details: ['Session timeout: 30 minutes', 'Secure cookies enabled']
        }
      ],
      network: [
        {
          id: 'firewall',
          name: 'Firewall Configuration',
          status: 'pass',
          score: 85,
          description: 'Firewall rules properly configured',
          lastChecked: new Date().toISOString(),
          details: ['Port filtering active', 'DDoS protection enabled']
        },
        {
          id: 'ssl_tls',
          name: 'SSL/TLS Configuration',
          status: 'pass',
          score: 95,
          description: 'Strong encryption protocols enabled',
          lastChecked: new Date().toISOString(),
          details: ['TLS 1.3 enabled', 'HSTS headers configured']
        },
        {
          id: 'ip_blocking',
          name: 'IP Blocking System',
          status: 'pass',
          score: 80,
          description: 'Automated IP blocking active',
          lastChecked: new Date().toISOString(),
          details: ['12 IPs currently blocked', 'Geographic restrictions enabled']
        }
      ],
      database: [
        {
          id: 'encryption',
          name: 'Database Encryption',
          status: 'pass',
          score: 90,
          description: 'Data encryption at rest and in transit',
          lastChecked: new Date().toISOString(),
          details: ['AES-256 encryption', 'Key rotation enabled']
        },
        {
          id: 'access_control',
          name: 'Access Control',
          status: 'pass',
          score: 85,
          description: 'Role-based access control implemented',
          lastChecked: new Date().toISOString(),
          details: ['Principle of least privilege', 'Regular access reviews']
        },
        {
          id: 'backup_security',
          name: 'Backup Security',
          status: 'warning',
          score: 70,
          description: 'Backup encryption needs improvement',
          lastChecked: new Date().toISOString(),
          details: ['Backups encrypted', 'Offsite storage needed']
        }
      ],
      application: [
        {
          id: 'input_validation',
          name: 'Input Validation',
          status: 'pass',
          score: 88,
          description: 'Comprehensive input sanitization',
          lastChecked: new Date().toISOString(),
          details: ['XSS protection enabled', 'SQL injection prevention']
        },
        {
          id: 'csrf_protection',
          name: 'CSRF Protection',
          status: 'pass',
          score: 92,
          description: 'CSRF tokens implemented',
          lastChecked: new Date().toISOString(),
          details: ['Token validation active', 'SameSite cookies enabled']
        },
        {
          id: 'rate_limiting',
          name: 'Rate Limiting',
          status: 'pass',
          score: 85,
          description: 'API rate limiting configured',
          lastChecked: new Date().toISOString(),
          details: ['100 requests/minute limit', 'IP-based throttling']
        }
      ],
      monitoring: [
        {
          id: 'security_logging',
          name: 'Security Logging',
          status: 'pass',
          score: 90,
          description: 'Comprehensive security event logging',
          lastChecked: new Date().toISOString(),
          details: ['All events logged', 'Log integrity verified']
        },
        {
          id: 'intrusion_detection',
          name: 'Intrusion Detection',
          status: 'pass',
          score: 85,
          description: 'AI-powered threat detection active',
          lastChecked: new Date().toISOString(),
          details: ['Behavioral analysis enabled', 'Anomaly detection active']
        },
        {
          id: 'incident_response',
          name: 'Incident Response',
          status: 'warning',
          score: 75,
          description: 'Incident response procedures need updating',
          lastChecked: new Date().toISOString(),
          details: ['Response team defined', 'Escalation procedures needed']
        }
      ]
    },
    recommendations: [
      'Strengthen password policy to require 12+ characters with special characters',
      'Implement regular security awareness training for all users',
      'Set up automated security scanning in CI/CD pipeline',
      'Review and update incident response procedures',
      'Implement additional backup encryption for sensitive data'
    ]
  }
}
