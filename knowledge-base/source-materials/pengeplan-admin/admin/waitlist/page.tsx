'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Download,
  Send
} from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  name?: string
  phone?: string
  position: number
  status: string
  createdAt: string
  invitedAt?: string
  convertedAt?: string
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    invited: 0,
    converted: 0
  })

  useEffect(() => {
    fetchWaitlistData()
  }, [])

  const fetchWaitlistData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/waitlist')
      const data = await response.json()
      
      if (data.success) {
        setEntries(data.data.entries)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching waitlist data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Venter</Badge>
      case 'INVITED':
        return <Badge variant="default"><Mail className="h-3 w-3 mr-1" />Invitert</Badge>
      case 'CONVERTED':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Konvertert</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Kansellert</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster venteliste...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Venteliste Administrasjon</h1>
        <p className="text-gray-600">Administrer venteliste og send invitasjoner</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totalt</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Venter</p>
                <p className="text-2xl font-bold text-gray-900">{stats.waiting}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Invitert</p>
                <p className="text-2xl font-bold text-gray-900">{stats.invited}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Konvertert</p>
                <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Søk i venteliste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Eksporter
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600">
            <Send className="h-4 w-4 mr-2" />
            Send Invitasjoner
          </Button>
        </div>
      </div>

      {/* Waitlist Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Venteliste ({filteredEntries.length} personer)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {entry.position}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.name || 'Ukjent navn'}</p>
                    <p className="text-sm text-gray-600">{entry.email}</p>
                    {entry.phone && (
                      <p className="text-sm text-gray-500">{entry.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {getStatusBadge(entry.status)}
                  
                  <div className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString('nb-NO')}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      Se detaljer
                    </Button>
                    {entry.status === 'WAITING' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Send invitasjon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


