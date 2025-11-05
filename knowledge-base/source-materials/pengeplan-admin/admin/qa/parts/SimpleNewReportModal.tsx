'use client'

import { useState } from 'react'
import { Plus, FileText, Loader2, Sparkles, Shield, Zap, Link as LinkIcon, TestTube } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface NewReportModalProps {
  onReportCreated?: () => void;
}

const testTemplates = [
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Omfattende sikkerhetstest av systemet',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    testType: 'security',
    priority: 'high',
    modules: ['Authentication', 'Authorization', 'Input Validation', 'Data Protection'],
    estimatedTests: 15
  },
  {
    id: 'functionality-test',
    name: 'Functionality Test',
    description: 'Test av alle hovedfunksjoner',
    icon: TestTube,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    testType: 'functionality',
    priority: 'medium',
    modules: ['User Management', 'Budget System', 'Reports', 'AI Features'],
    estimatedTests: 20
  },
  {
    id: 'performance-test',
    name: 'Performance Test',
    description: 'Test av systemets ytelse og responsivitet',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    testType: 'performance',
    priority: 'medium',
    modules: ['Database', 'API Endpoints', 'Frontend', 'File Operations'],
    estimatedTests: 10
  },
  {
    id: 'integration-test',
    name: 'Integration Test',
    description: 'Test av integrasjoner og API-er',
    icon: LinkIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    testType: 'integration',
    priority: 'high',
    modules: ['External APIs', 'Database', 'File System', 'Email System'],
    estimatedTests: 12
  },
  {
    id: 'e2e-test',
    name: 'End-to-End Test',
    description: 'Komplett brukerflyt testing',
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    testType: 'e2e',
    priority: 'critical',
    modules: ['User Registration', 'Login Flow', 'Budget Creation', 'Report Generation'],
    estimatedTests: 8
  }
]

export function SimpleNewReportModal({ onReportCreated }: NewReportModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: 'functionality',
    priority: 'medium',
    estimatedTests: 10
  });
  const handleTemplateSelect = (templateId: string) => {
    const template = testTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        title: template.name,
        description: template.description,
        testType: template.testType,
        priority: template.priority,
        estimatedTests: template.estimatedTests
      });
      setSelectedTemplate(templateId);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message with better styling
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
      successDiv.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        QA rapport opprettet successfully! Rapport ID: QA_REPORT_${Date.now()}
      `
      document.body.appendChild(successDiv);
      // Remove after 5 seconds

      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 5000)
      
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        testType: 'functionality',
        priority: 'medium',
        estimatedTests: 10
      });
      setSelectedTemplate('');
      onReportCreated?.()
    } catch {
      // Show error message with better styling
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
      errorDiv.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        En feil oppstod. Prøv igjen senere.
      `
      document.body.appendChild(errorDiv);
      // Remove after 5 seconds,

      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 5000)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover: from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg">
          <FileText className="h-4 w-4 mr-2" />
          New Report;
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Plus className="h-6 w-6 text-blue-500" />,

            Opprett ny QA rapport;
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Velg test mal</Label>
            <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-4">
              {testTemplates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;

                return (
                  <div
                    key={template.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${template.bgColor}`}>
                        <Icon className={`h-5 w-5 ${template.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <p className="text-xs text-gray-500">{template.estimatedTests} tester</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.modules.slice(0, 2).map((module) => (
                        <span key={module} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {module}
                        </span>
                      ))}
                      {template.modules.length > 2 && (
                        <span className="text-xs text-gray-500">+{template.modules.length - 2} mer</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Grunnleggende informasjon</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tittel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="QA rapport tittel"
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedTests">Estimert antall tester</Label>
                <Input
                  id="estimatedTests"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.estimatedTests}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTests: parseInt(e.target.value) || 1 }))}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beskrivelse av testen som skal utføres"
                rows={3}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Test Configuration */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Test konfigurasjon</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <select
                  id="testType"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="security">Security</option>
                  <option value="functionality">Functionality</option>
                  <option value="performance">Performance</option>
                  <option value="integration">Integration</option>
                  <option value="e2e">End-to-End</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritet</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
              className="px-6"
            >
              Avbryt
            </Button>
            <Button
              type="submit" 
              disabled={loading}
              className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <FileText className="h-4 w-4 mr-2" />
              Opprett rapport
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}














;