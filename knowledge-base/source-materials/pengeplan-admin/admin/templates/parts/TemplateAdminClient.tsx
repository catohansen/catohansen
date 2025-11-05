'use client'

import { useState } from 'react'
// import type { Template } from '@prisma/client' // Template model not found
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { createTemplate, updateTemplate, deleteTemplate } from '@/lib/template-actions' // Not implemented yet

interface TemplateAdminClientProps {
  templates: any[]
}

export function TemplateAdminClient({ templates }: TemplateAdminClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL')
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [testEmailModal, setTestEmailModal] = useState<any | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [testSubject, setTestSubject] = useState('')

  const categories = [...new Set(templates.map(t => t.category))]
  const types = [...new Set(templates.map(t => t.type))]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory
    const matchesType = selectedType === 'ALL' || template.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleCreateTemplate = async (formData: FormData) => {
    const data = {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      body: formData.get('body') as string,
      description: formData.get('description') as string,
      isDefault: formData.get('isDefault') === 'on'
    }

    try {
      // await createTemplate(data, 'system') // TODO: Implement createTemplate function
      setIsCreating(false)
      window.location.reload()
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const handleUpdateTemplate = async (id: string, formData: FormData) => {
    const data = {
      title: formData.get('title') as string,
      body: formData.get('body') as string,
      description: formData.get('description') as string,
      isDefault: formData.get('isDefault') === 'on',
      isActive: formData.get('isActive') === 'on'
    }

    try {
      // await updateTemplate(id, data, 'system', 'Updated via admin panel') // TODO: Implement updateTemplate function
      setEditingTemplate(null)
      window.location.reload()
    } catch (error) {
      console.error('Failed to update template:', error)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Er du sikker på at du vil deaktivere denne malen?')) {
      try {
        // await deleteTemplate(id) // TODO: Implement deleteTemplate function
        window.location.reload()
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailModal || !testEmail || !testSubject) return

    try {
      const response = await fetch('/api/admin/templates/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: testEmailModal.id,
          to: testEmail,
          subject: testSubject,
          vars: {
            navn: 'Test Bruker',
            beløp: '1000',
            dato: new Date().toLocaleDateString('nb-NO')
          }
        })
      })

      if (response.ok) {
        alert('Test e-post sendt!')
        setTestEmailModal(null)
        setTestEmail('')
        setTestSubject('')
      } else {
        alert('Kunne ikke sende test e-post')
      }
    } catch (error) {
      console.error('Test email error:', error)
      alert('Feil ved sending av test e-post')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer maler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Søk</Label>
              <Input
                id="search"
                placeholder="Søk etter mal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Alle kategorier</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Alle typer</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setIsCreating(true)} className="w-full">
                Ny mal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Template Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Opprett ny mal</CardTitle>
            <CardDescription>Fyll ut informasjonen for den nye malen</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreateTemplate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tittel</Label>
                  <Input name="title" id="title" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BREV">Brev</SelectItem>
                      <SelectItem value="EMAIL">E-post</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gjeld">Gjeld</SelectItem>
                      <SelectItem value="Regninger">Regninger</SelectItem>
                      <SelectItem value="NAV">NAV</SelectItem>
                      <SelectItem value="Inkasso">Inkasso</SelectItem>
                      <SelectItem value="Støtteordninger">Støtteordninger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" name="isDefault" id="isDefault" />
                  <Label htmlFor="isDefault">Standard mal for kategorien</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Beskrivelse</Label>
                <Input name="description" id="description" />
              </div>
              <div>
                <Label htmlFor="body">Mal-innhold</Label>
                <textarea
                  name="body"
                  id="body"
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Skriv mal-innholdet her. Bruk {{variabel}} for variabler..."
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Opprett mal</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Avbryt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{template.title}</span>
                    {template.isDefault && (
                      <Badge variant="secondary">Standard</Badge>
                    )}
                    <Badge variant={template.isActive ? "default" : "destructive"}>
                      {template.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {template.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    Rediger
                  </Button>
                  {template.type === 'EMAIL' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTestEmailModal(template)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Deaktiver
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {template.type}
                </div>
                <div>
                  <span className="font-medium">Kategori:</span> {template.category}
                </div>
                <div>
                  <span className="font-medium">Versjon:</span> {template.version}
                </div>
                <div>
                  <span className="font-medium">Sist endret:</span> {new Date(template.lastEditedAt).toLocaleDateString('no-NO')}
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {template.body.substring(0, 200)}
                    {template.body.length > 200 && '...'}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Rediger mal: {editingTemplate.title}</CardTitle>
            <CardDescription>Oppdater mal-innholdet</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={(formData) => handleUpdateTemplate(editingTemplate.id, formData)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Tittel</Label>
                  <Input
                    name="title"
                    id="edit-title"
                    defaultValue={editingTemplate.title}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="edit-isDefault"
                    defaultChecked={editingTemplate.isDefault}
                  />
                  <Label htmlFor="edit-isDefault">Standard mal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="edit-isActive"
                    defaultChecked={editingTemplate.isActive}
                  />
                  <Label htmlFor="edit-isActive">Aktiv</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Beskrivelse</Label>
                <Input
                  name="description"
                  id="edit-description"
                  defaultValue={editingTemplate.description || ''}
                />
              </div>
              <div>
                <Label htmlFor="edit-body">Mal-innhold</Label>
                <textarea
                  name="body"
                  id="edit-body"
                  rows={15}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  defaultValue={editingTemplate.body}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Oppdater mal</Button>
                <Button type="button" variant="outline" onClick={() => setEditingTemplate(null)}>
                  Avbryt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Test Email Modal */}
      {testEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Send test e-post: {testEmailModal.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="test-email">E-post adresse</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="test-subject">Emne</Label>
                <Input
                  id="test-subject"
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  placeholder="Test e-post fra Pengeplan"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Test variabler:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>navn: Test Bruker</li>
                  <li>beløp: 1000</li>
                  <li>dato: {new Date().toLocaleDateString('nb-NO')}</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setTestEmailModal(null)
                  setTestEmail('')
                  setTestSubject('')
                }}
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSendTestEmail}
                disabled={!testEmail || !testSubject}
              >
                <Send className="w-4 h-4 mr-2" />
                Send test e-post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
