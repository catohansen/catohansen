'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Upload, 
  FileText, 
  BookOpen, 
  Star, 
  MessageSquare,
  Download,
  Edit,
  Trash2,
  Plus,
  Filter,
  SortAsc,
  Grid,
  List,
  Brain,
  Zap
} from 'lucide-react'

interface Document {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  summary: string
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  isPublished: boolean
  _count: {
    versions: number
    comments: number
    bookmarks: number
  }
}

interface PdfDoc {
  id: string
  title: string
  fileUrl: string
  category: string
  tags: string[]
  summary: string
  signed: boolean
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function KnowledgeBaseEnhanced() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [pdfDocs, setPdfDocs] = useState<PdfDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'popular'>('newest')

  const categories = [
    'all',
    'Systemarkitektur',
    'AI og Automatisering', 
    'Økonomi & Faktura',
    'Verge-systemet',
    'Sikkerhet & Compliance',
    'Admin Analytics',
    'Opplæring',
    'Eksterne kilder',
    'Utviklerdokumentasjon'
  ]

  useEffect(() => {
    fetchDocuments()
    fetchPdfDocs()
  }, [selectedCategory, sortBy])

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams({
        category: selectedCategory !== 'all' ? selectedCategory : '',
        search: searchQuery,
        sort: sortBy
      })
      
      const response = await fetch(`/api/kb/documents?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPdfDocs = async () => {
    try {
      const params = new URLSearchParams({
        category: selectedCategory !== 'all' ? selectedCategory : ''
      })
      
      const response = await fetch(`/api/kb/pdf?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPdfDocs(data.pdfDocs)
      }
    } catch (error) {
      console.error('Error fetching PDF documents:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    // TODO: Implement AI search
    fetchDocuments()
  }

  const handleAISearch = async (query: string) => {
    try {
      const response = await fetch('/api/kb/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 20 })
      })
      
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.results)
      }
    } catch (error) {
      console.error('Error in AI search:', error)
    }
  }

  const handleBookmark = async (docId: string) => {
    try {
      const response = await fetch(`/api/kb/documents/${docId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bookmark' })
      })
      
      if (response.ok) {
        // Refresh documents
        fetchDocuments()
      }
    } catch (error) {
      console.error('Error bookmarking document:', error)
    }
  }

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      const response = await fetch(`/api/kb/documents/${docId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== docId))
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {doc.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {doc.summary || doc.content.substring(0, 150) + '...'}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button size="sm" variant="ghost" onClick={() => handleBookmark(doc.id)}>
              <Star className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{doc.category}</Badge>
          {doc.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{doc.author.name}</span>
            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {doc._count.comments}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {doc._count.bookmarks}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PdfCard = ({ doc }: { doc: PdfDoc }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {doc.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {doc.summary || 'PDF document'}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{doc.category}</Badge>
          {doc.signed && <Badge variant="default" className="bg-green-100 text-green-800">Signed</Badge>}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{doc.author.name}</span>
            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-2">
            Manage and organize all your documentation and PDF files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => handleAISearch(searchQuery)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Search
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-1"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded px-3 py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1 ml-auto">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            PDF Files ({pdfDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first document'}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {documents.map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs">
          {pdfDocs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDF files found</h3>
                <p className="text-gray-600 mb-4">
                  Upload your first PDF document to get started
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {pdfDocs.map(doc => (
                <PdfCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


