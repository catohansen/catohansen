'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Power, 
  PowerOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Brain,
  Activity,
  Shield,
  Database,
  Globe,
  Bot,
  Target,
  TrendingUp
} from 'lucide-react'

interface FeatureToggleProps {
  feature: {
    id: string
    name: string
    description: string
    category: 'ai' | 'performance' | 'security' | 'analytics' | 'automation'
    enabled: boolean
    critical: boolean
    dependencies?: string[]
    impact: 'high' | 'medium' | 'low'
    lastModified?: Date
    version?: string
  }
  onToggle: (featureId: string, enabled: boolean) => Promise<void>
  loading?: boolean
}

const categoryIcons = {
  ai: Brain,
  performance: Activity,
  security: Shield,
  analytics: TrendingUp,
  automation: Zap
}

const categoryColors = {
  ai: 'bg-purple-100 text-purple-800',
  performance: 'bg-blue-100 text-blue-800',
  security: 'bg-red-100 text-red-800',
  analytics: 'bg-green-100 text-green-800',
  automation: 'bg-yellow-100 text-yellow-800'
}

const impactColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600'
}

export function FeatureToggle({ feature, onToggle, loading = false }: FeatureToggleProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    if (isToggling) return

    try {
      setIsToggling(true)
      setError(null)
      await onToggle(feature.id, !feature.enabled)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle feature')
    } finally {
      setIsToggling(false)
    }
  }

  const CategoryIcon = categoryIcons[feature.category]
  const isDisabled = loading || isToggling

  return (
    <Card className={`transition-all duration-200 ${
      feature.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              feature.enabled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <CategoryIcon className={`h-5 w-5 ${
                feature.enabled ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>{feature.name}</span>
                {feature.critical && (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    Critical
                  </Badge>
                )}
                <Badge className={`text-xs ${categoryColors[feature.category]}`}>
                  {feature.category}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {feature.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className={`text-sm font-medium ${
                feature.enabled ? 'text-green-600' : 'text-gray-500'
              }`}>
                {feature.enabled ? 'Enabled' : 'Disabled'}
              </div>
              {feature.lastModified && (
                <div className="text-xs text-gray-500">
                  {feature.lastModified.toLocaleDateString()}
                </div>
              )}
            </div>
            <Switch
              checked={feature.enabled}
              onCheckedChange={handleToggle}
              disabled={isDisabled}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Impact:</span>
              <span className={`font-medium ${impactColors[feature.impact]}`}>
                {feature.impact}
              </span>
            </div>
            {feature.version && (
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{feature.version}</span>
              </div>
            )}
          </div>

          {feature.dependencies && feature.dependencies.length > 0 && (
            <div className="text-xs text-gray-500">
              Dependencies: {feature.dependencies.join(', ')}
            </div>
          )}
        </div>

        {isToggling && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>{feature.enabled ? 'Disabling...' : 'Enabling...'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureToggleGridProps {
  features: Array<{
    id: string
    name: string
    description: string
    category: 'ai' | 'performance' | 'security' | 'analytics' | 'automation'
    enabled: boolean
    critical: boolean
    dependencies?: string[]
    impact: 'high' | 'medium' | 'low'
    lastModified?: Date
    version?: string
  }>
  onToggle: (featureId: string, enabled: boolean) => Promise<void>
  loading?: boolean
}

export function FeatureToggleGrid({ features, onToggle, loading = false }: FeatureToggleGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && feature.enabled) ||
                         (statusFilter === 'disabled' && !feature.enabled)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categoryCounts = features.reduce((acc, feature) => {
    acc[feature.category] = (acc[feature.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const enabledCount = features.filter(f => f.enabled).length
  const disabledCount = features.filter(f => !f.enabled).length

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Feature Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Features
              </label>
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories ({features.length})</option>
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status ({features.length})</option>
                <option value="enabled">Enabled ({enabledCount})</option>
                <option value="disabled">Disabled ({disabledCount})</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setStatusFilter('all')
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => (
          <FeatureToggle
            key={feature.id}
            feature={feature}
            onToggle={onToggle}
            loading={loading}
          />
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find the features you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



