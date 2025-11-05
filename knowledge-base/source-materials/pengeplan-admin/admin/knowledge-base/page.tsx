'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  FileText, 
  Upload, 
  Search, 
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Database,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'Pengeplan Brukerguide',
      type: 'PDF',
      size: '2.4 MB',
      category: 'Dokumentasjon',
      status: 'published',
      lastModified: '2024-01-15',
      views: 1247
    },
    {
      id: '2', 
      title: 'AI Coach Manual',
      type: 'Markdown',
      size: '156 KB',
      category: 'AI',
      status: 'draft',
      lastModified: '2024-01-14',
      views: 89
    },
    {
      id: '3',
      title: 'Sikkerhetsprotokoll',
      type: 'PDF',
      size: '1.8 MB', 
      category: 'Sikkerhet',
      status: 'published',
      lastModified: '2024-01-13',
      views: 456
    }
  ])

  const [stats, setStats] = useState({
    totalDocs: 47,
    totalSize: '156 MB',
    publishedDocs: 32,
    draftDocs: 15,
    totalViews: 8947,
    avgRating: 4.7
  })

  const [categories, setCategories] = useState([
    { name: 'Dokumentasjon', count: 12, color: 'blue' },
    { name: 'AI', count: 8, color: 'purple' },
    { name: 'Sikkerhet', count: 6, color: 'red' },
    { name: 'API', count: 9, color: 'green' },
    { name: 'Brukerguide', count: 12, color: 'orange' }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-2">Administrer dokumenter og kunnskapsbase</p>
          </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nytt dokument
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Last opp
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale dokumenter</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocs}</div>
            <p className="text-xs text-muted-foreground">
              +12% fra forrige måned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale størrelse</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize}</div>
            <p className="text-xs text-muted-foreground">
              Lagring brukt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiserte</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedDocs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.draftDocs} utkast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale visninger</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Gjennomsnittlig rating: {stats.avgRating}/5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Kategorier
          </CardTitle>
          <CardDescription>
            Organiser dokumenter etter kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-3`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="outline">{category.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Dokumenter
          </CardTitle>
          <CardDescription>
            Alle dokumenter i kunnskapsbasen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {doc.type === 'PDF' ? (
                      <FileText className="h-8 w-8 text-red-500" />
                    ) : (
                      <BookOpen className="h-8 w-8 text-blue-500" />
            )}
          </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {doc.category} • {doc.size} • Sist endret: {doc.lastModified}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={doc.status === 'published' ? 'default' : 'outline'}>
                    {doc.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{doc.views} visninger</span>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
        </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Hurtighandlinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Søk dokumenter
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Eksporter alle
            </Button>
            <Button variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              Publiser til web
            </Button>
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Sikkerhetsinnstillinger
            </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  )
}