'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, 
  AlertTriangle, 
  Shield, 
  RefreshCw,
  Flag
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SessionGeoData {
  id: string
  userId: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  country: string
  city?: string
  ipAddress?: string
  provider?: string
  isSuspicious: boolean
  suspiciousReason?: string
  createdAt: string
}

interface SessionGeoOverview {
  totalSessions: number
  suspiciousSessions: number
  uniqueCountries: number
  suspiciousRate: number
}

interface TopCountry {
  country: string
  sessions: number
}

interface GeoStats {
  totalCached: number
  countries: number
  providers: number
  cacheHitRate: number
}

export default function SessionGeoAnalysisPage() {
  const [overview, setOverview] = useState<SessionGeoOverview | null>(null)
  const [topCountries, setTopCountries] = useState<TopCountry[]>([])
  const [recentSessions, setRecentSessions] = useState<SessionGeoData[]>([])
  const [suspiciousSessions, setSuspiciousSessions] = useState<SessionGeoData[]>([])
  const [impossibleTravel, setImpossibleTravel] = useState<SessionGeoData[]>([])
  const [geoStats, setGeoStats] = useState<GeoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedTab, setSelectedTab] = useState('overview')

  const loadSessionGeoData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/security/sessions-geo?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setOverview(data.data.overview)
        setTopCountries(data.data.topCountries)
        setRecentSessions(data.data.recentSessions)
        setSuspiciousSessions(data.data.suspiciousSessions)
        setImpossibleTravel(data.data.impossibleTravel)
        setGeoStats(data.data.geoStats)
      }
    } catch (error) {
      console.error('Failed to load session geo data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessionGeoData()
  }, [timeRange])

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Norway': '🇳🇴',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Sweden': '🇸🇪',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Netherlands': '🇳🇱',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'Brazil': '🇧🇷',
      'India': '🇮🇳',
      'Russia': '🇷🇺',
      'Local': '🏠',
      'Unknown': '❓'
    }
    return flags[country] || '🌍'
  }

  const getSuspiciousColor = (isSuspicious: boolean) => {
    return isSuspicious ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('no-NO')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Laster geo-analyse...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Geo-analyse</h1>
        <p className="text-gray-600">Overvåk innlogginger og mistenkelig aktivitet basert på geografisk lokasjon</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Siste time</SelectItem>
              <SelectItem value="24h">Siste 24 timer</SelectItem>
              <SelectItem value="7d">Siste 7 dager</SelectItem>
              <SelectItem value="30d">Siste 30 dager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={loadSessionGeoData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Oppdater
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt sesjoner</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.uniqueCountries || 0} unike land
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mistenkelige</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overview?.suspiciousSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.suspiciousRate.toFixed(1) || 0}% av totalt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GeoIP Cache</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoStats?.totalCached || 0}</div>
            <p className="text-xs text-muted-foreground">
              {geoStats?.cacheHitRate.toFixed(1) || 0}% hit rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umulige reiser</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {impossibleTravel.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Siste {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-2 px-1 border-b-2 ${
              selectedTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Oversikt
          </button>
          <button
            onClick={() => setSelectedTab('suspicious')}
            className={`pb-2 px-1 border-b-2 ${
              selectedTab === 'suspicious' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mistenkelige ({suspiciousSessions.length})
          </button>
          <button
            onClick={() => setSelectedTab('recent')}
            className={`pb-2 px-1 border-b-2 ${
              selectedTab === 'recent' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Nylige sesjoner
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Topp land</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCountries.slice(0, 10).map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCountryFlag(country.country)}</span>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{country.sessions} sesjoner</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${(country.sessions / (topCountries[0]?.sessions || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impossible Travel */}
            <Card>
              <CardHeader>
                <CardTitle>Umulige reiser</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {impossibleTravel.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Ingen umulige reiser funnet</p>
                  ) : (
                    impossibleTravel.map((session) => (
                      <div key={session.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{session.user.email}</span>
                            <Badge variant="outline">{session.user.role}</Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(session.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span>{getCountryFlag(session.country || 'Unknown')}</span>
                            <span>{session.country}</span>
                            {session.city && <span>• {session.city}</span>}
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            {session.suspiciousReason}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Suspicious Sessions Tab */}
        {selectedTab === 'suspicious' && (
          <Card>
            <CardHeader>
              <CardTitle>Mistenkelige sesjoner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Ingen mistenkelige sesjoner funnet</p>
                ) : (
                  suspiciousSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{session.user.email}</span>
                              <Badge variant="outline">{session.user.role}</Badge>
                              <Badge className={getSuspiciousColor(session.isSuspicious)}>
                                {session.isSuspicious ? 'Mistenkelig' : 'Normal'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {session.user.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {formatTimestamp(session.createdAt)}
                          </div>
                          {session.ipAddress && (
                            <div className="text-xs text-gray-400">
                              IP: {session.ipAddress}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs font-medium text-gray-500">Lokasjon</div>
                          <div className="flex items-center space-x-2">
                            <span>{getCountryFlag(session.country || 'Unknown')}</span>
                            <span>{session.country}</span>
                            {session.city && <span>• {session.city}</span>}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-gray-500">Provider</div>
                          <div className="text-gray-600">
                            {session.provider || 'Ukjent'}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-gray-500">Årsak</div>
                          <div className="text-red-600">
                            {session.suspiciousReason || 'Ukjent'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Sessions Tab */}
        {selectedTab === 'recent' && (
          <Card>
            <CardHeader>
              <CardTitle>Nylige sesjoner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{session.user.email}</span>
                            <Badge variant="outline">{session.user.role}</Badge>
                            <Badge className={getSuspiciousColor(session.isSuspicious)}>
                              {session.isSuspicious ? 'Mistenkelig' : 'Normal'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {session.user.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatTimestamp(session.createdAt)}
                        </div>
                        {session.ipAddress && (
                          <div className="text-xs text-gray-400">
                            IP: {session.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs font-medium text-gray-500">Lokasjon</div>
                        <div className="flex items-center space-x-2">
                          <span>{getCountryFlag(session.country || 'Unknown')}</span>
                          <span>{session.country}</span>
                          {session.city && <span>• {session.city}</span>}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-500">Provider</div>
                        <div className="text-gray-600">
                          {session.provider || 'Ukjent'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-500">Status</div>
                        <div className={session.isSuspicious ? 'text-red-600' : 'text-green-600'}>
                          {session.isSuspicious ? 'Mistenkelig' : 'Normal'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
